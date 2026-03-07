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
            .select('symbol:ticker, name:company')
            .or(`ticker.ilike.%${query}%,company.ilike.%${query}%`)
            .limit(10)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
