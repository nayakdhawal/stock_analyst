from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from datetime import datetime, timedelta

# For Vercel Serverless, app must be exposed in api/index.py
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

import os

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()] if allowed_origins_env else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.get("/api/py/ticker/{ticker}")
def get_ticker(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        return {
            "ticker": ticker,
            "shortName": info.get("shortName", "N/A"),
            "currentPrice": info.get("currentPrice", "N/A"),
            "regularMarketPrice": info.get("regularMarketPrice", "N/A"),
            "info": info
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/py/history/{ticker}")
def get_history(ticker: str, range: str = "1d"):
    period_map = {
        "1d": "1d",
        "1w": "5d",
        "2w": None,
        "1m": "1mo",
        "3m": "3mo",
        "6m": "6mo",
        "1y": "1y",
        "5y": "5y"
    }

    try:
        stock = yf.Ticker(ticker)
        
        if range == "2w":
            end_date = datetime.now()
            start_date = end_date - timedelta(days=14)
            hist = stock.history(start=start_date.strftime("%Y-%m-%d"), end=end_date.strftime("%Y-%m-%d"))
        else:
            yf_period = period_map.get(range, "1d")
            hist = stock.history(period=yf_period)

        hist = hist.reset_index()
        # Convert Timestamp objects to string for JSON serialization
        if not hist.empty and 'Date' in hist.columns:
            hist['Date'] = hist['Date'].astype(str)
        elif not hist.empty and 'Datetime' in hist.columns:
            hist['Datetime'] = hist['Datetime'].astype(str)
            
        records = hist.to_dict(orient="records")
        return {"ticker": ticker, "range": range, "data": records}
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/py/hello")
def hello():
    return {"message": "FastAPI is running!"}
