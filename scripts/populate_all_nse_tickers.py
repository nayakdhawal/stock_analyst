import os
import uuid
import ssl
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

# This allows pandas to download the CSV on Macs where SSL certs might be missing
ssl._create_default_https_context = ssl._create_unverified_context

load_dotenv('.env.local')

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local")
    exit(1)

supabase: Client = create_client(url, key)

def populate_all_nse_tickers():
    print("Downloading master list of NSE Equities...")
    # Official NSE Equity List URL
    csv_url = "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
    
    try:
        df = pd.read_csv(csv_url)
    except Exception as e:
        print(f"Failed to download list: {e}")
        return

    print(f"Successfully downloaded {len(df)} tickers. Starting to insert...")
    
    # We will do a bulk insert in batches of 500 to be efficient
    batch_size = 500
    current_batch = []
    total_inserted = 0
    
    # Get all existing tickers to prevent duplicates
    print("Fetching existing tickers from Supabase to prevent duplicates...")
    existing_response = supabase.table('ticker_list').select('ticker').execute()
    existing_tickers = set(row['ticker'] for row in existing_response.data)

    for index, row in df.iterrows():
        symbol = str(row['SYMBOL']).strip()
        company_name = str(row['NAME OF COMPANY']).strip()
        
        # yfinance uses .NS suffix for National Stock Exchange of India
        nse_ticker = f"{symbol}.NS"
        
        if nse_ticker in existing_tickers:
            continue
            
        data = {
            "id": str(uuid.uuid4()),
            "ticker": nse_ticker,
            "company": company_name,
            "exchange": "NSE"
        }
        current_batch.append(data)
        
        if len(current_batch) >= batch_size:
            supabase.table('ticker_list').insert(current_batch).execute()
            total_inserted += len(current_batch)
            print(f"Inserted {total_inserted} rows...")
            current_batch = []
            
    # Insert any remaining rows
    if len(current_batch) > 0:
        supabase.table('ticker_list').insert(current_batch).execute()
        total_inserted += len(current_batch)
        print(f"Inserted {total_inserted} rows...")

    print(f"\nDone! Inserted {total_inserted} new NSE tickers into the database.")

if __name__ == "__main__":
    populate_all_nse_tickers()
