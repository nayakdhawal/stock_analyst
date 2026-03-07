# Supabase Integration Guide

This project uses Supabase for storing and retrieving stock ticker information. This guide outlines how it is integrated and how to maintain it.

## 1. Environment Variables
Stored in `.env.local`. Ensure these are set in your Supabase dashboard and copied here.

```env
NEXT_PUBLIC_SUPABASE_URL=https://vskmqieernhcfxhabmqv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza21xaWVlcm5oY2Z4aGFibXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNDQ4MTcsImV4cCI6MjA4MzYyMDgxN30.C_UjUHdWfxmun44oMBaUnfEA_3t0-MQmev7HkXBiQSk
```

## 2. Client Initialization
Location: [lib/supabase.ts](file:///Users/dhawalnayak/Documents/GitHub/stock_analyst/lib/supabase.ts)

The client is initialized once and exported for use throughout the application. It uses TypeScript types for better developer experience.

## 3. Database Schema
Location: [supabase/schema.sql](file:///Users/dhawalnayak/Documents/GitHub/stock_analyst/supabase/schema.sql)

The primary table used is `ticker_list`.
- **Columns**: `UID`, `ticker`, `company`, `Exchange`, `created_at`.
- **RLS**: Row-level security is enabled. Public read access is allowed for searches.

## 4. API Usage
Location: [app/api/stocks/search/route.ts](file:///Users/dhawalnayak/Documents/GitHub/stock_analyst/app/api/stocks/search/route.ts)

The `GET` endpoint performs a case-insensitive search (`ilike`) on both the ticker symbol and the company name.

## 5. Component Integration
Location: [components/chat-interface.tsx](file:///Users/dhawalnayak/Documents/GitHub/stock_analyst/components/chat-interface.tsx)

The `fetchSuggestions` function calls the search API as the user types, providing an autocomplete experience.

## 6. Verification
- **CLI**: Run `node scripts/test-supabase.js`
- **Browser**: Visit `/supabase-test` (once created)
