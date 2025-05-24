import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres'
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString, {ssl: "require"})

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Inicializa o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default sql