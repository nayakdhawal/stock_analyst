"use client"

import type React from "react"

import { BarChart3, Info, PieChart, Activity } from "lucide-react"
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
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
            {data.ticker}
          </div>
          <div>
            <h3 className="text-sm font-bold leading-none">{data.name}</h3>
            <p className="text-muted-foreground mt-1 text-[10px] uppercase tracking-wider">Nasdaq Listed</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">${data.price.toLocaleString()}</div>
          <div className={`text-[10px] font-medium ${isUp ? "text-[var(--chart-up)]" : "text-[var(--chart-down)]"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(data.changePercent)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Market Cap" value={data.marketCap} icon={<BarChart3 className="h-3 w-3" />} />
        <MetricCard label="P/E Ratio" value={data.peRatio} icon={<Info className="h-3 w-3" />} />
        <MetricCard label="Volume" value={data.volume || "12.4M"} icon={<Activity className="h-3 w-3" />} />
        <MetricCard label="Dividend" value={data.dividendYield || "1.2%"} icon={<PieChart className="h-3 w-3" />} />
      </div>

      <Card className="bg-background/50 border-border">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider opacity-70">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground text-xs leading-relaxed">{data.summary}</p>
        </CardContent>
      </Card>

      <div className="bg-muted/30 rounded-lg p-3">
        <div className="flex justify-between text-[10px] font-medium opacity-70">
          <span>52W LOW</span>
          <span>52W HIGH</span>
        </div>
        <div className="relative mt-1.5 h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="absolute h-full bg-primary"
            style={{
              left: "25%",
              width: "50%",
            }}
          />
          <div
            className="absolute top-0 h-full w-1 bg-foreground"
            style={{
              left: "65%",
            }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-bold">
          <span>${data.fiftyTwoWeekLow || (data.price * 0.8).toFixed(2)}</span>
          <span>${data.fiftyTwoWeekHigh || (data.price * 1.2).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  color?: string
}) {
  return (
    <Card className="bg-background/80 border-border p-3 shadow-none">
      <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider">
        <span className="opacity-70">{icon}</span>
        {label}
      </div>
      <div className={`mt-1 text-sm font-bold ${color || "text-foreground"}`}>{value}</div>
    </Card>
  )
}
