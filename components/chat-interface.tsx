"use client"

import * as React from "react"
import { Send, Search, ArrowLeft, Plus, Share2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StockReport } from "@/components/stock-report"
import { Loader } from "@/components/loader"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { supabase } from "@/lib/supabase"

type StockSuggestion = {
  symbol: string
  name: string
}

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
  const [suggestions, setSuggestions] = React.useState<StockSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null)

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    try {
      const searchTerm = `%${query.trim()}%`
      const { data, error } = await supabase
        .from('ticker_list')
        .select('ticker, company')
        .or(`ticker.ilike."${searchTerm}",company.ilike."${searchTerm}"`)
        .limit(10)

      if (error) throw error

      // Map to expected format
      const formattedData = (data || []).map((item: any) => ({
        symbol: item.ticker,
        name: item.company
      }))

      setSuggestions(formattedData)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    }
  }

  React.useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (input.trim() && !isLoading) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(input)
      }, 300)
    } else {
      setSuggestions([])
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [input, isLoading])

  const latestAssistantMessage = [...messages].reverse().find(m => m.role === "assistant")
  const latestUserMessage = [...messages].reverse().find(m => m.role === "user")

  const handleSubmit = async (e: React.FormEvent, overrideInput?: string) => {
    e.preventDefault()
    const query = overrideInput || input
    if (!query.trim() || isLoading) return

    if (!hasSearched) setHasSearched(true)
    setShowSuggestions(false)
    setSuggestions([])
    setSelectedIndex(-1)

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
                onChange={(e) => {
                  setInput(e.target.value)
                  setShowSuggestions(true)
                  setSelectedIndex(-1)
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setSelectedIndex(prev => Math.max(prev - 1, -1))
                  } else if (e.key === "Enter" && selectedIndex >= 0) {
                    e.preventDefault()
                    const selected = suggestions[selectedIndex]
                    setInput(`${selected.name} (${selected.symbol})`)
                    handleSubmit({ preventDefault: () => { } } as React.FormEvent, `${selected.name} (${selected.symbol})`)
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false)
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => input.trim() && setShowSuggestions(true)}
                placeholder="Search company (provide entire company name)..."
                className="flex-1 bg-transparent border-none focus:ring-0 py-6 px-4 text-lg outline-none"
              />
              <div className="pr-4">
                <Button type="submit" size="lg" className="rounded-xl px-6 h-12">
                  Analyse Stock
                </Button>
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <ScrollArea className="max-h-[300px]">
                  <div className="p-2">
                    {suggestions.map((item, index) => (
                      <button
                        key={item.symbol}
                        type="button"
                        onClick={() => {
                          setInput(`${item.name} (${item.symbol})`)
                          handleSubmit({ preventDefault: () => { } } as React.FormEvent, `${item.name} (${item.symbol})`)
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${selectedIndex === index ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.symbol}</span>
                        </div>
                        <Search className={`h-4 w-4 transition-opacity ${selectedIndex === index ? "opacity-100" : "opacity-0"}`} />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span className="text-sm text-muted-foreground mr-2">Try:</span>
            {["Reliance Industries Limited", "HDFC bank Limited", "Coal India Limited", "ITC Limited"].map((chip) => (
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
              onChange={(e) => {
                setInput(e.target.value)
                setShowSuggestions(true)
                setSelectedIndex(-1)
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
                } else if (e.key === "ArrowUp") {
                  e.preventDefault()
                  setSelectedIndex(prev => Math.max(prev - 1, -1))
                } else if (e.key === "Enter" && selectedIndex >= 0) {
                  e.preventDefault()
                  const selected = suggestions[selectedIndex]
                  setInput(`${selected.name} (${selected.symbol})`)
                  handleSubmit({ preventDefault: () => { } } as React.FormEvent, `${selected.name} (${selected.symbol})`)
                } else if (e.key === "Escape") {
                  setShowSuggestions(false)
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => input.trim() && setShowSuggestions(true)}
              placeholder="Ask anything about stocks..."
              className="w-full bg-muted/50 rounded-full pl-10 pr-4 py-2 text-sm border-none focus:ring-1 focus:ring-primary transition-all outline-none"
            />
            {/* Suggestions Dropdown (Compact) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden rounded-xl border border-border bg-card/90 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-top-1 duration-200">
                <ScrollArea className="max-h-[250px]">
                  <div className="p-1">
                    {suggestions.map((item, index) => (
                      <button
                        key={item.symbol}
                        type="button"
                        onClick={() => {
                          setInput(`${item.name} (${item.symbol})`)
                          handleSubmit({ preventDefault: () => { } } as React.FormEvent, `${item.name} (${item.symbol})`)
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${selectedIndex === index ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground">{item.symbol}</span>
                        </div>
                        <Search className={`h-3 w-3 transition-opacity ${selectedIndex === index ? "opacity-100" : "opacity-0"}`} />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
              {latestUserMessage && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-12 text-center">
                  {latestUserMessage.content}
                </h2>
              )}
              <Loader />
            </div>
          ) : (
            /* Main Layout: Split View or Full Width */
            <div className={`grid grid-cols-1 gap-8 ${latestAssistantMessage?.data ? "lg:grid-cols-12" : ""}`}>

              {/* Left Column: Answer & Query Info */}
              <div className={`${latestAssistantMessage?.data ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl mx-auto w-full"} space-y-8`}>
                {latestUserMessage && (
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    {latestUserMessage.content}
                  </h2>
                )}

                {latestAssistantMessage && (
                  <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in duration-300">
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
                          <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                            <table className="w-full text-left text-sm" {...props} />
                          </div>
                        ),
                        thead: ({ ...props }) => <thead className="bg-muted/50 border-b border-border" {...props} />,
                        th: ({ ...props }) => <th className="px-4 py-3 font-semibold text-muted-foreground" {...props} />,
                        td: ({ ...props }) => <td className="px-4 py-3 border-b border-border/10 last:border-0" {...props} />,
                      }}
                    >
                      {latestAssistantMessage.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Right Column: Stock Data & Sidebar Cards */}
              {latestAssistantMessage?.data && (
                <div className="lg:col-span-5 space-y-6">
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
