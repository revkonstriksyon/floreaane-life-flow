import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kinwqqfqfcytkwdxcidj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpbndxcWZxZmN5dGt3ZHhjaWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODAwNTYsImV4cCI6MjA2ODM1NjA1Nn0.Vis-vnmj0_9QMDpn7nC_SFo4u8Uqp0iBR2CCraUtR10'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)