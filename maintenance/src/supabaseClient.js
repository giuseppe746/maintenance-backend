// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvzjxvvamlbwftsixruv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2emp4dnZhbWxid2Z0c2l4cnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NjcxNDcsImV4cCI6MjA2MDU0MzE0N30.zOo1ljkt5TswuOlN8-4ukr4ZUQTV2Kix2mHRKQaNmrs';

export const supabase = createClient(supabaseUrl, supabaseKey);
