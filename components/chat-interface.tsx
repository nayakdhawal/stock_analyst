"use client"

import * as React from "react"
import { Send, Search, ArrowLeft, Plus, Share2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StockReport } from "@/components/stock-report"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  data?: any
}

export function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const latestAssistantMessage = [...messages].reverse().find(m => m.role === "assistant")
  const latestUserMessage = [...messages].reverse().find(m => m.role === "user")

  const handleSubmit = async (e: React.FormEvent, overrideInput?: string) => {
    e.preventDefault()
    const query = overrideInput || input
    if (!query.trim() || isLoading) return

    if (!hasSearched) setHasSearched(true)

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: query }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: query }),
      })

      const result = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.analysis || "I've analyzed the stock for you.",
        data: result.stockData,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error analyzing that stock.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const resetSearch = () => {
    setHasSearched(false)
    setMessages([])
    setInput("")
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 animate-in fade-in duration-700">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
              Stock <span className="text-primary">Insights</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Search for any stock to get real-time AI analysis and insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
            <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <div className="pl-6 text-muted-foreground">
                <Search className="h-6 w-6" />
              </div>
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search ticker or company (e.g. AAPL, Reliance)..."
                className="flex-1 bg-transparent border-none focus:ring-0 py-6 px-4 text-lg outline-none"
              />
              <div className="pr-4">
                <Button type="submit" size="lg" className="rounded-xl px-6 h-12">
                  Ask AI
                </Button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span className="text-sm text-muted-foreground mr-2">Try:</span>
            {["NVIDIA", "Reliance", "Tesla Future", "Dividend Stocks"].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setInput(chip)
                  // Submit logic
                  const fakeEvent = { preventDefault: () => { } } as React.FormEvent
                  handleSubmit(fakeEvent, chip)
                }}
                className="px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm hover:bg-muted transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Header (Sticky) */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md p-4">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Button variant="ghost" size="icon" onClick={resetSearch} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <form onSubmit={handleSubmit} className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about stocks..."
              className="w-full bg-muted/50 rounded-full pl-10 pr-4 py-2 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </form>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-full gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {/* Main Layout: Split View */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            {/* Left Column: Answer & Query Info */}
            <div className="lg:col-span-7 space-y-8">
              {latestUserMessage && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {latestUserMessage.content}
                </h2>
              )}

              {isLoading && !latestAssistantMessage && (
                <div className="space-y-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                </div>
              )}

              {latestAssistantMessage && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ ...props }) => <h1 className="mb-4 mt-6 text-2xl font-bold first:mt-0" {...props} />,
                      h2: ({ ...props }) => (
                        <h2 className="mb-3 mt-8 text-xl font-bold tracking-tight border-b pb-2" {...props} />
                      ),
                      h3: ({ ...props }) => <h3 className="mb-2 mt-4 text-lg font-bold" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-base leading-relaxed text-foreground/90 last:mb-0" {...props} />,
                      ul: ({ ...props }) => <ul className="mb-4 list-disc space-y-2 pl-5" {...props} />,
                      li: ({ ...props }) => <li className="pl-1 text-foreground/80" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-primary" {...props} />,
                      table: ({ ...props }) => (
                        <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card">
                          <table className="w-full text-left text-sm" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-muted border-b border-border" {...props} />,
                      th: ({ ...props }) => <th className="px-4 py-3 font-semibold" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-3 border-b border-border/50 last:border-0" {...props} />,
                    }}
                  >
                    {latestAssistantMessage.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Right Column: Stock Data & Sidebar Cards */}
            <div className="lg:col-span-5 space-y-6">
              {latestAssistantMessage?.data ? (
                <div className="sticky top-24">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Market Snapshot</h3>
                    <div className="h-px flex-1 bg-border mx-4"></div>
                  </div>
                  <StockReport data={latestAssistantMessage.data} />

                  {/* Related Actions */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Card className="p-3 hover:bg-muted/50 cursor-pointer transition-colors border-dashed border-2 flex flex-col gap-2 group">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Plus className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">Add to Watchlist</span>
                    </Card>
                    <Card className="p-3 hover:bg-muted/50 cursor-pointer transition-colors border-dashed border-2 flex flex-col gap-2 group">
                      <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                        <Search className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">Technical View</span>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-muted/20">
                  <p className="text-sm text-muted-foreground italic">
                    {isLoading ? "Fetching real-time data..." : "Analysis ready. No specific ticker data found."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
