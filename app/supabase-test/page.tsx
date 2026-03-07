"use client"

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTestPage() {
    // ===== 1. CONNECTION TEST STATE =====
    const [status, setStatus] = useState<string>('Connecting...')
    const [data, setData] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    // ===== 2. AUTOCOMPLETE STATE =====
    const [input, setInput] = useState("")
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)

    // ===== 1. CONNECTION TEST LOGIC =====
    useEffect(() => {
        async function testConnection() {
            try {
                const { data, error } = await supabase
                    .from('ticker_list')
                    .select('ticker, company')
                    .limit(5)

                if (error) {
                    setError(error.message)
                    setStatus('Failed')
                } else {
                    setData(data || [])
                    setStatus('Successful')
                }
            } catch (err: any) {
                setError(err.message)
                setStatus('Failed')
            }
        }

        testConnection()
    }, [])

    // ===== 2. AUTOCOMPLETE LOGIC =====
    useEffect(() => {
        // Clear previous timer to debounce keystrokes
        if (debounceTimer.current) clearTimeout(debounceTimer.current)

        if (!input.trim()) {
            setSuggestions([])
            return
        }

        setIsSearching(true)

        // Wait 300ms after user stops typing
        debounceTimer.current = setTimeout(async () => {
            try {
                // Hitting the supabase test table directly for the demo
                const searchTerm = `%${input.trim()}%`
                const { data, error } = await supabase
                    .from('ticker_list')
                    .select('ticker, company')
                    .or(`ticker.ilike."${searchTerm}",company.ilike."${searchTerm}"`)
                    .limit(5)

                if (error) throw error
                setSuggestions(data || [])
            } catch (err) {
                console.error("Search error:", err)
            } finally {
                setIsSearching(false)
            }
        }, 300)

        // Cleanup function
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current)
        }
    }, [input])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-foreground bg-background font-sans">
            <h1 className="text-4xl font-bold mb-8 text-primary">Supabase Testing</h1>

            <div className="w-full max-w-xl space-y-8">
                {/* AUTOCOMPLETE DEMO SECTION */}
                <div className="p-6 rounded-xl border border-border bg-card shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Autocomplete Demo</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Search for a stock ticker or company name. Watch it query Supabase in real-time as you type!
                    </p>

                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Start typing (e.g., RELIANCE or HDFC)..."
                            className="w-full p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                        {isSearching && (
                            <div className="absolute right-4 top-4 text-muted-foreground text-sm">
                                Searching...
                            </div>
                        )}

                        {/* Dropdown Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
                                {suggestions.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(`${item.company} (${item.ticker})`)
                                            setSuggestions([]) // Hide after selection
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border/50 last:border-0 transition-colors flex flex-col"
                                    >
                                        <span className="font-semibold text-foreground">{item.company}</span>
                                        <span className="text-xs text-muted-foreground">{item.ticker}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {!isSearching && input.trim() && suggestions.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-lg p-4 text-muted-foreground text-sm shadow-xl">
                                No stocks found matching "{input}"
                            </div>
                        )}
                    </div>
                </div>

                {/* EXISTING CONNECTION TEST SECTION */}
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Connection Status</h2>
                    <p className="mb-4">Status: <span className={`font-bold ${status === 'Successful' ? 'text-green-500' : 'text-red-500'}`}>{status}</span></p>

                    {error && (
                        <div className="p-4 mb-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {data.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Sample Data Linked:</h3>
                            <ul className="space-y-1">
                                {data.map((item, i) => (
                                    <li key={i} className="text-sm"><span className="font-mono text-primary">{item.ticker}</span> - {item.company}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
