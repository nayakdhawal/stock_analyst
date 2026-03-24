const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const res1 = await supabase.from('ticker_list').select('ticker, name:company, sector:"Exchange"').limit(1);
  console.log('Query 1:', res1);
}
test();
