import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json([])
    }

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
