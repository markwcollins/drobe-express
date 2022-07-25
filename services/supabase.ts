import { createClient } from '@supabase/supabase-js'
import CONFIG from '../config'
import { SupabaseTables } from '../types'

export const createSupabaseClient = () => createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
export const createSupabaseApi = () => createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE)

export const supabaseClient = createSupabaseClient()
export const supabase = createSupabaseApi()

export const getUser = async (jwt: string) => supabase.auth.api.getUser(jwt)

export abstract class SupabaseResource<T extends { id: string }> {
  data?: T
  abstract table: SupabaseTables
  abstract populateQuery: string

  constructor(data: T|undefined) {
    this.data = data
  }

  get id() {
    return this.data?.id
  }

  async get() {
    const { data, error } = await supabase.from(this.table).select(this.populateQuery).eq('id', this.id)
    if (data) {
      this.data = data[0]
    }
    return this.data
  }

  async update(data = {}) {
    const { data: resData, error } = await supabase.from(this.table).update(data).eq('id', this.id)
    if (resData) {
      this.data = resData[0]
    }
    return this.data
  }

  async upsert(id: string, data ={}) {
    const { data: resData, error } = await supabase.from(this.table).upsert({ id, ...data })
    if (resData) {
      this.data = resData[0]
    }
    return this.data
  }
}
