import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const querySchema = z.string().min(1).max(100).trim()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const raw = searchParams.get('q')

    if (!raw) {
        return NextResponse.json([])
    }

    const parsed = querySchema.safeParse(raw)
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid search query" }, { status: 400 })
    }
    const query = parsed.data

    try {
        const { data, error } = await supabase
            .from('ticker_list')
            .select('ticker, name:company, sector:exchange')
            .or(`ticker.ilike."%${query}%",company.ilike."%${query}%"`)
            .limit(10)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const formattedData = data.map((item: any) => {
            const suffix = item.sector?.toUpperCase().includes('BSE') ? '.BO' : '.NS'
            const tickerStr = String(item.ticker);
            const finalTicker = tickerStr.toUpperCase().endsWith(suffix) ? tickerStr : `${tickerStr}${suffix}`;
            return {
                ticker: finalTicker,
                name: item.name,
                sector: item.sector
            }
        })

        return NextResponse.json(formattedData)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
