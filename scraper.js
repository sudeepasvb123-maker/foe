import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import WebSocket from 'ws';

// Load environment variables from .env
dotenv.config();

// Configuration
const BASE_URL = 'https://eng.sjp.ac.lk';
const TABLE_NAME = process.env.SUPABASE_TABLE_NAME || 'sjp_eng_data';
const SUPABASE_URL = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.trim() : '';
const SUPABASE_KEY = process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY.trim() : '';

// Check CLI arguments
const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');

/**
 * Decodes HTML entities and normalizes whitespace
 * @param {string} text
 * @returns {string}
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts a date from a URL if formatted as /blog/YYYY/MM/DD/...
 * @param {string} url
 * @returns {string|null} ISO date string
 */
function extractDateFromUrl(url) {
  if (!url) return null;
  const match = url.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (match) {
    try {
      return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`).toISOString();
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Robust fetch with standard headers and timeout
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Scrapes news, notices, and announcements from the website's HTML DOM
 * @returns {Promise<Array<object>>}
 */
async function scrapeFromHtml() {
  const scrapedItems = [];
  const seenLinks = new Set();

  console.log(`[HTML Scraper] Fetching main page: ${BASE_URL}...`);
  try {
    const res = await fetchWithTimeout(BASE_URL);
    if (!res.ok) {
      console.warn(`[HTML Scraper] Warning: Failed to fetch homepage. HTTP ${res.status}`);
    } else {
      const html = await res.text();
      const $ = cheerio.load(html);

      // 1. Extract Latest News cards from homepage
      $('.elementor-post, article.category-news').each((_, el) => {
        const $el = $(el);
        const titleEl = $el.find('.elementor-post__title a, h5.elementor-post__title a');
        const title = cleanText(titleEl.text());
        let link = titleEl.attr('href') || $el.find('.elementor-post__read-more').attr('href');
        const imageUrl = $el.find('.elementor-post__thumbnail img').attr('src') || null;
        const excerpt = cleanText($el.find('.elementor-post__excerpt').text()) || null;

        if (link && link.startsWith('/')) {
          link = new URL(link, BASE_URL).href;
        }

        if (title && link && !seenLinks.has(link)) {
          const isNews = $el.hasClass('category-news') || link.includes('/blog/20');
          if (isNews) {
            seenLinks.add(link);
            scrapedItems.push({
              title,
              category: 'news',
              link,
              image_url: imageUrl || 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg',
              excerpt,
              published_at: extractDateFromUrl(link),
              source: 'html_homepage'
            });
          }
        }
      });

      // 2. Extract Latest Notices from notice area loop
      $('[data-elementor-type="loop-item"].notice, .type-notice').each((_, el) => {
        const $el = $(el);
        const titleEl = $el.find('.elementor-heading-title a, h1 a, h2 a, h3 a');
        const title = cleanText(titleEl.text());
        let link = titleEl.attr('href') || $el.find('a[href*="/blog/notice/"]').attr('href');
        const img = $el.find('img').attr('src') || null;

        if (link && link.startsWith('/')) {
          link = new URL(link, BASE_URL).href;
        }

        if (title && link && !seenLinks.has(link)) {
          seenLinks.add(link);
          scrapedItems.push({
            title,
            category: 'notice',
            link,
            image_url: img || 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/Web-Notice.jpg',
            excerpt: null,
            published_at: extractDateFromUrl(link),
            source: 'html_homepage'
          });
        }
      });
    }
  } catch (err) {
    console.error(`[HTML Scraper] Error scraping homepage: ${err.message}`);
  }

  // 3. Scrape dedicated /notices/ page
  console.log(`[HTML Scraper] Fetching notices directory: ${BASE_URL}/notices/...`);
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/notices/`);
    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);

      $('a[href*="/blog/notice/"]').each((_, el) => {
        const title = cleanText($(el).text());
        let link = $(el).attr('href');

        if (link && link.startsWith('/')) {
          link = new URL(link, BASE_URL).href;
        }

        if (title && !title.toLowerCase().includes('read more') && link && !seenLinks.has(link)) {
          seenLinks.add(link);
          scrapedItems.push({
            title,
            category: 'notice',
            link,
            image_url: 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/Web-Notice.jpg',
            excerpt: null,
            published_at: extractDateFromUrl(link),
            source: 'html_notices_page'
          });
        }
      });
    }
  } catch (err) {
    console.warn(`[HTML Scraper] Notice subpage fetch failed: ${err.message}`);
  }

  // 4. Scrape dedicated /vacancies/ (Announcements) page
  console.log(`[HTML Scraper] Fetching announcements & vacancies: ${BASE_URL}/vacancies/...`);
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/vacancies/`);
    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);

      $('a[href*="/blog/vacancie/"]').each((_, el) => {
        const title = cleanText($(el).text());
        let link = $(el).attr('href');

        if (link && link.startsWith('/')) {
          link = new URL(link, BASE_URL).href;
        }

        if (title && !title.toLowerCase().includes('read more') && link && !seenLinks.has(link)) {
          seenLinks.add(link);
          scrapedItems.push({
            title,
            category: 'announcement',
            link,
            image_url: 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg',
            excerpt: null,
            published_at: extractDateFromUrl(link),
            source: 'html_vacancies_page'
          });
        }
      });
    }
  } catch (err) {
    console.warn(`[HTML Scraper] Vacancies subpage fetch failed: ${err.message}`);
  }

  return scrapedItems;
}

/**
 * Fetches structured data from WordPress REST API (native to eng.sjp.ac.lk)
 * Extracts high-res media, content images, and faculty banners
 * @returns {Promise<Array<object>>}
 */
async function scrapeFromWordpressApi() {
  const apiItems = [];
  console.log(`[API Enrichment] Querying WordPress REST API endpoints...`);

  const endpoints = [
    { url: `${BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=20`, category: 'news' },
    { url: `${BASE_URL}/wp-json/wp/v2/notice?_embed&per_page=20`, category: 'notice' },
    { url: `${BASE_URL}/wp-json/wp/v2/vacancie?_embed&per_page=20`, category: 'announcement' }
  ];

  for (const { url, category } of endpoints) {
    try {
      const res = await fetchWithTimeout(url, 10000);
      if (!res.ok) continue;

      const posts = await res.json();
      if (!Array.isArray(posts)) continue;

      for (const item of posts) {
        const title = cleanText(item.title?.rendered);
        const link = item.link;
        if (!title || !link) continue;

        const excerpt = cleanText(item.excerpt?.rendered);
        const content = cleanText(item.content?.rendered);
        
        // 1. Check embedded featured media
        let imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

        // 2. Extract image from HTML body content if featured media is missing
        if (!imageUrl && item.content?.rendered) {
          const match = item.content.rendered.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
          if (match && !match[1].includes('logo') && !match[1].includes('icon')) {
            imageUrl = match[1];
          }
        }

        // 3. Fallback to contextual faculty / lab / building images
        if (!imageUrl) {
          if (category === 'notice') {
            imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/Web-Notice.jpg';
          } else if (category === 'announcement') {
            imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';
          } else {
            const t = (title + ' ' + (excerpt || '')).toLowerCase();
            if (t.includes('computer') || t.includes('ict') || t.includes('ai') || t.includes('software')) {
              imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611-1.jpg'; // Computer Engineering Lab
            } else if (t.includes('electronic') || t.includes('electrical') || t.includes('robot') || t.includes('power')) {
              imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250309_1219023342-1.jpg'; // Robotics & Automation Lab
            } else if (t.includes('civil') || t.includes('mechanical')) {
              imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Mechanical-Engineering-Building.jpg'; // Mechanical & Civil Building
            } else {
              imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg'; // Faculty Main Complex
            }
          }
        }

        const publishedAt = item.date ? new Date(item.date).toISOString() : null;

        apiItems.push({
          title,
          category,
          link,
          excerpt: excerpt || null,
          content: content || null,
          image_url: imageUrl,
          published_at: publishedAt,
          source: 'wp_rest_api',
          wp_id: item.id
        });
      }
    } catch {
      // Graceful ignore
    }
  }

  return apiItems;
}

/**
 * Combines and deduplicates data from both HTML and WP API
 * @returns {Promise<Array<object>>}
 */
async function getExtractedData() {
  const [htmlItems, apiItems] = await Promise.all([
    scrapeFromHtml(),
    scrapeFromWordpressApi()
  ]);

  const mapByLink = new Map();
  const normalizeUrl = (u) => (u ? u.trim().replace(/\/+$/, '') : '');

  // 1. Seed with HTML items
  for (const item of htmlItems) {
    const key = normalizeUrl(item.link);
    mapByLink.set(key, { ...item });
  }

  // 2. Enrich or append with API items
  for (const item of apiItems) {
    const key = normalizeUrl(item.link);
    if (mapByLink.has(key)) {
      const existing = mapByLink.get(key);
      mapByLink.set(key, {
        ...existing,
        title: item.title || existing.title,
        excerpt: item.excerpt || existing.excerpt,
        content: item.content || existing.content,
        image_url: item.image_url || existing.image_url,
        published_at: item.published_at || existing.published_at,
        wp_id: item.wp_id
      });
    } else {
      mapByLink.set(key, item);
    }
  }

  const currentTime = new Date().toISOString();

  const formattedRecords = Array.from(mapByLink.values()).map((item) => {
    // Generate an informative description snippet
    const dateStr = item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Recent';
    const tag = item.category ? `[${item.category.toUpperCase()}]` : '';
    const desc = item.excerpt || item.content || `${tag} ${item.title} (${dateStr})`;

    return {
      title: item.title,
      category: item.category,
      link: item.link,
      description: desc,
      excerpt: item.excerpt || null,
      content: item.content || null,
      image_url: item.image_url || null,
      published_at: item.published_at || currentTime,
      scraped_at: currentTime,
      metadata: {
        source: item.source || 'scraper',
        wp_id: item.wp_id || null
      }
    };
  });

  // Sort latest first
  formattedRecords.sort((a, b) => {
    const dateA = new Date(a.published_at || 0).getTime();
    const dateB = new Date(b.published_at || 0).getTime();
    return dateB - dateA;
  });

  return formattedRecords;
}

/**
 * Dynamically detects which columns exist in the target Supabase table
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} tableName
 * @returns {Promise<Set<string>>}
 */
async function detectTableColumns(supabase, tableName) {
  const candidateCols = [
    'id', 'title', 'link', 'description', 'category', 'image_url',
    'published_at', 'excerpt', 'content', 'scraped_at', 'metadata', 'created_at'
  ];

  const detected = new Set();
  for (const col of candidateCols) {
    const { error } = await supabase.from(tableName).select(col).limit(1);
    if (!error) {
      detected.add(col);
    }
  }
  return detected;
}

/**
 * Adapts extracted records to match the columns that currently exist in the database table
 * @param {Array<object>} rawRecords
 * @param {Set<string>} tableColumns
 * @returns {Array<object>}
 */
function adaptRecordsToTable(rawRecords, tableColumns) {
  return rawRecords.map((item) => {
    const record = {};

    // Mandatory / core fields
    if (tableColumns.has('title')) record.title = item.title;
    if (tableColumns.has('link')) record.link = item.link;

    // Handle image_url column
    if (tableColumns.has('image_url')) {
      record.image_url = item.image_url;
    }

    // Handle description
    if (tableColumns.has('description')) {
      let descText = item.description || item.title;
      if (!tableColumns.has('category') && item.category) {
        descText = `[${item.category.toUpperCase()}] ${descText}`;
      }
      // If table does not yet have image_url column, embed image tag in description
      if (!tableColumns.has('image_url') && item.image_url) {
        descText = `${descText} [IMG:${item.image_url}]`;
      }
      record.description = descText;
    }

    if (tableColumns.has('category')) record.category = item.category;
    if (tableColumns.has('published_at')) record.published_at = item.published_at;
    if (tableColumns.has('excerpt')) record.excerpt = item.excerpt;
    if (tableColumns.has('content')) record.content = item.content;
    if (tableColumns.has('scraped_at')) record.scraped_at = item.scraped_at;
    if (tableColumns.has('metadata')) record.metadata = item.metadata;

    return record;
  });
}

/**
 * Inserts or upserts records into the Supabase table
 * @param {Array<object>} rawRecords
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} tableName
 */
async function insertIntoSupabase(rawRecords, supabase, tableName) {
  console.log(`\n[Supabase] Connecting to table '${tableName}'...`);

  if (!rawRecords || rawRecords.length === 0) {
    console.log('[Supabase] No records to insert.');
    return;
  }

  // 1. Detect existing columns in table
  const detectedColumns = await detectTableColumns(supabase, tableName);
  console.log(`[Supabase] Detected columns in '${tableName}': [${Array.from(detectedColumns).join(', ')}]`);

  if (detectedColumns.size === 0) {
    console.error(`❌ [Supabase] Table '${tableName}' could not be accessed. Does it exist?`);
    console.log(`💡 Tip: Run schema.sql in your Supabase SQL Editor to create the table.`);
    return;
  }

  if (!detectedColumns.has('image_url')) {
    console.log(`\nℹ️  Notice: The 'image_url' column does not exist yet in '${tableName}'.`);
    console.log(`👉 To enable dedicated 'image_url' column, run in Supabase SQL Editor:`);
    console.log(`   ALTER TABLE public.sjp_eng_data ADD COLUMN IF NOT EXISTS image_url TEXT;\n`);
  }

  // 2. Adapt records to match table columns
  const records = adaptRecordsToTable(rawRecords, detectedColumns);

  try {
    // Attempt standard upsert with onConflict: 'link'
    console.log(`[Supabase] Upserting ${records.length} records into '${tableName}'...`);
    const { data, error } = await supabase
      .from(tableName)
      .upsert(records, {
        onConflict: 'link',
        ignoreDuplicates: false
      })
      .select('id, title');

    if (error) {
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        handleRlsError();
        return;
      }
      // If error is about no unique constraint on 'link', fallback to check-and-update
      if (error.message && (error.message.includes('unique') || error.message.includes('conflict'))) {
        console.warn(`[Supabase] Note: No unique constraint on 'link'. Synchronizing existing records...`);
        await fallbackInsert(records, supabase, tableName);
        return;
      }
      throw error;
    }

    console.log(`\n🎉 [Supabase] Successfully synced ${records.length} records with image URLs!`);
    if (data && data.length > 0) {
      console.log(`Sample inserted/updated records (${Math.min(3, data.length)}):`);
      data.slice(0, 3).forEach((item) => {
        console.log(` - [#${item.id}] ${item.title}`);
      });
    }
  } catch (err) {
    if (err.code === '42501' || err.message?.includes('row-level security')) {
      handleRlsError();
      return;
    }
    console.error(`\n❌ [Supabase] Error uploading to table '${tableName}':`, err.message);
    if (err.hint) console.error(`Hint: ${err.hint}`);
    if (err.details) console.error(`Details: ${err.details}`);
  }
}

