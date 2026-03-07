import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.PROJECT_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.PUBLISHABLE_KEY;

export const hasSupabaseConfig = Boolean(
  typeof supabaseUrl === "string" &&
    supabaseUrl.length > 0 &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.length > 0,
);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
