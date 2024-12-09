import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-public-api-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
