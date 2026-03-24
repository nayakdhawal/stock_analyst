import os
import yfinance as yf
from supabase import create_client, Client
import uuid
from dotenv import load_dotenv

load_dotenv('.env.local')

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
    exit(1)

supabase: Client = create_client(url, key)

# Some top BSE tickers to add
tickers = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
    "SBIN", "BHARTIARTL", "ITC", "HINDUNILVR", "LT",
    "BAJFINANCE", "ASIANPAINT", "HCLTECH", "MARUTI", "SUNPHARMA"
]

def populate_tickers():
    inserted_count = 0
    print("Starting to fetch and populate tickers into Supabase...")
    for t in tickers:
        bse_ticker = f"{t}.BO"
        try:
            print(f"Fetching data for {bse_ticker}...")
            stock = yf.Ticker(bse_ticker)
            info = stock.info
            
            # If the ticker doesn't exist, info might be empty or missing 'shortName'
            if not info or ("shortName" not in info and "longName" not in info):
                print(f"  -> Could not find data for {bse_ticker}, skipping.")
                continue

            company_name = info.get("shortName") or info.get("longName") or t
            exchange = "BSE"

            # Check if exists first to avoid duplicates
            existing = supabase.table('ticker_list').select('*').eq('ticker', bse_ticker).execute()
            if len(existing.data) == 0:
                data = {
                    "id": str(uuid.uuid4()),
                    "ticker": bse_ticker,
                    "company": company_name,
                    "exchange": exchange
                }
                result = supabase.table('ticker_list').insert(data).execute()
                print(f"  -> Added {bse_ticker}: {company_name}")
                inserted_count += 1
            else:
                print(f"  -> Skipped {bse_ticker} (already exists)")

        except Exception as e:
            print(f"  -> Error processing {t}: {e}")

    print(f"\nDone! Inserted {inserted_count} new tickers.")

if __name__ == "__main__":
    populate_tickers()
