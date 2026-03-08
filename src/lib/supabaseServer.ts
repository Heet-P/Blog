import { createClient } from "@supabase/supabase-js";

// Server-side supabase client (service role, bypasses RLS)
export function getServiceSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !serviceKey) {
        console.warn("Missing Supabase environment variables - ensure they are configured.");
    }

    return createClient(supabaseUrl, serviceKey);
}
