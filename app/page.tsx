import { ChatInterface } from "@/components/chat-interface"

export default function StockAnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background font-sans selection:bg-primary/20">
      <div className="flex w-full flex-1 flex-col">
        <ChatInterface />
      </div>
    </main>
  )
}
