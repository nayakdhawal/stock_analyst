"use client";
import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// STOCK REGISTRY — stable fields only. price & change injected by yfinance later.
// ─────────────────────────────────────────────────────────────────────────────
const STOCK_DATABASE = [
  { ticker: "RELIANCE.NS", name: "Reliance Industries Limited", sector: "Energy", exchange: "NSE" },
  { ticker: "TCS.NS", name: "Tata Consultancy Services Ltd", sector: "Technology", exchange: "NSE" },
  { ticker: "HDFCBANK.NS", name: "HDFC Bank Limited", sector: "Banking", exchange: "NSE" },
  { ticker: "INFY.NS", name: "Infosys Limited", sector: "Technology", exchange: "NSE" },
  { ticker: "ICICIBANK.NS", name: "ICICI Bank Limited", sector: "Banking", exchange: "NSE" },
  { ticker: "WIPRO.NS", name: "Wipro Limited", sector: "Technology", exchange: "NSE" },
  { ticker: "HINDUNILVR.NS", name: "Hindustan Unilever Limited", sector: "FMCG", exchange: "NSE" },
  { ticker: "ITC.NS", name: "ITC Limited", sector: "FMCG", exchange: "NSE" },
  { ticker: "BAJFINANCE.NS", name: "Bajaj Finance Limited", sector: "Finance", exchange: "NSE" },
  { ticker: "MARUTI.NS", name: "Maruti Suzuki India Limited", sector: "Automobile", exchange: "NSE" },
  { ticker: "SUNPHARMA.NS", name: "Sun Pharmaceutical Industries", sector: "Pharma", exchange: "NSE" },
  { ticker: "TITAN.NS", name: "Titan Company Limited", sector: "Consumer", exchange: "NSE" },
  { ticker: "KOTAKBANK.NS", name: "Kotak Mahindra Bank Limited", sector: "Banking", exchange: "NSE" },
  { ticker: "ASIANPAINT.NS", name: "Asian Paints Limited", sector: "Consumer", exchange: "NSE" },
  { ticker: "AXISBANK.NS", name: "Axis Bank Limited", sector: "Banking", exchange: "NSE" },
  { ticker: "LTIM.NS", name: "LTIMindtree Limited", sector: "Technology", exchange: "NSE" },
  { ticker: "ULTRACEMCO.NS", name: "UltraTech Cement Limited", sector: "Materials", exchange: "NSE" },
  { ticker: "NESTLEIND.NS", name: "Nestle India Limited", sector: "FMCG", exchange: "NSE" },
  { ticker: "POWERGRID.NS", name: "Power Grid Corporation of India", sector: "Utilities", exchange: "NSE" },
  { ticker: "ONGC.NS", name: "Oil & Natural Gas Corporation", sector: "Energy", exchange: "NSE" },
  { ticker: "BHARTIARTL.NS", name: "Bharti Airtel Limited", sector: "Telecom", exchange: "NSE" },
  { ticker: "DRREDDY.NS", name: "Dr. Reddy's Laboratories Ltd", sector: "Pharma", exchange: "NSE" },
  { ticker: "HCLTECH.NS", name: "HCL Technologies Limited", sector: "Technology", exchange: "NSE" },
  { ticker: "JSWSTEEL.NS", name: "JSW Steel Limited", sector: "Materials", exchange: "NSE" },
  { ticker: "TATAMOTORS.NS", name: "Tata Motors Limited", sector: "Automobile", exchange: "NSE" },
  { ticker: "TATASTEEL.NS", name: "Tata Steel Limited", sector: "Materials", exchange: "NSE" },
  { ticker: "ADANIENT.NS", name: "Adani Enterprises Limited", sector: "Conglomerate", exchange: "NSE" },
  { ticker: "ADANIPORTS.NS", name: "Adani Ports & SEZ Limited", sector: "Infrastructure", exchange: "NSE" },
  { ticker: "TECHM.NS", name: "Tech Mahindra Limited", sector: "Technology", exchange: "NSE" },
  { ticker: "SBILIFE.NS", name: "SBI Life Insurance Company Ltd", sector: "Insurance", exchange: "NSE" },
];

