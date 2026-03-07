const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    try {
        // Try to list tables or do a simple query
        const { data, error } = await supabase
            .from('ticker_list')
            .select('ticker, company')
            .limit(1);

        if (error) {
            console.error('Connection failed:', error.message);
            if (error.message.includes('relation "public.stocks" does not exist')) {
                console.log('TIP: The credentials are valid, but you still need to create the "stocks" table using schema.sql');
            }
        } else {
            console.log('Connection successful!');
            console.log('Data found:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

testConnection();
