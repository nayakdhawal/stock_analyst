from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

# For Vercel Serverless, app must be exposed in api/index.py
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/api/py/hello")
def hello():
    return {"message": "FastAPI is running!"}
