import { createClient } from '@supabase/supabase-js'
import CONFIG from '../config'
import { ApiID, IDefault } from '../types'
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder'

export const createSupabaseClient = () => createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
export const createSupabaseApi = () => createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE)

export const supabaseClient = createSupabaseClient()
export const supabase = createSupabaseApi()

export const getUser = async (jwt: string) => supabase.auth.api.getUser(jwt)

// export abstract class SupabaseResource<T extends IDefault> {
//   id: ApiID
//   data: T
//   abstract api: SupabaseQueryBuilder<T>
//   abstract populateQuery: string

//   constructor(data: T) {
//     this.data = data
//     this.id =  this.data.id
//   }

//   select() {
//     return this.api.select(this.populateQuery)
//   }



//   async get() {
//     const { data, error } = await this.api.select(this.populateQuery).eq('id', this.id)
//     if (data) {
//       this.data = data[0]
//     }
//     return this.data
//   }

//   async update(data = {}) {
//     const { data: resData, error } = await this.api.update(data).eq('id', this.id)
//     if (resData) {
//       this.data = resData[0]
//     }
//     return this.data
//   }
// }
