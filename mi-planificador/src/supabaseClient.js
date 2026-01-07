import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qnsxfgqhkjzkdqzumwvz.supabase.co'
const supabaseKey = 'sb_publishable_iMyMh_fZDoTp6Qr4AcCeXQ_yNdRn9Nk'

export const supabase = createClient(supabaseUrl, supabaseKey)