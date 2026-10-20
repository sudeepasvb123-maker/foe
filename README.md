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

## ⏰ Automated Daily Scheduling & Synchronization

Your portal stays automatically synchronized with official university updates without manual intervention or duplicate rows. You have two production-ready options:

### 🌟 Option 1: GitHub Actions (Recommended — Free & Fully Automated)

The workflow is pre-configured in [`.github/workflows/daily-scraper.yml`](.github/workflows/daily-scraper.yml). It triggers automatically every day at 02:00 UTC (07:30 AM Sri Lanka Time) and also provides a one-click manual run button.

#### Setup Steps:
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Add automated daily scraper and GitHub Actions workflow"
   git push origin main
   ```
2. In your GitHub repository, navigate to **Settings** -> **Secrets and variables** -> **Actions**.
3. Under **Repository secrets**, click **New repository secret** and add:
   - `SUPABASE_URL`: `https://zzirxpncvhqxhcjgbuek.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` secret key from **Project Settings** -> **API**
   - *(Optional)* `SUPABASE_TABLE_NAME`: `sjp_eng_data` (default)
4. Test run immediately on demand:
   - Go to the **Actions** tab on your GitHub repository.
   - Click **Daily SJP Engineering Scraper & Sync** on the left menu.
   - Click the **Run workflow** dropdown and click the green button.
   - Once completed, view the execution summary to see all synchronized items and metrics!

---

### ⚡ Option 2: Supabase Edge Functions (with `pg_cron`)

If you prefer running serverless directly within the Supabase ecosystem:

1. **Edge Function Source Code**: Available at [`supabase/functions/sync-portal-data/index.ts`](supabase/functions/sync-portal-data/index.ts).
2. **Deploy to Supabase**:
   ```bash
   npx supabase functions deploy sync-portal-data --no-verify-jwt
   ```
3. **Set Secrets in Supabase**:
   ```bash
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
4. **Schedule Daily Execution via SQL (`pg_cron`)**:
   Open Supabase **SQL Editor** and run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_cron;
   CREATE EXTENSION IF NOT EXISTS pg_net;

   SELECT cron.schedule(
     'daily-sjp-portal-sync',
     '0 2 * * *', -- Daily at 02:00 UTC (07:30 AM SLST)
     $$
     SELECT net.http_post(
       url := 'https://zzirxpncvhqxhcjgbuek.supabase.co/functions/v1/sync-portal-data',
       headers := jsonb_build_object(
         'Content-Type', 'application/json',
         'Authorization', 'Bearer <YOUR_SUPABASE_SERVICE_ROLE_KEY>'
       ),
       body := '{}'::jsonb
     ) AS request_id;
     $$
   );
   ```

