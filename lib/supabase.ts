import { createClient } from '@supabase/supabase-js';

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = supabaseUrl && supabaseKey;

// Client-side Supabase client (for use in client components)
export const createBrowserClient = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  }
  return createClient(supabaseUrl, supabaseKey);
};

// Standard client for general use (only created if configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseReady = () => isSupabaseConfigured;

// Database types (will be extended as needed)
export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          data: any;
          last_modified: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          data: any;
          last_modified?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          data?: any;
          last_modified?: string;
          created_at?: string;
        };
      };
    };
  };
};
