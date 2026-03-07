'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Stock {
    symbol: string
    name: string
}

export function useStocks(query: string) {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!query || query.length < 2) {
            setStocks([])
            return
        }

        const fetchStocks = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch stocks')
                }
                const data = await response.json()
                setStocks(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchStocks, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    return { stocks, loading, error }
}
