import yfinance as yf

def fetch_bse_stock(ticker):
    # Append .BO for Bombay Stock Exchange
    bse_ticker = f"{ticker}.BO"
    print(f"Fetching data for {bse_ticker}...")
    
    stock = yf.Ticker(bse_ticker)
    
    # Get current basic info
    current_price = stock.info.get("currentPrice", "N/A")
    short_name = stock.info.get("shortName", "N/A")
    
    print(f"Name: {short_name}")
    print(f"Current Price: ₹{current_price}")
    print("-" * 30)

if __name__ == "__main__":
    # Test with a few popular Indian stocks
    tickers_to_test = ["RELIANCE", "TCS", "HDFCBANK", "INFY"]
    
    for ticker in tickers_to_test:
        fetch_bse_stock(ticker)
