
import { supabase } from './supabase'
import { ApiID, IProduct, IProductPopulated, SupabaseTables } from '../types'

export default class Product {
  id: ApiID
  data: IProduct|IProductPopulated
  static api = supabase.from<IProduct>(SupabaseTables.PRODUCTS)
  static populateQuery = `
    * , 
    webPage: web_page_id (
        *
    )
  `

  constructor(data: IProduct|IProductPopulated) {
    this.data = data
    this.id = this.data.id
  }

  static select() {
    return Product.api.select()
  }

  static selectAndPopulate(data?: { userId?: string }) {
    if (data?.userId) {
      return supabase.from<IProductPopulated>(SupabaseTables.PRODUCTS).select(Product.populateQuery).eq('user_id', data.userId)
    }
    return supabase.from<IProductPopulated>(SupabaseTables.PRODUCTS).select(Product.populateQuery)
  }

  async get() {
    const { data, error } = await Product.select().eq('id', this.id)
    if (data) {
      this.data = data[0]
      this.id = this.data.id
    }
    return this.data
  }

  async update(data = {}) {
    const { data: resData, error } = await Product.api.update(data).eq('id', this.id)
    if (resData) {
      this.data = resData[0]
      this.id = this.data.id
    }
    return this.data
  }
}
