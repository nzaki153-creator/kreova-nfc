import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk digunakan di Client Component ("use client").
 * Membaca session dari cookie browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
