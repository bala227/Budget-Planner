import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'url';
const supabaseAnonKey = 'url';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