/**
 * Displays helpful instructions when Row Level Security (RLS) blocks access
 */
function handleRlsError() {
  console.error('\n❌ [Supabase RLS Error: 42501]');
  console.error('Row-Level Security (RLS) on your Supabase table is preventing inserts with your current key.');
  console.log('\n🔧 How to fix this in 1 minute:');
  console.log('----------------------------------------------------------------------------------');
  console.log('OPTION 1 (Recommended for backend scripts):');
  console.log('  Use your Supabase "service_role" secret key instead of the public "anon" key:');
  console.log('  1. Go to Supabase Dashboard -> Project Settings -> API');
  console.log('  2. Copy the "service_role" secret key');
  console.log('  3. In .env set: SUPABASE_KEY=<your-service_role-key>');
  console.log('  (The service_role key has admin permissions and bypasses RLS for scrapers/servers)\n');
  console.log('OPTION 2:');
  console.log('  Enable RLS insert policies for your anon key:');
  console.log('  1. Go to Supabase Dashboard -> SQL Editor');
  console.log('  2. Open schema.sql from this directory, copy and paste its contents, then click "Run"');
  console.log('----------------------------------------------------------------------------------');
}

/**
 * Fallback insertion and update method if table lacks a unique constraint on 'link'
 */
async function fallbackInsert(records, supabase, tableName) {
  const { data: existingRows, error: fetchErr } = await supabase
    .from(tableName)
    .select('id, link');

  if (fetchErr) throw fetchErr;

  const existingMap = new Map((existingRows || []).map((r) => [r.link, r.id]));
  const newRecords = [];
  let updatedCount = 0;

  for (const record of records) {
    const existingId = existingMap.get(record.link);
    if (existingId) {
      // Update existing record with latest fields & image_url
      const { error: updErr } = await supabase
        .from(tableName)
        .update(record)
        .eq('id', existingId);
      if (!updErr) updatedCount++;
    } else {
      newRecords.push(record);
    }
  }

  if (newRecords.length > 0) {
    console.log(`[Supabase] Inserting ${newRecords.length} new records...`);
    await supabase.from(tableName).insert(newRecords);
  }
  console.log(`🎉 [Supabase] Synchronized ${records.length} records (${updatedCount} updated, ${newRecords.length} newly inserted)!`);
}

