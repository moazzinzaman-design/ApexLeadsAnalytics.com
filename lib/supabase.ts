import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Server-side client (for API routes, server components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side browser client (for client components)
// This creates a client that works in the browser with proper cookie handling
export function createClientBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  LEADS: 'leads',
  REVIEWS: 'reviews',
} as const;

