import { createClient } from '@supabase/supabase-js'
import CONFIG from '../config'

export const createSupabaseClient = () => createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
export const createSupabaseApi = () => createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE)

export const supabaseClient = createSupabaseClient()
export const supabase = createSupabaseApi()

export const getUser = async (jwt: string) => supabase.auth.api.getUser(jwt)