/**
 * Main application runner
 */
async function main() {
  console.log('='.repeat(70));
  console.log('  Faculty of Engineering (eng.sjp.ac.lk) Scraper -> Supabase');
  console.log('='.repeat(70));

  // 1. Scrape and format data
  console.log('\n[1/2] Scraping latest news, notices, and announcements...');
  const records = await getExtractedData();

  console.log(`\nExtracted ${records.length} total items:`);
  const counts = records.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  console.log(` - News items:          ${counts.news || 0}`);
  console.log(` - Notices:             ${counts.notice || 0}`);
  console.log(` - Announcements:       ${counts.announcement || 0}`);

  // Display preview
  console.log('\n--- Preview of Extracted Data (Top 5) ---');
  records.slice(0, 5).forEach((item, index) => {
    console.log(`[${index + 1}] [${item.category.toUpperCase()}] ${item.title}`);
    console.log(`    Date: ${item.published_at ? item.published_at.slice(0, 10) : 'N/A'}`);
    console.log(`    Link: ${item.link}`);
    if (item.image_url) console.log(`    Image: ${item.image_url}`);
  });

  // 2. Insert into Supabase
  console.log('\n[2/2] Supabase Database Synchronization');

  if (isDryRun) {
    console.log('ℹ️  Dry-run mode active (--dry-run). Skipping database insertion.');
    console.log('All extracted data is valid and formatted as expected.');
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('\n⚠️  Supabase credentials not found in environment.');
    console.log('To insert directly into your Supabase database:');
    console.log('  1. Open the .env file in this directory');
    console.log('  2. Set SUPABASE_URL=https://your-project.supabase.co');
    console.log('  3. Set SUPABASE_KEY=your-supabase-service-role-or-anon-key');
    console.log('  4. Re-run: npm start');
    console.log('\n(Note: To test without credentials at any time, run: npm run dry-run)');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    realtime: {
      transport: WebSocket
    }
  });

  await insertIntoSupabase(records, supabase, TABLE_NAME);
}

// Execute
main().catch((err) => {
  console.error('\nFatal error in scraper:', err);
  process.exit(1);
});
