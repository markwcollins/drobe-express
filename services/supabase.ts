import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!

export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey)
export const createSupabaseApi = () => createClient(supabaseUrl, supabaseServiceRole)

export const supabase = createSupabaseClient()

export const getUser = async (jwt:string, supabase=createSupabaseApi()) => supabase.auth.api.getUser(jwt)