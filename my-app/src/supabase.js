import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvvjfwdvrqzvlpyiejrg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dmpmd2R2cnF6dmxweWllanJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjI5NDEsImV4cCI6MjA4OTM5ODk0MX0.NOSvSBJqFKjEVEcfHnCBhfeN_FKGgO6bqZJE0t8T-NA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
