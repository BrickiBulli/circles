import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eshglmqxleeljzmujkkk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzaGdsbXF4bGVlbGp6bXVqa2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NTU3OTIsImV4cCI6MjA0OTMzMTc5Mn0.LAkAStxdV2QhBpUoMj3xG-mvJtoX0JjB1VCz9IwrDxU';

export const supabase = createClient(supabaseUrl, supabaseKey);
