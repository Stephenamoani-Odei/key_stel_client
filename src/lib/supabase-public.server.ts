// Server-only Supabase client using the public (publishable) key. It can do only what the database's
// row-level security allows visitors to do: read available doors, categories and store settings,
// call place_order, and insert contact messages. Import it dynamically inside server function handlers.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Accepts the project URL with or without a trailing slash or a pasted /rest/v1 suffix. */
export const cleanSupabaseUrl = (u: string) => u.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");

export function publicClient() {
  const rawUrl = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!rawUrl || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY.");
  return createClient<Database>(cleanSupabaseUrl(rawUrl), key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        // New-style publishable keys are opaque strings, not bearer JWTs.
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}
