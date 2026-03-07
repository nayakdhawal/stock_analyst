export type Database = {
    public: {
        Tables: {
            ticker_list: {
                Row: {
                    UID: string
                    ticker: string
                    company: string
                    Exchange: string
                    created_at: string
                }
                Insert: {
                    UID?: string
                    ticker: string
                    company: string
                    Exchange?: string
                    created_at?: string
                }
                Update: {
                    UID?: string
                    ticker?: string
                    company?: string
                    Exchange?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
