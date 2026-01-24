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
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-700 fill-mode-both">
      {/* Price Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold shadow-[0_0_15px_rgba(var(--primary),0.2)] ring-1 ring-primary/30 backdrop-blur-md">
            {data.ticker}
          </div>
          <div>
            <h3 className="text-lg font-bold leading-none tracking-tight">{data.name}</h3>
            <p className="text-muted-foreground mt-1 text-[11px] uppercase tracking-widest font-semibold opacity-70">Market Open • NASDAQ</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tracking-tighter drop-shadow-sm">${data.price.toLocaleString()}</div>
          <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
            {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {isUp ? "+" : ""}{data.change.toFixed(2)} ({data.changePercent}%)
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Market Cap" value={data.marketCap} icon={<BarChart3 className="h-4 w-4" />} index={0} />
        <MetricCard label="P/E Ratio" value={data.peRatio} icon={<Info className="h-4 w-4" />} index={1} />
        <MetricCard label="Volume" value={data.volume || "12.4M"} icon={<Activity className="h-4 w-4" />} index={2} />
        <MetricCard label="Dividend" value={data.dividendYield || "1.2%"} icon={<PieChart className="h-4 w-4" />} index={3} />
      </div>

      {/* Executive Summary */}
      <Card className="bg-card/40 border-border/40 backdrop-blur-md shadow-xl overflow-hidden group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="p-4 pb-2 relative">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Insight Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 relative">
          <p className="text-foreground/90 text-sm leading-relaxed antialiased font-medium">{data.summary}</p>
        </CardContent>
      </Card>

      {/* 52-Week Range */}
      <div className="bg-muted/30 rounded-2xl p-4 border border-border/40 backdrop-blur-sm">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 opacity-60">
          <span>52W Low</span>
          <span>52W Range</span>
          <span>52W High</span>
        </div>
        <div className="relative h-2.5 w-full rounded-full bg-muted/60 overflow-hidden shadow-inner ring-1 ring-border/10">
          <div
            className="absolute h-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
            style={{
              left: "20%",
              width: "60%",
            }}
          />
          <div
            className="absolute top-0 h-full w-2 bg-foreground border-x border-background shadow-[0_0_8px_rgba(0,0,0,0.2)] z-10"
            style={{
              left: "65%",
            }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs font-bold tracking-tight">
          <span className="text-muted-foreground/70">${(data.fiftyTwoWeekLow || (data.price * 0.8)).toFixed(2)}</span>
          <span className="text-primary font-black scale-110 drop-shadow-sm">${data.price.toFixed(2)}</span>
          <span className="text-muted-foreground/70">${(data.fiftyTwoWeekHigh || (data.price * 1.2)).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  index,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  index: number
}) {
  return (
    <Card
      className="bg-card/30 border-border/40 p-4 shadow-lg hover:bg-card/50 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all">
        {icon}
        {label}
      </div>
      <div className="text-lg font-black tracking-tighter text-foreground group-hover:translate-x-1 transition-transform">{value}</div>
    </Card>
  )
}
