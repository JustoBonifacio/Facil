
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    const { data, error } = await supabase.from('listings').select('*').limit(1);

    if (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    } else {
        console.log('Connection successful! Data:', data);
        process.exit(0);
    }
}

testConnection();
