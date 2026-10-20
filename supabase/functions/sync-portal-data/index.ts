// ==============================================================================
// Supabase Edge Function: sync-portal-data
// 
// Automatically synchronizes latest news, notices, and vacancies from
// https://eng.sjp.ac.lk directly into the 'sjp_eng_data' Supabase table
// with zero duplicates.
//
// Deploy with: supabase functions deploy sync-portal-data
// ==============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const BASE_URL = "https://eng.sjp.ac.lk";
const TABLE_NAME = Deno.env.get("SUPABASE_TABLE_NAME") || "sjp_eng_data";

function cleanText(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(u: string | undefined | null): string {
  return u ? u.trim().replace(/\/+$/, "").toLowerCase() : "";
}

function cleanTitleKey(t: string | undefined | null): string {
  return t ? t.trim().toLowerCase() : "";
}

serve(async (req: Request) => {
  // Allow CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
      }
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  try {
    const endpoints = [
      { url: `${BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=20`, category: "news" },
      { url: `${BASE_URL}/wp-json/wp/v2/notice?_embed&per_page=20`, category: "notice" },
      { url: `${BASE_URL}/wp-json/wp/v2/vacancie?_embed&per_page=20`, category: "announcement" }
    ];

    const extractedItems: any[] = [];
    const seenLinks = new Set<string>();

    for (const { url, category } of endpoints) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 SJP-Scraper",
            "Accept": "application/json"
          }
        });

        if (!res.ok) continue;
        const posts = await res.json();
        if (!Array.isArray(posts)) continue;

        for (const item of posts) {
          const title = cleanText(item.title?.rendered);
          const link = item.link;
          if (!title || !link) continue;

          const normLink = normalizeUrl(link);
          if (seenLinks.has(normLink)) continue;
          seenLinks.add(normLink);

          const excerpt = cleanText(item.excerpt?.rendered);
          let imageUrl = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

          if (!imageUrl && item.content?.rendered) {
            const match = item.content.rendered.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
            if (match && !match[1].includes("logo") && !match[1].includes("icon")) {
              imageUrl = match[1];
            }
          }

          if (!imageUrl) {
            if (category === "notice") {
              imageUrl = "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/Web-Notice.jpg";
            } else if (category === "announcement") {
              imageUrl = "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg";
            } else {
              imageUrl = "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg";
            }
          }

          const tag = `[${category.toUpperCase()}]`;
          const desc = excerpt || `${tag} ${title}`;

          extractedItems.push({
            title,
            category,
            link,
            description: desc,
            image_url: imageUrl,
            published_at: item.date ? new Date(item.date).toISOString() : new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn(`Error fetching ${url}:`, err);
      }
    }

    // Fetch existing records to prevent duplicates
    const { data: existingRows, error: fetchErr } = await supabase
      .from(TABLE_NAME)
      .select("id, link, title")
      .range(0, 9999);

    if (fetchErr) throw fetchErr;

    const existingMap = new Map<string, number>();
    const existingTitleMap = new Map<string, number>();

    for (const r of existingRows || []) {
      if (r.link) existingMap.set(normalizeUrl(r.link), r.id);
      if (r.title) existingTitleMap.set(cleanTitleKey(r.title), r.id);
    }

    const newRecords: any[] = [];
    let updatedCount = 0;

    for (const item of extractedItems) {
      const linkKey = normalizeUrl(item.link);
      const titleKey = cleanTitleKey(item.title);
      const existingId = existingMap.get(linkKey) || existingTitleMap.get(titleKey);

      if (existingId) {
        // Update existing record with latest data
        const { error: updErr } = await supabase
          .from(TABLE_NAME)
          .update(item)
          .eq("id", existingId);
        if (!updErr) updatedCount++;
      } else {
        newRecords.push(item);
        if (linkKey) existingMap.set(linkKey, -1);
        if (titleKey) existingTitleMap.set(titleKey, -1);
      }
    }

    let insertedCount = 0;
    if (newRecords.length > 0) {
      const { data: insData, error: insErr } = await supabase
        .from(TABLE_NAME)
        .insert(newRecords)
        .select("id");
      if (insErr) {
        console.error("Error inserting records:", insErr);
      } else {
        insertedCount = insData ? insData.length : newRecords.length;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        scrapedTotal: extractedItems.length,
        updatedCount,
        insertedCount,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
