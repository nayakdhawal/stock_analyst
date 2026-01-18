"use client"

import type React from "react"
import { BarChart3, Info, PieChart, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StockData {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  summary: string
  marketCap: string
  peRatio: string
  dividendYield?: string
  volume?: string
  fiftyTwoWeekHigh?: number
  fiftyTwoWeekLow?: number
}

export function StockReport({ data }: { data: StockData }) {
  const isUp = data.change >= 0

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Price Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold shadow-sm ring-1 ring-primary/20">
            {data.ticker}
          </div>
          <div>
            <h3 className="text-lg font-bold leading-none tracking-tight">{data.name}</h3>
            <p className="text-muted-foreground mt-1 text-[11px] uppercase tracking-widest font-semibold opacity-70">Market Open • NASDAQ</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tracking-tighter">${data.price.toLocaleString()}</div>
          <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
            {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {isUp ? "+" : ""}{data.change.toFixed(2)} ({data.changePercent}%)
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Market Cap" value={data.marketCap} icon={<BarChart3 className="h-4 w-4" />} />
        <MetricCard label="P/E Ratio" value={data.peRatio} icon={<Info className="h-4 w-4" />} />
        <MetricCard label="Volume" value={data.volume || "12.4M"} icon={<Activity className="h-4 w-4" />} />
        <MetricCard label="Dividend" value={data.dividendYield || "1.2%"} icon={<PieChart className="h-4 w-4" />} />
      </div>

      {/* Executive Summary */}
      <Card className="bg-card/30 border-border/50 backdrop-blur-sm shadow-sm overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-80">Insight Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-foreground/80 text-sm leading-relaxed antialiased">{data.summary}</p>
        </CardContent>
      </Card>

      {/* 52-Week Range */}
      <div className="bg-muted/40 rounded-2xl p-4 border border-border/50">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          <span>52W Low</span>
          <span>52W Range</span>
          <span>52W High</span>
        </div>
        <div className="relative h-2 w-full rounded-full bg-border/50 overflow-hidden shadow-inner">
          <div
            className="absolute h-full bg-gradient-to-r from-primary to-primary/60"
            style={{
              left: "20%",
              width: "60%",
            }}
          />
          <div
            className="absolute top-0 h-full w-1.5 bg-foreground border-x border-background shadow-sm"
            style={{
              left: "65%",
            }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs font-bold tracking-tight">
          <span className="text-muted-foreground">${(data.fiftyTwoWeekLow || (data.price * 0.8)).toFixed(2)}</span>
          <span className="text-primary font-extrabold">${data.price.toFixed(2)}</span>
          <span className="text-muted-foreground">${(data.fiftyTwoWeekHigh || (data.price * 1.2)).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <Card className="bg-background/40 border-border/50 p-4 shadow-none hover:bg-background/60 transition-colors group">
      <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
        {icon}
        {label}
      </div>
      <div className="text-base font-bold tracking-tight text-foreground">{value}</div>
    </Card>
  )
}
