# Faculty of Engineering (eng.sjp.ac.lk) Announcements Portal & Web Scraper

An integrated, modern web application and Node.js scraper for the [Faculty of Engineering, University of Sri Jayewardenepura](https://eng.sjp.ac.lk). The portal features a sleek, responsive UI to browse, filter, search, and bookmark live announcements synchronized with Supabase.

---

## 🌟 Key Features

### 🌐 Modern Announcements Web Portal (`HTML`, `CSS`, `JavaScript`)
- **Rich Aesthetics**: Vibrant dark/light mode with glassmorphism, glowing ambient accents, and smooth transitions.
- **Live Supabase Synchronization**: Connects directly to Supabase via `@supabase/supabase-js` with instant offline fallback cache.
- **Category Filtering**: Filter by All Updates, 📢 Notices & Exams, 📰 News & Events, 💼 Opportunities & Vacancies, and ⭐ Saved Bookmarks.
- **Instant Search**: Real-time debounced search by keywords, batches (e.g., "09th Batch"), exam terms, or awards. Shortcut: press `/` anywhere to search.
- **Detailed Modal Dialog**: Click any announcement card to read the full description and navigate directly to the official university portal.
- **Interactive Bookmark & Share**: Save announcements to `localStorage` or copy official links to clipboard with toast notifications.
- **Responsive Layout**: Designed for mobile, tablet, and widescreen desktop displays.

### 🕷️ Intelligent Web Scraper (`scraper.js`)
- **Multi-Source Scraping**: Scrapes the homepage, `/notices/`, and `/vacancies/` using Cheerio.
- **WordPress REST API Enrichment**: Blends native WP metadata for exact publication dates and featured media.
- **Adaptive Database Schema**: Automatically detects existing Supabase columns and formats payloads dynamically.
- **Idempotent Inserts**: Deduplicates by canonical URL link to prevent repeated rows.

---

## 📁 Project Structure

```
├── index.html        # Modern HTML5 portal layout with semantic structure
├── styles.css        # Vanilla CSS design system with dark/light themes
├── app.js            # Client-side JavaScript with state & Supabase client
├── initial_data.json # Instant pre-cached dataset for zero-latency load
├── scraper.js        # Node.js web scraper and Supabase synchronization script
├── schema.sql        # Supabase SQL table setup and RLS migration script
├── package.json      # Dependencies and dev/build scripts
├── .env              # Supabase credentials (URL, Service Role / Anon Key)
└── README.md         # Documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies & Launch Portal
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the interactive portal.

### 2. Configure Environment (`.env`)
Verify or update your `.env` file with your Supabase credentials:
```ini
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
SUPABASE_TABLE_NAME=sjp_eng_data
```

### 3. Run the Scraper (To Populate or Sync Updates)
To sync latest announcements from `eng.sjp.ac.lk` directly into Supabase:
```bash
npm start
```
To test without inserting into the database:
```bash
npm run dry-run
```

If you haven't created the table or are seeing RLS policy errors (`42501`), open your [Supabase Dashboard](https://supabase.com/dashboard) -> **SQL Editor**, and run the SQL provided in [`schema.sql`](file:///c:/Users/sudee/Desktop/CGS%202.0/schema.sql):

```sql
-- Create table with unique constraint on link
CREATE TABLE IF NOT EXISTS public.sjp_eng_data (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    published_at TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS & allow public/anon read & insert (if using anon key)
ALTER TABLE public.sjp_eng_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert" ON public.sjp_eng_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.sjp_eng_data FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read" ON public.sjp_eng_data FOR SELECT USING (true);
```

### 4. Run the Scraper

To run the scraper and insert/update records directly into Supabase:

```bash
npm start
# or
node scraper.js
```

To test and preview the scraped data in your terminal without touching the database:

```bash
npm run dry-run
# or
node scraper.js --dry-run
```

---

## 📊 Extracted Data Schema

| Field | Type | Description |
|---|---|---|
| `title` | `TEXT` | Cleaned heading / title (entities like `&#8211;` decoded) |
| `category` | `TEXT` | `news`, `notice`, or `announcement` |
| `link` | `TEXT` | Canonical article / notice URL (marked `UNIQUE`) |
| `description` | `TEXT` | Formatted summary / excerpt with category prefix |
| `image_url` | `TEXT` | Featured banner or thumbnail image link |
| `published_at`| `TIMESTAMPTZ` | Article publication timestamp (ISO format) |
| `scraped_at`  | `TIMESTAMPTZ` | Timestamp when the scraper ran |
| `metadata`    | `JSONB` | Additional debug data (source, WordPress ID) |

---

## ⏰ Automated Scheduling

### Option 1: GitHub Actions (Free Cron)
Create `.github/workflows/scrape.yml` to run this scraper on a schedule (e.g., every 6 hours):

```yaml
name: Run SJP Eng Scraper
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: node scraper.js
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### Option 2: Windows Task Scheduler / Cron
You can run `node C:\path\to\scraper.js` in a recurring task.
