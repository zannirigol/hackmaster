import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kjgdlahmrbrmjxeixbcw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ2RsYWhtcmJybWp4ZWl4YmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTU3NjMsImV4cCI6MjA4NDU5MTc2M30.b3FCJS66vPp2Fs_OqcV35wCyaGMj_nchDHM9xU_hQn0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
