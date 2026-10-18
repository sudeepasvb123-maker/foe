-- ==============================================================================
-- Supabase Schema & Migration Script for 'sjp_eng_data'
--
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to "SQL Editor" on the left menu
-- 3. Click "New Query", paste this entire script, and click "Run"
-- ==============================================================================

-- 1. Create table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.sjp_eng_data (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add optional rich columns if they don't already exist
ALTER TABLE public.sjp_eng_data ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.sjp_eng_data ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.sjp_eng_data ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.sjp_eng_data ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.sjp_eng_data ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.sjp_eng_data ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.sjp_eng_data ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 3. Add unique constraint on link for idempotent upserts (prevents duplicate rows)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sjp_eng_data_link_unique'
    ) THEN
        ALTER TABLE public.sjp_eng_data ADD CONSTRAINT sjp_eng_data_link_unique UNIQUE (link);
    END IF;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_sjp_eng_data_category ON public.sjp_eng_data(category);
CREATE INDEX IF NOT EXISTS idx_sjp_eng_data_link ON public.sjp_eng_data(link);

-- 5. Row-Level Security (RLS) Settings
-- To allow your Node.js script to insert/update rows using the anon key:
ALTER TABLE public.sjp_eng_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read" ON public.sjp_eng_data;
CREATE POLICY "Allow anon read" ON public.sjp_eng_data
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert" ON public.sjp_eng_data;
CREATE POLICY "Allow anon insert" ON public.sjp_eng_data
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update" ON public.sjp_eng_data;
CREATE POLICY "Allow anon update" ON public.sjp_eng_data
    FOR UPDATE USING (true) WITH CHECK (true);

-- (Alternatively, you can provide your SUPABASE_SERVICE_ROLE_KEY in .env,
-- which bypasses RLS automatically for backend scrapers)
