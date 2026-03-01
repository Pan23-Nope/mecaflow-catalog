// Configuration for Supabase
// REPLACE these with your actual Supabase Project details
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

// Initialize the Supabase client
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Export to window object for global access if needed, 
// or just use this file to centralize the setup.
window.mecaSupabase = _supabase;
console.log('MecaFlow: Supabase initialized.');
