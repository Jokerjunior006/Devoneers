import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wrxefgnylazezpkpalxz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyeGVmZ255bGF6ZXpwa3BhbHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NTA4NDMsImV4cCI6MjA5MjEyNjg0M30.eEw10ozsun78DpZHdKIQQ5w4OTK41-1xu5vULaiDevc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)