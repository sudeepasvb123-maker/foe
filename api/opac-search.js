/**
 * Backend Proxy Function: Koha OPAC Live Catalogue Search & Scraper
 * 
 * Works as a Vercel Serverless Function (/api/opac-search) and Node.js backend proxy.
 * Queries https://opac.lib.sjp.ac.lk/cgi-bin/koha/opac-search.pl with custom search indexes,
 * scrapes HTML search results using Cheerio, and returns clean JSON to the frontend.
 * Prevents CORS blocking and keeps all external requests invisible to the user.
 */

import * as cheerio from 'cheerio';

const OPAC_BASE_URL = 'https://opac.lib.sjp.ac.lk';

const KOHA_IDX_MAP = {
  catalog: 'kw',
  title: 'ti',
  author: 'au',
  subject: 'su',
  isbn: 'nb',
  issn: 'ns',
  series: 'se',
  callnumber: 'callnum'
};

const DISCIPLINE_FALLBACK_COVERS = {
  civil: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  mechanical: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
  computer: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&q=80',
  software: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
  electrical: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=80',
  mathematics: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80'
};

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
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function ensureAbsoluteUrl(path, base = OPAC_BASE_URL) {
  if (!path) return '';
  const cleanPath = path.trim();
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  const cleanBase = base.replace(/\/+$/, '');
  const cleanRel = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${cleanBase}${cleanRel}`;
}

function inferCategory(title, subjectText, materialText) {
  const combined = `${title || ''} ${subjectText || ''} ${materialText || ''}`.toLowerCase();
  if (combined.includes('civil') || combined.includes('concrete') || combined.includes('structural') || combined.includes('soil') || combined.includes('fluid') || combined.includes('survey')) {
    return 'Civil Engineering';
  }
  if (combined.includes('mechanical') || combined.includes('thermodynamics') || combined.includes('machine') || combined.includes('aerospace') || combined.includes('manufacturing')) {
    return 'Mechanical Engineering';
  }
  if (combined.includes('computer') || combined.includes('algorithm') || combined.includes('software') || combined.includes('network') || combined.includes('database') || combined.includes('programming')) {
    return 'Computer Science';
  }
  if (combined.includes('electric') || combined.includes('electronic') || combined.includes('circuit') || combined.includes('power') || combined.includes('control') || combined.includes('telecom')) {
    return 'Electrical Engineering';
  }
  if (combined.includes('math') || combined.includes('calculus') || combined.includes('statistics') || combined.includes('probability') || combined.includes('algebra') || combined.includes('physics')) {
    return 'Mathematics';
  }
  return 'Engineering Reference';
}

function getDisciplineCover(category, isbn) {
  if (isbn && isbn.length >= 9) {
    const cleanIsbn = isbn.replace(/[^0-9xX]/g, '');
    return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg?default=false`;
  }
  const cat = (category || '').toLowerCase();
  if (cat.includes('civil')) return DISCIPLINE_FALLBACK_COVERS.civil;
  if (cat.includes('mechanical')) return DISCIPLINE_FALLBACK_COVERS.mechanical;
  if (cat.includes('computer')) return DISCIPLINE_FALLBACK_COVERS.computer;
  if (cat.includes('electrical')) return DISCIPLINE_FALLBACK_COVERS.electrical;
  if (cat.includes('mathematics')) return DISCIPLINE_FALLBACK_COVERS.mathematics;
  return DISCIPLINE_FALLBACK_COVERS.default;
}

