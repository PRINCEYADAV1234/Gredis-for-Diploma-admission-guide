import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

// Initialize a single shared instance for the backend.
// In the backend, queries are authenticated via ClerkAuth middleware,
// and database operations run directly using the service key / anon key.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export function getSupabaseClient() {
  return supabase;
}
