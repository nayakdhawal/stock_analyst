-- Documentation of actual ticker_list schema
-- Table: public.ticker_list
-- Columns:
--   - UID: uuid or text (Primary Key)
--   - ticker: text (Stock symbol, e.g., AAPL)
--   - company: text (Company name, e.g., Apple Inc.)
--   - Exchange: text (e.g., NASDAQ)
--   - created_at: timestamptz

-- Row Level Security (RLS) setup for ticker_list
ALTER TABLE public.ticker_list ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.ticker_list
    FOR SELECT USING (true);

-- Allow service role management
CREATE POLICY "Allow service role management" ON public.ticker_list
    FOR ALL USING (auth.role() = 'service_role');