const TOP_STOCKS = [
  { ticker: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy" },
  { ticker: "TCS.NS", name: "TCS", sector: "Technology" },
  { ticker: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking" },
  { ticker: "INFY.NS", name: "Infosys", sector: "Technology" },
  { ticker: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom" },
  { ticker: "MARUTI.NS", name: "Maruti Suzuki", sector: "Automobile" },
  { ticker: "SUNPHARMA.NS", name: "Sun Pharma", sector: "Pharma" },
  { ticker: "TATAMOTORS.NS", name: "Tata Motors", sector: "Automobile" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PAGE DATA — replace this object with your live yfinance fetch
// In production: const stock = await fetch(`/api/stock/${ticker}`).then(r => r.json())
// ─────────────────────────────────────────────────────────────────────────────
const RELIANCE_DATA = {
  ticker: "RELIANCE.NS", shortName: "RELIANCE INDUSTRIES LTD",
  longName: "Reliance Industries Limited", exchange: "NSE", currency: "INR",
  marketState: "CLOSED", website: "https://www.ril.com",
  sector: "Energy", industry: "Oil & Gas Refining & Marketing",
  fullTimeEmployees: 403303,
  longBusinessSummary: "Reliance Industries Limited engages in the hydrocarbon exploration and production, oil and chemicals, retail, and digital service businesses worldwide. It operates through Oil to Chemicals, Oil and Gas, Retail, Digital Services, and Others segments. The company offers refining and marketing products, including liquefied petroleum gas, propylene, naphtha, gasoline, jet/aviation turbine fuel, kerosine oil, diesel, sulphur, and petroleum coke. It also provides polymers, including high-density and low-density polyethylene (PE), linear low-density PE, homopolymer, random and impact copolymer, and polyvinyl chloride; fibre intermediates, such as purified terephthalic acid, and ethylene glycols and oxide; aromatics, such as paraxylene, ortho xylene, benzene, and linear alkyl benzene and paraffin; and textiles comprising fabrics, apparel, and auto furnishings. In addition, the company offers elastomers, such as polybutadiene rubber, styrene butadiene rubber, and butyl rubber; fibre and yarn polyesters; and bioenergy solutions, consisting of compressed biogas, and pellets and briquettes. Further, it engages in oil and gas exploration and production activities; and operates various stores comprising supermarket, hypermarket, wholesale cash and carry, specialty, and online stores, as well as stores that offer apparel, beauty and cosmetics, accessories, footwear, consumer electronics, and others. Additionally, the company operates media and entertainment platforms, and Network18 and television channels; publishes magazines; and offers highway hospitality and fleet management services. It also provides digital services, including connectivity, fibre, mobile devices, apps, business, and other digital solutions. The company was founded in 1957 and is based in Mumbai, India.",
  currentPrice: 1414.40, regularMarketPreviousClose: 1384.80,
  regularMarketOpen: 1398.00, regularMarketDayLow: 1396.10,
  regularMarketDayHigh: 1430.00, regularMarketDayRange: "1396.1 - 1430.0",
  regularMarketChange: 29.599976, regularMarketChangePercent: 2.137491,
  regularMarketVolume: 22993855, averageVolume: 13710676, averageDailyVolume10Day: 19389338,
  fiftyTwoWeekLow: 1114.85, fiftyTwoWeekHigh: 1611.80,
  fiftyTwoWeekRange: "1114.85 - 1611.8",
  fiftyTwoWeekLowChange: 299.55, fiftyTwoWeekLowChangePercent: 0.26869,
  fiftyTwoWeekHighChange: -197.40, fiftyTwoWeekHighChangePercent: -0.12247,
  fiftyTwoWeekChangePercent: 0.08624,
  fiftyDayAverage: 1411.98, fiftyDayAverageChange: 2.42, fiftyDayAverageChangePercent: 0.001713,
  twoHundredDayAverage: 1447.778, twoHundredDayAverageChange: -33.378, twoHundredDayAverageChangePercent: -0.023054,
  marketCap: 19140328816640, enterpriseValue: 22379199725568,
  enterpriseToRevenue: 2.184, enterpriseToEbitda: 13.285,
  trailingPE: 22.987, forwardPE: 21.525, priceToBook: 2.182, bookValue: 648.12,
  priceToSalesTrailing12Months: 1.868, beta: 0.205, trailingEps: 61.53, forwardEps: 65.708,
  dividendRate: 5.5, dividendYield: 0.39, payoutRatio: 0.0894, fiveYearAvgDividendYield: 0.44,
  totalRevenue: 10245479858176, revenuePerShare: 757.082,
  netIncomeToCommon: 832110002176, ebitda: 1684509949952,
  grossProfits: 3665570037760, totalDebt: 3745930018816,
  totalCash: 2238710022144, totalCashPerShare: 165.457, debtToEquity: 35.651,
  grossMargins: 0.35777, operatingMargins: 0.11852, ebitdaMargins: 0.16441, profitMargins: 0.08122,
  revenueGrowth: 0.104, earningsGrowth: 0.006, earningsQuarterlyGrowth: 0.006,
  targetLowPrice: 1370, targetMeanPrice: 1720.086, targetHighPrice: 2020,
  recommendationKey: "strong_buy", recommendationMean: 1.45714,
  numberOfAnalystOpinions: 35, averageAnalystRating: "1.5 - Strong Buy",
  heldPercentInsiders: 0.51049, heldPercentInstitutions: 0.27971,
  floatShares: 6606391655, sharesOutstanding: 13532472634,
  auditRisk: 7, boardRisk: 10, compensationRisk: 7, shareHolderRightsRisk: 1, overallRisk: 10,
  companyOfficers: [
    { name: "Mr. Mukesh Dhirubhai Ambani", title: "Chairman & MD", age: 68 },
    { name: "Mr. Nikhil Rasiklal Meswani", title: "Executive Director", age: 59 },
    { name: "Mr. Hital Rasiklal Meswani", title: "Executive Director", age: 57 },
    { name: "Mr. Srikanth Venkatachari", title: "Chief Financial Officer", age: 59 },
    { name: "Mr. Anant Mukesh Ambani", title: "Whole-Time Director", age: null },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const fmtNum = (n, d = 2) => n?.toLocaleString("en-IN", { maximumFractionDigits: d });
const fmtPct = (n, d = 2) => `${(n * 100).toFixed(d)}%`;
const fmtCr = (n) => { const cr = n / 1e7; return cr >= 1e5 ? `₹${(cr / 1e5).toFixed(2)}L Cr` : `₹${fmtNum(cr, 0)} Cr`; };
const fmtChg = (n) => `${n >= 0 ? "+" : ""}${fmtNum(Math.abs(n))}`;
const fmtPctChg = (n) => `${n >= 0 ? "+" : ""}${(Math.abs(n) * 100).toFixed(2)}%`;
const TICKER_ITEMS = STOCK_DATABASE.map(s => `${s.ticker}  ·  ${s.name}  ·  ${s.sector}`);
const useWindowWidth = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 800);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
};
const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────────────────────────────────────
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=UnifrakturMaguntia&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .search-input { width:100%; border:none; outline:none; background:transparent; font-family:'Playfair Display',serif; font-size:clamp(1rem,3vw,1.4rem); font-weight:700; color:#1a1208; letter-spacing:-0.01em; }
  .search-input::placeholder { color:#b0a080; font-weight:400; font-style:italic; }
  .search-box { border:3px solid #1a1208; background:#faf7f0; padding:14px 18px; display:flex; align-items:center; gap:12px; position:relative; box-shadow:4px 4px 0 #1a1208; transition:box-shadow 0.15s; }
  .search-box:focus-within { box-shadow:6px 6px 0 #8b1a1a; border-color:#8b1a1a; }
  .dropdown { position:absolute; top:calc(100% + 4px); left:-3px; right:-3px; background:#faf7f0; border:3px solid #1a1208; box-shadow:6px 6px 0 #1a1208; z-index:100; max-height:380px; overflow-y:auto; }
  .dropdown::-webkit-scrollbar { width:4px; } .dropdown::-webkit-scrollbar-track { background:#ede8dc; } .dropdown::-webkit-scrollbar-thumb { background:#8b7355; }
  .drop-item { padding:10px 16px; cursor:pointer; border-bottom:1px solid #e8e0d0; transition:background 0.1s; text-align: left; }
  .drop-item:hover, .drop-item.active { background:#1a1208; color:#f5f0e8; }
  .drop-item:hover .drop-sub, .drop-item.active .drop-sub { color:#a89060; }
  .drop-item:last-child { border-bottom:none; }
  .drop-ticker { font-family:'Libre Baskerville',serif; font-size:11px; font-weight:700; letter-spacing:0.1em; }
  .drop-name   { font-family:'Libre Baskerville',serif; font-size:12px; font-weight:700; margin-top:1px; }
  .drop-sub    { font-family:'Libre Baskerville',serif; font-size:10px; color:#8b7355; font-style:italic; }
  .tabs-row { display:flex; overflow-x:auto; -webkit-overflow-scrolling:touch; border-top:2px solid #1a1208; padding-top:4px; scrollbar-width:none; }
  .tabs-row::-webkit-scrollbar { display:none; }
  .tab-btn { flex-shrink:0; cursor:pointer; padding:5px 12px; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; font-family:'Libre Baskerville',serif; border:1px solid transparent; background:none; transition:all 0.2s; color:#1a1208; }
  .tab-btn.active { background:#1a1208; color:#f5f0e8; }
  .tab-btn:hover:not(.active) { border-color:#8b7355; }
  .drop-cap::first-letter { float:left; font-size:4em; line-height:0.78; margin:0.04em 0.08em 0 0; font-weight:900; color:#8b1a1a; font-family:'Playfair Display',serif; }
  .story-cols { columns:1; column-gap:20px; column-rule:1px solid #8b7355; }
  @media(min-width:640px){ .story-cols { columns:2; } }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  @media(max-width:420px){ .grid-3 { grid-template-columns:1fr 1fr; } }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
  .fade-up { animation:fadeUp 0.4s ease forwards; }
  .ink-box { border:1px solid #8b7355; padding:12px; background:#ede8dc; }
  .dark-box { background:#1a1208; color:#f5f0e8; padding:14px 16px; }
  .warn-box { background:#f0ded0; border:2px solid #8b1a1a; padding:12px; }
  .metric-card { border:1px solid #8b7355; padding:12px; background:#ede8dc; text-align:center; }
  .notice-banner { background:#1a1208; color:#f5f0e8; padding:6px 16px; text-align:center; font-family:'Libre Baskerville',serif; font-size:11px; letter-spacing:0.15em; }
  .back-btn { display:inline-flex; align-items:center; gap:8px; background:none; border:1px solid #8b7355; padding:6px 14px; font-family:'Libre Baskerville',serif; font-size:11px; letter-spacing:0.1em; cursor:pointer; color:#1a1208; transition:all 0.15s; }
  .back-btn:hover { background:#1a1208; color:#f5f0e8; border-color:#1a1208; }
  .nav-search-input::placeholder { color:#b0a080; font-style:italic; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SHARED: SEARCH BAR (used on both landing and detail pages)
// ─────────────────────────────────────────────────────────────────────────────
function SearchBar({ onNavigate, compact = false }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 1) { setResults([]); setIsOpen(false); return; }
    
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data || []);
          setIsOpen((data || []).length > 0);
          setHighlighted(-1);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const handler = setTimeout(fetchResults, 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && highlighted >= 0) { go(results[highlighted]); }
    if (e.key === "Escape") { setIsOpen(false); setQuery(""); }
  };

  const go = (stock) => {
    setQuery("");
    setIsOpen(false);
    onNavigate(stock);
  };

  return (
    <div ref={dropRef} style={{ position: "relative", width: "100%" }}>
      <div className="search-box" style={compact ? { padding: "10px 14px", boxShadow: "3px 3px 0 #1a1208" } : {}}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: compact ? 18 : 22, fontWeight: 900, color: "#8b1a1a", flexShrink: 0, lineHeight: 1 }}>⌕</span>
        <input
          ref={inputRef}
          className="search-input"
          style={compact ? { fontSize: "1rem" } : {}}
          type="text"
          placeholder={compact ? "Search another stock…" : "Search by name, ticker or sector…"}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button onClick={() => { setQuery(""); setIsOpen(false); inputRef.current?.focus(); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#8b7355", flexShrink: 0, lineHeight: 1, padding: "0 4px" }}>×</button>
        )}
      </div>
      {isOpen && (
        <div className="dropdown">
          <div style={{ padding: "6px 16px", background: "#1a1208", fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a89060" }}>
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </div>
          {results.map((s, i) => (
            <div key={s.ticker}
              className={`drop-item ${i === highlighted ? "active" : ""}`}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => go(s)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span className="drop-name" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: i === highlighted ? "#d4c9b0" : "#8b7355", flexShrink: 0 }}>·</span>
                <span className="drop-ticker" style={{ color: i === highlighted ? "#f0c040" : "#8b1a1a", flexShrink: 0 }}>{s.ticker}</span>
                <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: i === highlighted ? "#d4c9b0" : "#8b7355", flexShrink: 0 }}>·</span>
                <span className="drop-sub" style={{ flexShrink: 0 }}>{s.sector}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH BAR INLINE — borderless version for the ink nav strip on detail page
// ─────────────────────────────────────────────────────────────────────────────
function SearchBarInline({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 1) { setResults([]); setIsOpen(false); return; }
    
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data || []);
          setIsOpen((data || []).length > 0);
          setHighlighted(-1);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const handler = setTimeout(fetchResults, 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && highlighted >= 0) { go(results[highlighted]); }
    if (e.key === "Escape") { setIsOpen(false); setQuery(""); }
  };

  const go = (stock) => { setQuery(""); setIsOpen(false); onNavigate(stock); };

  return (
    <div ref={dropRef} style={{ position: "relative", flex: 1 }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder="Search another stock…"
        autoComplete="off"
        spellCheck="false"
        style={{
          width: "100%", border: "none", outline: "none", background: "transparent",
          fontFamily: "'Libre Baskerville',serif", fontSize: 11,
          letterSpacing: "0.05em", color: "#1a1208", caretColor: "#8b1a1a",
          className: "nav-search-input",
        }}
      />
      <style>{`.nav-placeholder::placeholder{color:#5a4a2a}`}</style>

      {/* Dropdown — same newspaper style, anchors below the strip */}
      {isOpen && (
        <div className="dropdown" style={{ top: "calc(100% + 10px)", left: -32 }}>
          <div style={{ padding: "6px 16px", background: "#1a1208", fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a89060" }}>
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </div>
          {results.map((s, i) => (
            <div key={s.ticker}
              className={`drop-item ${i === highlighted ? "active" : ""}`}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => go(s)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span className="drop-name" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: i === highlighted ? "#d4c9b0" : "#8b7355", flexShrink: 0 }}>·</span>
                <span className="drop-ticker" style={{ color: i === highlighted ? "#f0c040" : "#8b1a1a", flexShrink: 0 }}>{s.ticker}</span>
                <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: i === highlighted ? "#d4c9b0" : "#8b7355", flexShrink: 0 }}>·</span>
                <span className="drop-sub" style={{ flexShrink: 0 }}>{s.sector}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


const Kicker = ({ children }) => <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700 }}>{children}</div>;
const Byline = ({ children }) => <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#5a4a2a", borderTop: "1px solid #8b7355", borderBottom: "1px solid #8b7355", padding: "3px 0", margin: "6px 0" }}>{children}</div>;
const RuleDouble = () => <hr style={{ border: "none", borderTop: "3px double #1a1208", margin: "8px 0" }} />;
const RuleThin = () => <hr style={{ border: "none", borderTop: "1px solid #8b7355", margin: "8px 0" }} />;
const DataRow = ({ label, value, valueColor }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Libre Baskerville',serif", fontSize: 12, borderBottom: "1px dotted #8b7355", padding: "5px 0", gap: 8 }}>
    <span style={{ color: "#5a4a2a", flexShrink: 0 }}>{label}</span>
    <strong style={{ color: valueColor || "#1a1208", textAlign: "right" }}>{value}</strong>
  </div>
);
const ChangeChip = ({ value, pct, isPositive }) => (
  <span style={{ display: "inline-block", background: isPositive ? "#2d6a2d" : "#8b1a1a", color: "#fff", padding: "2px 10px", fontFamily: "'Libre Baskerville',serif", fontSize: 12, fontWeight: 700 }}>
    {isPositive ? "▲" : "▼"} {value} ({pct})
  </span>
);
const BarRow = ({ label, value, displayValue, max = 100, color = "#1a1208" }) => (
  <div style={{ marginBottom: 13 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Libre Baskerville',serif", fontSize: 12, marginBottom: 4 }}>
      <span>{label}</span><strong style={{ color }}>{displayValue}</strong>
    </div>
    <div style={{ height: 10, background: "#d4c9b0", border: "1px solid #c4b898" }}>
      <div style={{ height: "100%", width: `${Math.min((value / max) * 100, 100)}%`, background: color }} />
    </div>
  </div>
);
const RiskBar = ({ label, value }) => {
  const color = value <= 3 ? "#2d6a2d" : value <= 6 ? "#8b6030" : "#8b1a1a";
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Libre Baskerville',serif", fontSize: 12, marginBottom: 4 }}>
        <span>{label}</span><span style={{ color, fontWeight: 900 }}>{value} / 10</span>
      </div>
      <div style={{ height: 8, background: "#d4c9b0" }}><div style={{ height: "100%", width: `${value * 10}%`, background: color }} /></div>
    </div>
  );
};
const SectionHead = ({ kicker, title, byline, isMobile }) => (
  <div style={{ borderBottom: "3px double #1a1208", paddingBottom: 10, marginBottom: 16 }}>
    <Kicker>{kicker}</Kicker>
    <h1 style={{ fontSize: isMobile ? "1.35rem" : "clamp(1.5rem,3.5vw,2.4rem)", fontWeight: 900, lineHeight: 1.15, margin: "6px 0", letterSpacing: "-0.01em" }}>{title}</h1>
    <Byline>{byline}</Byline>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────
function DetailPage({ ticker, onBack, onNavigate }) {
  const [activeSection, setActiveSection] = useState("markets");
  const [tick, setTick] = useState(0);
  const [aiData, setAiData] = useState(null);    // null = not fetched yet
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width < 960;
  const px = isMobile ? 12 : 20;

  const [stock, setStock] = useState(null);
  const [loadingStock, setLoadingStock] = useState(true);
  const [stockError, setStockError] = useState(null);

  useEffect(() => {
    if (!ticker) return;
    setLoadingStock(true);
    setStockError(null);
    fetch(`/api/py/ticker/${ticker}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);

        const info = data.info || {};
        setStock({
          ticker: data.ticker,
          shortName: info.shortName || info.longName || data.ticker,
          longName: info.longName || info.shortName || data.ticker,
          exchange: info.exchange || "NSE",
          currency: info.currency || "INR",
          marketState: "LIVE",
          website: info.website || "",
          sector: info.sector || "Unknown",
          industry: info.industry || "Unknown",
          fullTimeEmployees: info.fullTimeEmployees || 0,
          longBusinessSummary: info.longBusinessSummary || "No description available.",

          currentPrice: info.currentPrice || info.regularMarketPrice || 0,
          regularMarketPreviousClose: info.regularMarketPreviousClose || 0,
          regularMarketOpen: info.regularMarketOpen || 0,
          regularMarketDayLow: info.regularMarketDayLow || info.dayLow || 0,
          regularMarketDayHigh: info.regularMarketDayHigh || info.dayHigh || 0,
          regularMarketDayRange: `${info.regularMarketDayLow || info.dayLow || 0} - ${info.regularMarketDayHigh || info.dayHigh || 0}`,
          regularMarketChange: (info.currentPrice || info.regularMarketPrice || 0) - (info.regularMarketPreviousClose || 0),
          regularMarketChangePercent: (info.regularMarketPreviousClose ? ((info.currentPrice || info.regularMarketPrice || 0) - info.regularMarketPreviousClose) / info.regularMarketPreviousClose : 0),
          regularMarketVolume: info.regularMarketVolume || info.volume || 0,
          averageVolume: info.averageVolume || 0,
          averageDailyVolume10Day: info.averageDailyVolume10Day || 0,

          fiftyTwoWeekLow: info.fiftyTwoWeekLow || 0,
          fiftyTwoWeekHigh: info.fiftyTwoWeekHigh || 0,
          fiftyTwoWeekRange: `${info.fiftyTwoWeekLow || 0} - ${info.fiftyTwoWeekHigh || 0}`,
          fiftyTwoWeekLowChange: (info.currentPrice || 0) - (info.fiftyTwoWeekLow || 0),
          fiftyTwoWeekLowChangePercent: info.fiftyTwoWeekLow ? ((info.currentPrice || 0) - info.fiftyTwoWeekLow) / info.fiftyTwoWeekLow : 0,
          fiftyTwoWeekHighChange: (info.currentPrice || 0) - (info.fiftyTwoWeekHigh || 0),
          fiftyTwoWeekHighChangePercent: info.fiftyTwoWeekHigh ? ((info.currentPrice || 0) - info.fiftyTwoWeekHigh) / info.fiftyTwoWeekHigh : 0,
          fiftyTwoWeekChangePercent: info["52WeekChange"] || 0,

          fiftyDayAverage: info.fiftyDayAverage || 0,
          fiftyDayAverageChange: (info.currentPrice || 0) - (info.fiftyDayAverage || 0),
          fiftyDayAverageChangePercent: info.fiftyDayAverage ? ((info.currentPrice || 0) - info.fiftyDayAverage) / info.fiftyDayAverage : 0,
          twoHundredDayAverage: info.twoHundredDayAverage || 0,
          twoHundredDayAverageChange: (info.currentPrice || 0) - (info.twoHundredDayAverage || 0),
          twoHundredDayAverageChangePercent: info.twoHundredDayAverage ? ((info.currentPrice || 0) - info.twoHundredDayAverage) / info.twoHundredDayAverage : 0,

          marketCap: info.marketCap || 0,
          enterpriseValue: info.enterpriseValue || 0,
          enterpriseToRevenue: info.enterpriseToRevenue || 0,
          enterpriseToEbitda: info.enterpriseToEbitda || 0,
          trailingPE: info.trailingPE || 0,
          forwardPE: info.forwardPE || 0,
          priceToBook: info.priceToBook || 0,
          bookValue: info.bookValue || 0,
          priceToSalesTrailing12Months: info.priceToSalesTrailing12Months || 0,
          beta: info.beta || 0,
          trailingEps: info.trailingEps || 0,
          forwardEps: info.forwardEps || 0,

          dividendRate: info.dividendRate || 0,
          dividendYield: info.dividendYield || 0,
          payoutRatio: info.payoutRatio || 0,
          fiveYearAvgDividendYield: info.fiveYearAvgDividendYield || 0,

          totalRevenue: info.totalRevenue || 0,
          revenuePerShare: info.revenuePerShare || 0,
          netIncomeToCommon: info.netIncomeToCommon || 0,
          ebitda: info.ebitda || 0,
          grossProfits: info.grossProfits || 0,
          totalDebt: info.totalDebt || 0,
          totalCash: info.totalCash || 0,
          totalCashPerShare: info.totalCashPerShare || 0,
          debtToEquity: info.debtToEquity || 0,

          grossMargins: info.grossMargins || 0,
          operatingMargins: info.operatingMargins || 0,
          ebitdaMargins: info.ebitdaMargins || 0,
          profitMargins: info.profitMargins || 0,

          revenueGrowth: info.revenueGrowth || 0,
          earningsGrowth: info.earningsGrowth || 0,
          earningsQuarterlyGrowth: info.earningsQuarterlyGrowth || 0,

          targetLowPrice: info.targetLowPrice || 0,
          targetMeanPrice: info.targetMeanPrice || 0,
          targetHighPrice: info.targetHighPrice || 0,
          recommendationKey: info.recommendationKey || "none",
          recommendationMean: info.recommendationMean || 0,
          numberOfAnalystOpinions: info.numberOfAnalystOpinions || 0,
          averageAnalystRating: (info.recommendationMean || "") + " " + (info.recommendationKey || "none"),

          heldPercentInsiders: info.heldPercentInsiders || 0,
          heldPercentInstitutions: info.heldPercentInstitutions || 0,
          floatShares: info.floatShares || 0,
          sharesOutstanding: info.sharesOutstanding || 0,

          auditRisk: info.auditRisk || 0,
          boardRisk: info.boardRisk || 0,
          compensationRisk: info.compensationRisk || 0,
          shareHolderRightsRisk: info.shareHolderRightsRisk || 0,
          overallRisk: info.overallRisk || 0,

          companyOfficers: info.companyOfficers || []
        });
        setLoadingStock(false);
      })
      .catch(err => {
        setStockError(err.message);
        setLoadingStock(false);
      });
  }, [ticker]);

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 40); return () => clearInterval(id); }, []);


  if (loadingStock) {
    return (
      <div style={{ background: "#f5f0e8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Libre Baskerville',serif", color: "#1a1208" }}>
        <p>Loading Telegraph Data for {ticker}...</p>
      </div>
    );
  }

  if (stockError || !stock) {
    return (
      <div style={{ background: "#f5f0e8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Libre Baskerville',serif", color: "#1a1208", flexDirection: "column" }}>
        <p>Error retrieving telegraph data for {ticker}: {stockError}</p>
        <button onClick={onBack} style={{ marginTop: 20, padding: "8px 16px", background: "#1a1208", color: "#f5f0e8", border: "none", cursor: "pointer", fontFamily: "'Libre Baskerville',serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>Go Back</button>
      </div>
    );
  }

  const tickerStr = [...TICKER_ITEMS, ...TICKER_ITEMS].join("     ·     ");
  const tickerOffset = -(tick * 0.4) % (tickerStr.length * 7.2);

  // ── n8n webhook proxy — bypasses CORS by routing through Next.js server ──
  const N8N_WEBHOOK_URL = "/api/ai-analysis";
  const runAnalysis = () => {
    setAiData(null);
    setAiError(null);
    setAiLoading(true);
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: stock.longName }),
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setAiData(data); setAiLoading(false); })
      .catch(err => { setAiError(err.message); setAiLoading(false); });
  };

  const isUp = stock.regularMarketChange >= 0;
  const sliderPct = ((stock.currentPrice - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100;
  const col2 = { display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 2px 1fr", gap: isTablet ? "20px 0" : "0 20px" };

  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh", fontFamily: "'Playfair Display',Georgia,serif", color: "#1a1208", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` }}>

      {/* ── NAV STRIP ── */}
      <div style={{ background: "#ede8dc", borderBottom: "3px solid #1a1208", padding: `8px ${px}px` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>

          {/* Back / Home button — solid ink pill */}
          <button onClick={onBack} style={{
            background: "#1a1208", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
            fontFamily: "'Libre Baskerville',serif", fontSize: 10,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#f5f0e8", padding: "6px 14px",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#8b1a1a"}
            onMouseLeave={e => e.currentTarget.style.background = "#1a1208"}
          >
            <span style={{ fontSize: 13, lineHeight: 1 }}>←</span>
            <span>Home</span>
          </button>

          {/* Vertical rule */}
          <div style={{ width: 1, height: 20, background: "#8b7355", flexShrink: 0 }} />

          {/* Search box — bordered, clearly defined */}
          <div style={{ flex: 1, minWidth: 180, maxWidth: 460 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#faf7f0", border: "1px solid #1a1208", padding: "6px 12px" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#8b1a1a", lineHeight: 1, flexShrink: 0 }}>⌕</span>
              <SearchBarInline onNavigate={onNavigate} />
            </div>
          </div>

          {/* Vertical rule */}
          {!isMobile && <div style={{ width: 1, height: 20, background: "#8b7355", flexShrink: 0 }} />}

          {/* Market state */}
          {!isMobile && (
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", flexShrink: 0, color: "#1a1208" }}>
              <span>{stock.exchange} · </span>
              <span style={{ color: stock.marketState === "CLOSED" ? "#8b1a1a" : "#2d6a2d", fontWeight: 700 }}>
                {stock.marketState}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── MASTHEAD — same structure as landing page ── */}
      <div style={{ borderBottom: "4px solid #1a1208", padding: `10px ${px}px 0` }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "flex-end", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
          {!isMobile && (
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.1em", color: "#5a4a2a" }}>
              {stock.ticker} · {stock.exchange} · {stock.currency}
            </div>
          )}
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontFamily: "'UnifrakturMaguntia',cursive", fontSize: isMobile ? "1.8rem" : "clamp(1.8rem,4.5vw,2.8rem)", lineHeight: 1, color: "#1a1208" }}>
              The Market Chronicle
            </div>
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5a4a2a", marginTop: 2 }}>
              {isMobile ? new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : today}
            </div>
          </div>
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#5a4a2a", textAlign: isMobile ? "center" : "right" }}>
            <div style={{ fontWeight: 700, color: "#1a1208" }}>{stock.shortName}</div>
            <div style={{ color: stock.marketState === "CLOSED" ? "#8b1a1a" : "#2d6a2d", fontWeight: 700 }}>
              {stock.marketState}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-row">
          {["markets", "financials", "valuation", "analyst", "governance", "about company", "ai analysis"].map(s => (
            <button key={s} className={`tab-btn ${activeSection === s ? "active" : ""}`} onClick={() => setActiveSection(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div style={{ background: "#1a1208", color: "#f5f0e8", padding: "5px 0", overflow: "hidden" }}>
        <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 11, letterSpacing: "0.08em", display: "inline-block", whiteSpace: "nowrap", transform: `translateX(${tickerOffset}px)` }}>
          {tickerStr}
        </span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: `16px ${px}px 32px` }}>

        {/* ══ MARKETS ══ */}
        {activeSection === "markets" && (
          <div className="fade-up">
            <SectionHead kicker={`${stock.exchange} · ${stock.sector} · ${stock.industry}`} title={`${stock.longName} (${stock.ticker})`} byline={`${stock.currency} · ${stock.exchange} · MARKET ${stock.marketState}`} isMobile={isMobile} />
            <div className="ink-box" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 4 }}>Last Traded Price · {stock.currency}</div>
                  <div style={{ fontSize: isMobile ? "2.4rem" : "3.4rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }}>₹{fmtNum(stock.currentPrice)}</div>
                  <div style={{ marginTop: 8 }}><ChangeChip value={`₹${fmtNum(Math.abs(stock.regularMarketChange))}`} pct={`${stock.regularMarketChangePercent >= 0 ? "+" : ""}${stock.regularMarketChangePercent.toFixed(2)}%`} isPositive={isUp} /></div>
                  <div style={{ marginTop: 5, fontFamily: "'Libre Baskerville',serif", fontSize: 11, color: "#5a4a2a" }}>Prev. Close: ₹{fmtNum(stock.regularMarketPreviousClose)}</div>
                </div>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, lineHeight: 2.1, minWidth: 180 }}>
                  <DataRow label="Open" value={`₹${fmtNum(stock.regularMarketOpen)}`} />
                  <DataRow label="Day Range" value={stock.regularMarketDayRange} />
                  <DataRow label="Volume" value={fmtNum(stock.regularMarketVolume, 0)} />
                  <DataRow label="Avg Vol (3M)" value={fmtNum(stock.averageVolume, 0)} />
                  <DataRow label="Avg Vol (10D)" value={fmtNum(stock.averageDailyVolume10Day, 0)} />
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 6 }}>52-Week Range</div>
              <div style={{ position: "relative", height: 24 }}>
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 0, height: 4, background: "#d4c9b0", borderRadius: 2 }}>
                  <div style={{ position: "absolute", left: 0, width: `${sliderPct}%`, height: "100%", background: "#8b1a1a", borderRadius: 2 }} />
                  <div style={{ position: "absolute", width: 13, height: 13, background: "#1a1208", borderRadius: "50%", top: "50%", transform: "translate(-50%,-50%)", left: `${sliderPct}%`, border: "2px solid #f5f0e8", boxShadow: "0 0 0 1px #1a1208" }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Libre Baskerville',serif", fontSize: 11, color: "#5a4a2a", marginTop: 4 }}>
                <div><div>Low: ₹{fmtNum(stock.fiftyTwoWeekLow)}</div><div style={{ color: stock.fiftyTwoWeekLowChange >= 0 ? "#2d6a2d" : "#8b1a1a", fontSize: 10 }}>{fmtChg(stock.fiftyTwoWeekLowChange)} / {fmtPctChg(stock.fiftyTwoWeekLowChangePercent)} from low</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontWeight: 900 }}>₹{fmtNum(stock.currentPrice)}</div><div style={{ fontSize: 10, color: "#8b7355" }}>Current</div></div>
                <div style={{ textAlign: "right" }}><div>High: ₹{fmtNum(stock.fiftyTwoWeekHigh)}</div><div style={{ color: stock.fiftyTwoWeekHighChange >= 0 ? "#2d6a2d" : "#8b1a1a", fontSize: 10 }}>{fmtChg(stock.fiftyTwoWeekHighChange)} / {fmtPctChg(stock.fiftyTwoWeekHighChangePercent)} from high</div></div>
              </div>
            </div>
            <RuleDouble />
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 10 }}>vs. Moving Averages</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                {[{ label: "50-Day Average", avg: stock.fiftyDayAverage, change: stock.fiftyDayAverageChange, pct: stock.fiftyDayAverageChangePercent }, { label: "200-Day Average", avg: stock.twoHundredDayAverage, change: stock.twoHundredDayAverageChange, pct: stock.twoHundredDayAverageChangePercent }].map(({ label, avg, change, pct }) => (
                  <div key={label} className="ink-box">
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>₹{fmtNum(avg)}</div>
                    <ChangeChip value={`₹${fmtNum(Math.abs(change))}`} pct={fmtPctChg(Math.abs(pct))} isPositive={change >= 0} />
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#8b7355", marginTop: 4 }}>current price vs this average</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="dark-box" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div><div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#a89060" }}>52-WEEK CHANGE</div><div style={{ fontSize: 28, fontWeight: 900, color: stock.fiftyTwoWeekChangePercent >= 0 ? "#6dda6d" : "#ff7070" }}>{stock.fiftyTwoWeekChangePercent >= 0 ? "+" : ""}{(stock.fiftyTwoWeekChangePercent * 100).toFixed(2)}%</div></div>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 11, color: "#d4c9b0", lineHeight: 2 }}>
                  <div>Float Shares: {fmtNum(stock.floatShares, 0)}</div>
                  <div>Shares Outstanding: {fmtNum(stock.sharesOutstanding, 0)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ FINANCIALS ══ */}
        {activeSection === "financials" && (
          <div className="fade-up">
            <SectionHead kicker={`${stock.shortName} · Financial Summary`} title="Income, Margins & Balance Sheet" byline={`${stock.currency} · SOURCE: ${stock.exchange} FILINGS`} isMobile={isMobile} />
            <div style={col2}>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 8 }}>Income Statement</div>
                <DataRow label="Total Revenue" value={fmtCr(stock.totalRevenue)} />
                <DataRow label="Revenue / Share" value={`₹${fmtNum(stock.revenuePerShare)}`} />
                <DataRow label="Gross Profits" value={fmtCr(stock.grossProfits)} />
                <DataRow label="EBITDA" value={fmtCr(stock.ebitda)} />
                <DataRow label="Net Income" value={fmtCr(stock.netIncomeToCommon)} />
                <DataRow label="EPS (TTM)" value={`₹${fmtNum(stock.trailingEps)}`} />
                <DataRow label="Forward EPS" value={`₹${fmtNum(stock.forwardEps)}`} />
                <RuleThin />
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", margin: "8px 0" }}>Balance Sheet</div>
                <DataRow label="Total Cash" value={fmtCr(stock.totalCash)} valueColor="#2d6a2d" />
                <DataRow label="Cash / Share" value={`₹${fmtNum(stock.totalCashPerShare)}`} />
                <DataRow label="Total Debt" value={fmtCr(stock.totalDebt)} valueColor="#8b1a1a" />
                <DataRow label="Debt / Equity" value={`${fmtNum(stock.debtToEquity)}%`} />
                <DataRow label="Enterprise Value" value={fmtCr(stock.enterpriseValue)} />
                <DataRow label="Enterprise / Revenue" value={fmtNum(stock.enterpriseToRevenue)} />
                <DataRow label="Enterprise / EBITDA" value={fmtNum(stock.enterpriseToEbitda)} />
                <RuleThin />
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", margin: "8px 0" }}>Growth (YoY)</div>
                <DataRow label="Revenue Growth" value={fmtPct(stock.revenueGrowth)} valueColor={stock.revenueGrowth >= 0 ? "#2d6a2d" : "#8b1a1a"} />
                <DataRow label="Earnings Growth" value={fmtPct(stock.earningsGrowth)} valueColor={stock.earningsGrowth >= 0 ? "#2d6a2d" : "#8b1a1a"} />
                <DataRow label="Qtrly Earnings Growth" value={fmtPct(stock.earningsQuarterlyGrowth)} valueColor={stock.earningsQuarterlyGrowth >= 0 ? "#2d6a2d" : "#8b1a1a"} />
              </div>
              {!isTablet && <div style={{ background: "#8b7355" }} />}
              {isTablet && <RuleThin />}
              <div>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 10 }}>Margin Analysis</div>
                <BarRow label="Gross Margin" value={stock.grossMargins * 100} displayValue={fmtPct(stock.grossMargins)} max={60} />
                <BarRow label="EBITDA Margin" value={stock.ebitdaMargins * 100} displayValue={fmtPct(stock.ebitdaMargins)} max={60} />
                <BarRow label="Operating Margin" value={stock.operatingMargins * 100} displayValue={fmtPct(stock.operatingMargins)} max={60} />
                <BarRow label="Profit Margin" value={stock.profitMargins * 100} displayValue={fmtPct(stock.profitMargins)} max={60} />
                <RuleThin />
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", margin: "8px 0" }}>Dividend</div>
                <DataRow label="Dividend / Share" value={`₹${fmtNum(stock.dividendRate)}`} />
                <DataRow label="Dividend Yield" value={`${fmtNum(stock.dividendYield)}%`} />
                <DataRow label="Payout Ratio" value={fmtPct(stock.payoutRatio)} />
                <DataRow label="5-Year Avg Yield" value={`${fmtNum(stock.fiveYearAvgDividendYield)}%`} />
              </div>
            </div>
          </div>
        )}

        {/* ══ VALUATION ══ */}
        {activeSection === "valuation" && (
          <div className="fade-up">
            <SectionHead kicker={`${stock.shortName} · Valuation Multiples`} title="Price Multiples & Book Value" byline={`${stock.currency} · TRAILING & FORWARD ESTIMATES`} isMobile={isMobile} />
            <div className="grid-2" style={{ marginBottom: 16 }}>
              {[{ label: "Trailing P/E", val: fmtNum(stock.trailingPE) }, { label: "Forward P/E", val: fmtNum(stock.forwardPE) }, { label: "Price / Book", val: `${fmtNum(stock.priceToBook)}x` }, { label: "Book Value / Share", val: `₹${fmtNum(stock.bookValue)}` }, { label: "Price / Sales (TTM)", val: fmtNum(stock.priceToSalesTrailing12Months) }, { label: "EV / Revenue", val: fmtNum(stock.enterpriseToRevenue) }, { label: "EV / EBITDA", val: fmtNum(stock.enterpriseToEbitda) }, { label: "Beta", val: fmtNum(stock.beta) }, { label: "Trailing EPS", val: `₹${fmtNum(stock.trailingEps)}` }, { label: "Forward EPS", val: `₹${fmtNum(stock.forwardEps)}` }].map(({ label, val }) => (
                <div key={label} className="metric-card">
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a" }}>{label}</div>
                  <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, margin: "6px 0", color: "#1a1208" }}>{val}</div>
                </div>
              ))}
            </div>
            <div className="ink-box">
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700, marginBottom: 12 }}>Current Price vs. Key Levels</div>
              {[{ label: "50-Day MA", avg: stock.fiftyDayAverage, chg: stock.fiftyDayAverageChange, pct: stock.fiftyDayAverageChangePercent }, { label: "200-Day MA", avg: stock.twoHundredDayAverage, chg: stock.twoHundredDayAverageChange, pct: stock.twoHundredDayAverageChangePercent }, { label: "From 52W Low", avg: stock.fiftyTwoWeekLow, chg: stock.fiftyTwoWeekLowChange, pct: stock.fiftyTwoWeekLowChangePercent }, { label: "From 52W High", avg: stock.fiftyTwoWeekHigh, chg: stock.fiftyTwoWeekHighChange, pct: stock.fiftyTwoWeekHighChangePercent }].map(({ label, avg, chg, pct }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px dotted #8b7355", flexWrap: "wrap", gap: 6 }}>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12 }}><span style={{ color: "#5a4a2a" }}>{label}: </span><strong>₹{fmtNum(avg)}</strong></div>
                  <ChangeChip value={`₹${fmtNum(Math.abs(chg))}`} pct={fmtPctChg(Math.abs(pct))} isPositive={chg >= 0} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ANALYST ══ */}
        {activeSection === "analyst" && (
          <div className="fade-up">
            <SectionHead kicker={`${stock.shortName} · Analyst Coverage`} title="Price Targets & Recommendations" byline={`${stock.numberOfAnalystOpinions} ANALYSTS COVERING · ${stock.averageAnalystRating.toUpperCase()}`} isMobile={isMobile} />
            <div style={col2}>
              <div>
                <div className="dark-box" style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#a89060" }}>CONSENSUS RECOMMENDATION</div>
                  <div style={{ fontSize: isMobile ? "1.4rem" : "1.8rem", fontWeight: 900, margin: "8px 0", textTransform: "uppercase" }}>{stock.recommendationKey.replace(/_/g, " ")}</div>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, color: "#d4c9b0" }}>Avg. Score: {fmtNum(stock.recommendationMean)} · {stock.numberOfAnalystOpinions} analysts</div>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 11, color: "#a89060", fontStyle: "italic", marginTop: 4 }}>{stock.averageAnalystRating}</div>
                </div>
                {[{ label: "Target Low", val: stock.targetLowPrice, color: "#8b1a1a" }, { label: "Target Mean", val: stock.targetMeanPrice, color: "#8b6030" }, { label: "Target High", val: stock.targetHighPrice, color: "#2d6a2d" }].map(({ label, val, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Libre Baskerville',serif", fontSize: 13, borderBottom: "1px solid #d4c9b0", padding: "9px 0" }}>
                    <span style={{ color: "#5a4a2a", fontSize: 11, alignSelf: "center" }}>{label}</span>
                    <strong style={{ fontSize: 18, color }}>₹{fmtNum(val)}</strong>
                  </div>
                ))}
                <RuleThin />
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 6 }}>Target Range</div>
                  <div style={{ position: "relative", height: 20 }}>
                    <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 0, height: 6, background: "#d4c9b0", borderRadius: 3 }}>
                      <div style={{ position: "absolute", left: 0, right: 0, height: "100%", background: "linear-gradient(to right,#8b1a1a,#8b6030,#2d6a2d)", borderRadius: 3, opacity: 0.7 }} />
                      {(() => { const pos = Math.min(Math.max(((stock.currentPrice - stock.targetLowPrice) / (stock.targetHighPrice - stock.targetLowPrice)) * 100, 0), 100); return <div style={{ position: "absolute", width: 12, height: 12, background: "#1a1208", borderRadius: "50%", top: "50%", transform: "translate(-50%,-50%)", left: `${pos}%`, border: "2px solid #f5f0e8" }} />; })()}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#5a4a2a", marginTop: 4 }}>
                    <span>Low: ₹{fmtNum(stock.targetLowPrice)}</span>
                    <span style={{ fontWeight: 700, color: "#1a1208" }}>Now: ₹{fmtNum(stock.currentPrice)}</span>
                    <span>High: ₹{fmtNum(stock.targetHighPrice)}</span>
                  </div>
                </div>
              </div>
              {!isTablet && <div style={{ background: "#8b7355" }} />}
              {isTablet && <RuleThin />}
              <div>
                <div className="grid-3" style={{ marginBottom: 14 }}>
                  {[["Analysts", fmtNum(stock.numberOfAnalystOpinions, 0)], ["Rec. Score", fmtNum(stock.recommendationMean)], ["Low", `₹${fmtNum(stock.targetLowPrice)}`], ["Mean", `₹${fmtNum(stock.targetMeanPrice)}`], ["High", `₹${fmtNum(stock.targetHighPrice)}`], ["Current", `₹${fmtNum(stock.currentPrice)}`]].map(([label, val]) => (
                    <div key={label} className="metric-card" style={{ padding: 8 }}>
                      <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a4a2a" }}>{label}</div>
                      <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 900, marginTop: 3 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div className="warn-box">
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", color: "#8b1a1a", fontWeight: 700, marginBottom: 6 }}>⚠ DATA NOTE</div>
                  <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 11, lineHeight: 1.7, color: "#5a4a2a" }}>All targets and recommendations are sourced directly from <strong>{stock.exchange}</strong> consensus data. No interpretation applied.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ GOVERNANCE ══ */}
        {activeSection === "governance" && (
          <div className="fade-up">
            <SectionHead kicker={`${stock.shortName} · Governance`} title="Risk Scores & Ownership" byline="GOVERNANCE DATA · SOURCED DIRECTLY FROM API" isMobile={isMobile} />
            <div style={{ maxWidth: isTablet ? "100%" : "60%" }}>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 10 }}>Risk Scorecard (1=Low · 10=High Risk)</div>
              <RiskBar label="Audit Risk" value={stock.auditRisk} />
              <RiskBar label="Board Risk" value={stock.boardRisk} />
              <RiskBar label="Compensation Risk" value={stock.compensationRisk} />
              <RiskBar label="Shareholder Rights Risk" value={stock.shareHolderRightsRisk} />
              <div style={{ borderTop: "2px solid #1a1208", paddingTop: 10, marginTop: 4 }}><RiskBar label="Overall Risk" value={stock.overallRisk} /></div>
              <RuleThin />
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4a2a", margin: "8px 0" }}>Ownership (Direct from API)</div>
              {[{ label: "Insiders / Promoters", val: stock.heldPercentInsiders, color: "#8b1a1a" }, { label: "Institutional Investors", val: stock.heldPercentInstitutions, color: "#1a1208" }].map(({ label, val, color }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Libre Baskerville',serif", fontSize: 12, marginBottom: 4 }}><span>{label}</span><strong style={{ color }}>{fmtPct(val)}</strong></div>
                  <div style={{ height: 10, background: "#d4c9b0" }}><div style={{ height: "100%", width: `${val * 100}%`, background: color }} /></div>
                </div>
              ))}
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#8b7355", fontStyle: "italic", marginTop: 4 }}>
                * Remaining {fmtPct(1 - stock.heldPercentInsiders - stock.heldPercentInstitutions)} not reported in this API response.
              </div>
              <RuleThin />
              <DataRow label="Shares Outstanding" value={fmtNum(stock.sharesOutstanding, 0)} />
              <DataRow label="Float Shares" value={fmtNum(stock.floatShares, 0)} />
            </div>
          </div>
        )}

        {/* ══ ABOUT COMPANY ══ */}
        {activeSection === "about company" && (
          <div className="fade-up">
            <SectionHead kicker={`${stock.ticker} · ${stock.exchange} · ${stock.currency}`} title={stock.longName} byline={`${stock.sector} · ${stock.industry}`} isMobile={isMobile} />
            <div className="dark-box" style={{ marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 16 }}>
                {[{ label: "Exchange", value: stock.exchange }, { label: "Currency", value: stock.currency }, { label: "Employees", value: fmtNum(stock.fullTimeEmployees, 0) }, { label: "Market State", value: stock.marketState }].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: "center", borderRight: "1px solid #3a2f1a" }}>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a89060", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 900, fontSize: 15, color: "#f5f0e8" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ink-box" style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700, marginBottom: 12 }}>§ Business Description</div>
              <p className="drop-cap" style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 13, lineHeight: 2, textAlign: "justify", color: "#2a1f0a" }}>{stock.longBusinessSummary}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[{ label: "Sector", value: stock.sector }, { label: "Industry", value: stock.industry }, { label: "Website", value: stock.website, isLink: true }].map(({ label, value, isLink }) => (
                <div key={label} className="ink-box">
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b7355", marginBottom: 6 }}>{label}</div>
                  {isLink ? <a href={value} target="_blank" rel="noreferrer" style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, fontWeight: 700, color: "#8b1a1a", wordBreak: "break-all" }}>{value}</a> : <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 13, fontWeight: 700, color: "#1a1208" }}>{value}</div>}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5a4a2a", marginBottom: 10 }}>Key Management</div>
              {stock.companyOfficers.map(o => (
                <div key={o.name} style={{ borderBottom: "1px solid #d4c9b0", padding: "8px 0", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, fontWeight: 700 }}>{o.name}</div>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#5a4a2a", fontStyle: "italic" }}>{o.title}</div>
                  </div>
                  {o.age && <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#8b7355" }}>Age {o.age}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ AI ANALYSIS ══ */}
        {activeSection === "ai analysis" && (
          <div className="fade-up">
            <SectionHead
              kicker={`${stock.ticker} · AI Research Desk`}
              title="Artificial Intelligence Analysis"
              byline="POWERED BY N8N · RESEARCH GENERATED ON DEMAND"
              isMobile={isMobile}
            />

            {/* ── IDLE STATE — nothing requested yet ── */}
            {!aiLoading && !aiData && !aiError && (
              <div style={{ textAlign: "center", padding: isMobile ? "32px 16px" : "56px 32px", border: "2px solid #1a1208", background: "#faf7f0", marginBottom: 20 }}>
                <div style={{ fontFamily: "'UnifrakturMaguntia',cursive", fontSize: isMobile ? "1.4rem" : "2.2rem", color: "#1a1208", marginBottom: 10 }}>
                  AI Research Desk
                </div>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b7355", marginBottom: 20 }}>
                  — {stock.ticker} · {stock.longName} —
                </div>
                <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 13, color: "#5a4a2a", lineHeight: 1.9, maxWidth: 480, margin: "0 auto 28px" }}>
                  Click below to dispatch a research request to your n8n workflow. The AI correspondent will analyse this stock and return a full briefing.
                </p>
                <button
                  onClick={runAnalysis}
                  style={{
                    background: "#1a1208", color: "#f5f0e8", border: "none",
                    padding: "14px 36px", cursor: "pointer",
                    fontFamily: "'Libre Baskerville',serif", fontSize: 12,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    boxShadow: "4px 4px 0 #8b7355", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#8b1a1a"; e.currentTarget.style.boxShadow = "4px 4px 0 #1a1208"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1a1208"; e.currentTarget.style.boxShadow = "4px 4px 0 #8b7355"; }}
                >
                  ◆ Run AI Analysis
                </button>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: "#8b7355", marginTop: 16, fontStyle: "italic" }}>
                  Powered by n8n · Results may take a few seconds
                </div>
              </div>
            )}

            {/* ── LOADING STATE ── */}
            {aiLoading && (
              <div>
                <style>{`
                  @keyframes press { 0%{width:0} 100%{width:100%} }
                  .press-bar { animation:press 3s ease-in-out infinite; height:3px; background:#1a1208; }
                  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.15} }
                  .dot1{animation:blink 1.2s 0.0s infinite}
                  .dot2{animation:blink 1.2s 0.3s infinite}
                  .dot3{animation:blink 1.2s 0.6s infinite}
                `}</style>
                <div style={{ border: "2px solid #1a1208", padding: isMobile ? 20 : 36, textAlign: "center", background: "#faf7f0", marginBottom: 20 }}>
                  <div style={{ fontFamily: "'UnifrakturMaguntia',cursive", fontSize: isMobile ? "1.4rem" : "2rem", color: "#1a1208", marginBottom: 14 }}>The Press Is Running…</div>
                  <div style={{ height: 3, background: "#d4c9b0", marginBottom: 20, overflow: "hidden" }}>
                    <div className="press-bar" />
                  </div>
                  <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, color: "#5a4a2a", lineHeight: 1.9 }}>
                    Our AI research correspondent is compiling an in-depth analysis<br />of <strong>{stock.longName}</strong> from your n8n workflow.
                  </p>
                  <div style={{ marginTop: 18, fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: "#1a1208", letterSpacing: 6 }}>
                    <span className="dot1">◆</span><span className="dot2" style={{ margin: "0 10px" }}>◆</span><span className="dot3">◆</span>
                  </div>
                  <div style={{ marginTop: 14, fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b7355" }}>
                    Awaiting response from n8n · {stock.ticker}
                  </div>
                </div>
                {/* Skeleton lines */}
                {[75, 55, 85, 45, 65, 35].map((w, i) => (
                  <div key={i} style={{ height: 9, background: "#d4c9b0", marginBottom: 10, width: `${w}%`, opacity: 1 - i * 0.1 }} />
                ))}
              </div>
            )}

            {/* ── ERROR STATE ── */}
            {aiError && !aiLoading && (
              <div style={{ border: "2px solid #8b1a1a", padding: 20, background: "#f0ded0", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700, marginBottom: 8 }}>⚠ Dispatch Failed</div>
                <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, lineHeight: 1.7, color: "#5a4a2a" }}>
                  The n8n webhook did not respond as expected. Please verify your webhook URL is active and the workflow is enabled.
                </p>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#8b1a1a", marginTop: 8, fontStyle: "italic" }}>Error: {aiError}</div>
                <button
                  onClick={runAnalysis}
                  style={{ marginTop: 14, background: "#1a1208", color: "#f5f0e8", border: "none", padding: "8px 20px", fontFamily: "'Libre Baskerville',serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                  Retry
                </button>
              </div>
            )}

            {/* ── RESPONSE STATE ── */}
            {aiData && !aiLoading && (
              <div>
                {/* AI byline bar */}
                <div style={{ background: "#1a1208", color: "#f5f0e8", padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", color: "#a89060", textTransform: "uppercase" }}>AI Research Correspondent · n8n</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, marginTop: 2 }}>{stock.longName}</div>
                  </div>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: "#5a4a2a", fontStyle: "italic" }}>
                    Generated {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {/* Summary — aiData.summary: string */}
                {aiData.summary && (
                  <div className="ink-box" style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700, marginBottom: 10 }}>§ Executive Summary</div>
                    <p className="drop-cap" style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 13, lineHeight: 2, textAlign: "justify", color: "#2a1f0a" }}>{aiData.summary}</p>
                  </div>
                )}

                {/* Sentiment + Confidence — aiData.sentiment: "bullish"|"bearish"|"neutral", aiData.confidence: string */}
                {aiData.sentiment && (
                  <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 140, background: aiData.sentiment === "bullish" ? "#2d6a2d" : aiData.sentiment === "bearish" ? "#8b1a1a" : "#8b6030", color: "#fff", padding: "14px 18px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8 }}>AI Sentiment</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, textTransform: "uppercase", marginTop: 4 }}>{aiData.sentiment}</div>
                    </div>
                    {aiData.confidence && (
                      <div style={{ flex: 1, minWidth: 140, border: "1px solid #8b7355", padding: "14px 18px", background: "#ede8dc", textAlign: "center" }}>
                        <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b7355" }}>Confidence</div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: "#1a1208", marginTop: 4 }}>{aiData.confidence}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Key findings — aiData.keyPoints: string[] */}
                {aiData.keyPoints?.length > 0 && (
                  <div className="ink-box" style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700, marginBottom: 12 }}>Key Findings</div>
                    {aiData.keyPoints.map((point, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px dotted #8b7355" }}>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, color: "#8b1a1a", flexShrink: 0, fontSize: 14 }}>{i + 1}.</span>
                        <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, lineHeight: 1.8, color: "#2a1f0a", margin: 0 }}>{point}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Risk factors — aiData.risks: string[] */}
                {aiData.risks?.length > 0 && (
                  <div style={{ border: "2px solid #8b1a1a", padding: "14px 16px", background: "#fdf5f0", marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700, marginBottom: 12 }}>⚠ Risk Factors</div>
                    {aiData.risks.map((risk, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "6px 0", borderBottom: "1px dotted #f0c0b0" }}>
                        <span style={{ color: "#8b1a1a", flexShrink: 0, fontWeight: 700 }}>—</span>
                        <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, lineHeight: 1.8, color: "#5a2a1a", margin: 0 }}>{risk}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw fallback — if n8n returns plain string or unexpected shape */}
                {!aiData.summary && !aiData.keyPoints && (
                  <div className="ink-box">
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700, marginBottom: 10 }}>§ Analysis</div>
                    <pre style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, lineHeight: 1.9, color: "#2a1f0a", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {typeof aiData === "string" ? aiData : JSON.stringify(aiData, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Re-run */}
                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <button
                    onClick={runAnalysis}
                    style={{
                      background: "none", color: "#1a1208",
                      border: "1px solid #8b7355", padding: "8px 24px", cursor: "pointer",
                      fontFamily: "'Libre Baskerville',serif", fontSize: 10,
                      letterSpacing: "0.2em", textTransform: "uppercase", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1a1208"; e.currentTarget.style.color = "#f5f0e8"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#1a1208"; }}
                  >
                    ↺ Run Analysis Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detail page footer */}
        <div style={{ borderTop: "3px double #1a1208", marginTop: 28, padding: "10px 0", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 6, textAlign: isMobile ? "center" : "unset" }}>
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: "#8b7355", letterSpacing: "0.1em" }}>© THE MARKET CHRONICLE · {stock.exchange} · {stock.currency} · DATA: {stock.ticker}</div>
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: "#8b7355", fontStyle: "italic" }}>All data sourced directly from API response. No values derived.</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
function LandingPage({ onNavigate }) {
  const [tick, setTick] = useState(0);
  const width = useWindowWidth();
  const isMobile = width < 640;
  const px = isMobile ? 14 : 28;

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 40); return () => clearInterval(id); }, []);
  const tickerStr = [...TICKER_ITEMS, ...TICKER_ITEMS].join("     ·     ");
  const tickerOffset = -(tick * 0.35) % (tickerStr.length * 7.4);

  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh", fontFamily: "'Playfair Display',Georgia,serif", color: "#1a1208", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` }}>

      {/* Notice */}
      <div className="notice-banner">LIVE PRICE DATA COMING SOON · SEARCH & BROWSE BY NAME, TICKER OR SECTOR · NOT INVESTMENT ADVICE</div>

      {/* Masthead */}
      <div style={{ borderBottom: "4px solid #1a1208", padding: `12px ${px}px 0` }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "flex-end", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
          {!isMobile && <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.1em", color: "#5a4a2a" }}>EST. 2024 · VOL. I · NO. 1</div>}
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontFamily: "'UnifrakturMaguntia',cursive", fontSize: isMobile ? "2rem" : "clamp(2rem,6vw,3.8rem)", lineHeight: 1, color: "#1a1208" }}>The Market Chronicle</div>
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "#5a4a2a", marginTop: 3 }}>India's Definitive Stock Intelligence Platform</div>
          </div>
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#5a4a2a", textAlign: isMobile ? "center" : "right" }}>
            <div>{isMobile ? new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : today}</div>
            <div style={{ color: "#2d6a2d", fontWeight: 700, marginTop: 2 }}>NSE · BSE · LIVE</div>
          </div>
        </div>
        <div style={{ background: "#1a1208", margin: `0 ${isMobile ? -14 : -28}px`, padding: "5px 0", overflow: "hidden" }}>
          <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 11, letterSpacing: "0.08em", display: "inline-block", whiteSpace: "nowrap", transform: `translateX(${tickerOffset}px)`, color: "#f5f0e8" }}>{tickerStr}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: `32px ${px}px 48px` }}>
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8b1a1a", fontWeight: 700, marginBottom: 10 }}>— Stock Intelligence, Delivered —</div>
          <h1 style={{ fontSize: isMobile ? "1.8rem" : "clamp(2rem,5vw,3.4rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 6 }}>
            Search Any Stock.<br /><span style={{ fontStyle: "italic", color: "#8b1a1a" }}>Know Everything About It.</span>
          </h1>
          <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: isMobile ? 12 : 14, color: "#5a4a2a", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 28px" }}>
            Search from {STOCK_DATABASE.length}+ listed equities across NSE & BSE. Click any result to open the full company report.
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <SearchBar onNavigate={onNavigate} compact={false} />
          </div>

          {/* Keyboard hint */}
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, color: "#8b7355", marginTop: 10, fontStyle: "italic" }}>
            ↑ ↓ to navigate · Enter to select · Esc to dismiss
          </div>

          {/* Top stocks */}
          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b7355", marginBottom: 14 }}>— Popular Stocks —</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {TOP_STOCKS.map(s => (
                <button key={s.ticker} onClick={() => onNavigate(STOCK_DATABASE.find(d => d.ticker === s.ticker))}
                  style={{ background: "#faf7f0", border: "1px solid #8b7355", padding: "8px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", boxShadow: "2px 2px 0 #d4c9b0" }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.background = "#1a1208"; el.style.borderColor = "#1a1208"; el.style.boxShadow = "2px 2px 0 #8b7355"; el.querySelector(".ct").style.color = "#f0c040"; el.querySelector(".cn").style.color = "#f5f0e8"; el.querySelector(".cs").style.color = "#a89060"; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.background = "#faf7f0"; el.style.borderColor = "#8b7355"; el.style.boxShadow = "2px 2px 0 #d4c9b0"; el.querySelector(".ct").style.color = "#8b1a1a"; el.querySelector(".cn").style.color = "#1a1208"; el.querySelector(".cs").style.color = "#8b7355"; }}>
                  <div className="ct" style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#8b1a1a", transition: "color 0.15s" }}>{s.ticker}</div>
                  <div className="cn" style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontWeight: 700, color: "#1a1208", marginTop: 2, transition: "color 0.15s" }}>{s.name}</div>
                  <div className="cs" style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: "#8b7355", fontStyle: "italic", marginTop: 1, transition: "color 0.15s" }}>{s.sector}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "3px double #1a1208", marginTop: 40, paddingTop: 12, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 6, textAlign: isMobile ? "center" : "unset" }}>
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: "#8b7355", letterSpacing: "0.1em" }}>© THE MARKET CHRONICLE · NSE · BSE · {STOCK_DATABASE.length} EQUITIES INDEXED</div>
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 9, color: "#8b7355", fontStyle: "italic" }}>Stock registry only. Live prices available once yfinance integration is complete.</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP — state-based router
// ─────────────────────────────────────────────────────────────────────────────
export default function MarketChronicle() {
  const [page, setPage] = useState("landing");   // "landing" | "detail"
  const [currentTicker, setCurrentTicker] = useState(null);

  const navigateTo = (stock) => {
    setCurrentTicker(stock.ticker);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setPage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{SHARED_CSS}</style>
      {page === "landing" && <LandingPage onNavigate={navigateTo} />}
      {page === "detail" && <DetailPage ticker={currentTicker} onBack={goBack} onNavigate={navigateTo} />}
    </>
  );
}
