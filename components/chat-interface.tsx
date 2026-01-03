"use client"

import * as React from "react"
import { Send, Search } from "lucide-react"
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
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! Which stock would you like me to analyze today? Just provide the ticker or company name.",
    },
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Note: Replace with actual N8N_WEBHOOK_URL in environment variables
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
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

  return (
    <Card className="flex flex-1 flex-col overflow-hidden border-border bg-card/50 backdrop-blur-sm">
      <ScrollArea ref={scrollRef} className="flex-1 p-4 md:p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border"
                  }`}
              >
                <div className="prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ ...props }) => <h1 className="mb-4 mt-6 text-xl font-bold first:mt-0" {...props} />,
                      h2: ({ ...props }) => (
                        <h2 className="mb-3 mt-5 text-lg font-bold tracking-tight uppercase first:mt-0" {...props} />
                      ),
                      h3: ({ ...props }) => <h3 className="mb-2 mt-4 text-base font-bold first:mt-0" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 leading-relaxed last:mb-0" {...props} />,
                      ul: ({ ...props }) => <ul className="mb-4 list-disc space-y-1 pl-5" {...props} />,
                      ol: ({ ...props }) => <ol className="mb-4 list-decimal space-y-1 pl-5" {...props} />,
                      li: ({ ...props }) => <li className="pl-1" {...props} />,
                      table: ({ ...props }) => (
                        <div className="my-6 w-full overflow-hidden rounded-lg border border-border bg-background/50">
                          <table className="w-full text-left text-xs" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-muted border-b border-border" {...props} />,
                      th: ({ ...props }) => <th className="px-4 py-2.5 font-bold uppercase tracking-wider opacity-80" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-2 border-b border-border/50 last:border-0" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="my-4 border-l-4 border-primary pl-4 italic" {...props} />,
                      hr: ({ ...props }) => <hr className="my-6 border-border" {...props} />,
                      strong: ({ ...props }) => (
                        <strong
                          className={`font-bold ${m.role === "user" ? "text-primary-foreground" : "text-primary dark:text-primary-foreground/90"
                            }`}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
                {m.data && <StockReport data={m.data} />}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted border-border rounded-2xl border px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary delay-0" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary delay-150" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary delay-300" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background/50 p-4 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter stock name or ticker (e.g. Reliance)..."
              className="bg-muted/50 pl-10"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="px-6">
            {isLoading ? "Analyzing..." : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  )
}
