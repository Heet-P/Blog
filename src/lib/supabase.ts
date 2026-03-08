import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Client-side supabase instance (anon key, read-only via RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
