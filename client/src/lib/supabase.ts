import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseClient(clerkToken?: string | null) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  if (clerkToken) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    });
  }
  
  return supabase;
}