export async function scrapeKohaOpac(query = '', index = 'catalog', maxResults = 25) {
  const cleanQuery = query.trim();
  const kohaIdx = KOHA_IDX_MAP[index] || 'kw';
  
  const encodedQuery = encodeURIComponent(cleanQuery);
  const targetUrl = cleanQuery
    ? `${OPAC_BASE_URL}/cgi-bin/koha/opac-search.pl?idx=${encodeURIComponent(kohaIdx)}&q=${encodedQuery}&count=${maxResults}`
    : `${OPAC_BASE_URL}/cgi-bin/koha/opac-search.pl?q=engineering&count=${maxResults}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!res.ok) {
      throw new Error(`Koha OPAC server returned HTTP ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const books = [];
    const seenTitles = new Set();

    $('td.bibliocol').each((_, el) => {
      if (books.length >= maxResults) return false;

      const $bib = $(el);
      const parentRow = $bib.closest('tr');

      // 1. Title & Detail Link
      const titleLink = $bib.find('a.title').first();
      let rawTitle = cleanText(titleLink.text());
      let relHref = titleLink.attr('href') || '';

      if (!rawTitle) {
        // Fallback title lookup from cover link or aria-label
        const coverLink = $bib.find('div.coverimages a').first();
        rawTitle = cleanText(coverLink.find('span.no-image').attr('title') || coverLink.attr('title') || '');
        if (!relHref) relHref = coverLink.attr('href') || '';
      }

      if (!rawTitle) {
        const inputSelect = parentRow.find('input[name="biblionumber"]');
        const ariaLabel = inputSelect.attr('aria-label') || '';
        rawTitle = cleanText(ariaLabel.replace(/Select search result:\s*/i, ''));
      }

      // If title ends with trailing slash or colon (standard MARC format in Koha)
      rawTitle = rawTitle.replace(/\s*[\/:]\s*$/, '').trim();

      if (!rawTitle) return;

      const dedupKey = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenTitles.has(dedupKey)) return;
      seenTitles.add(dedupKey);

      // Extract Biblionumber
      let biblionumber = '';
      const bibMatch = relHref.match(/biblionumber=(\d+)/i);
      if (bibMatch) {
        biblionumber = bibMatch[1];
      } else {
        const inputCb = parentRow.find('input[name="biblionumber"]');
        biblionumber = inputCb.val() || String(Math.floor(Math.random() * 900000) + 100000);
      }

      const officialLink = ensureAbsoluteUrl(relHref || `/cgi-bin/koha/opac-detail.pl?biblionumber=${biblionumber}`);

      // 2. Author Extraction
      let author = cleanText($bib.find('span.author, a[href*="opac-search.pl?q=au:"]').first().text());
      if (!author) {
        // Koha often formats author as "by Author Name" in text following title
        const fullText = $bib.text();
        const byMatch = fullText.match(/by\s+([^\n\r.]+)/i);
        if (byMatch) {
          author = cleanText(byMatch[1]);
        }
      }

      let seriesVal = '';
      const seriesMatch = author.match(/Series:\s*([^;,\n]+)/i);
      if (seriesMatch) {
        seriesVal = cleanText(seriesMatch[1]);
      }

      author = author
        .replace(/Series:.*$/i, '')
        .replace(/Language:.*$/i, '')
        .replace(/Publication:.*$/i, '')
        .replace(/^by\s+/i, '')
        .replace(/\s*[\/:]\s*$/, '')
        .trim();

      if (!author) {
        author = 'Faculty Reference Collection';
      }

      // 3. Availability Parsing
      const availEl = $bib.find('.results_summary.availability, .availability');
      const availText = cleanText(availEl.text()).toLowerCase();
      let availability_status = 'Available';

      if (availText.includes('no items available') || availText.includes('checked out') || availText.includes('on loan') || availText.includes('borrowed')) {
        availability_status = 'On Loan';
      } else if (availText.includes('reference only') || availText.includes('not for loan') || availText.includes('in-library') || availText.includes('reference')) {
        availability_status = 'Reference Only';
      } else if (availText.includes('available for loan') || availText.includes('items available')) {
        availability_status = 'Available';
      }

      // 4. Material Type & Category
      const materialType = cleanText($bib.find('.results_material_type, .results_summary.type').text());
      const category = inferCategory(rawTitle, cleanText($bib.find('.results_summary.subjects').text()), materialType);

      // 5. ISBN, Series & Call Number
      const isbnEl = $bib.find('div.coverimages');
      let isbn = isbnEl.attr('data-isbn') || '';
      if (!isbn) {
        const isbnMatch = $bib.text().match(/ISBN(?:-1[03])?:\s*([0-9Xx-]+)/i);
        if (isbnMatch) isbn = isbnMatch[1].trim();
      }

      const seriesEl = $bib.find('.results_summary.series');
      let series = cleanText(seriesEl.text().replace(/^Series:\s*/i, '')) || seriesVal;

      const callNumText = cleanText($bib.find('.results_summary.callnumber, .ItemSummary').text());
      let callNumber = '';
      const callMatch = callNumText.match(/Call number:\s*([^\s;.]+)/i);
      if (callMatch) callNumber = callMatch[1].trim();

      // 6. Cover Image
      let coverImg = parentRow.find('img.thumbnail, img.cover-image, div.coverimages img').first().attr('src');
      if (coverImg && (coverImg.includes('no-image') || coverImg.includes('spacer') || coverImg.includes('BK.png'))) {
        coverImg = '';
      }
      if (coverImg) {
        coverImg = ensureAbsoluteUrl(coverImg);
      } else {
        coverImg = getDisciplineCover(category, isbn);
      }

      books.push({
        id: `opac_${biblionumber}`,
        biblionumber,
        title: rawTitle,
        author,
        category,
        availability_status,
        official_link: officialLink,
        cover_image_url: coverImg,
        isbn: isbn || null,
        call_number: callNumber || null,
        source: 'University Library Koha OPAC'
      });
    });

    return {
      success: true,
      source: 'koha_opac_live',
      query: cleanQuery,
      index,
      count: books.length,
      targetUrl,
      books
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Standard Vercel Serverless Function Handler
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = (req.query?.q || req.body?.q || '').toString();
  const index = (req.query?.idx || req.query?.index || req.body?.index || 'catalog').toString();
  const limit = parseInt(req.query?.limit || req.body?.limit || '25', 10);

  try {
    const results = await scrapeKohaOpac(query, index, limit);
    res.status(200).json(results);
  } catch (error) {
    console.error('[Koha Proxy] Scrape error:', error.message);
    res.status(502).json({
      success: false,
      source: 'koha_opac_error',
      message: 'Failed to retrieve records from university library server',
      error: error.message,
      books: []
    });
  }
}
