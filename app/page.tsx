import { ChatInterface } from "@/components/chat-interface"

export default function StockAnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background font-sans">
      <div className="flex w-full max-w-5xl flex-1 flex-col p-4 md:p-8">
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Stock Insights</h1>
          <p className="text-muted-foreground text-pretty">
            Stock analysis powered by real-time data and AI.
          </p>
        </header>
        <ChatInterface />
      </div>
    </main>
  )
}
