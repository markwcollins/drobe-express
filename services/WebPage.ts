import OpenGraph from './OpenGraph'
import { supabase } from './supabase'
import { ApiID, IWebPage, SupabaseTables } from '../types'

export default class WebPage {
  id: ApiID
  data: IWebPage
  openGraphData?: OpenGraph
  static api = supabase.from<IWebPage>(SupabaseTables.WEB_PAGES)

  constructor(data: IWebPage) {
    this.data = data
    this.id = this.data.id
    this.openGraphData = undefined
  }

  async get() {
    const { data, error } = await WebPage.api.select().eq('id', this.id)
    if (error) {
      console.log(error)
    } else if (data) {
      this.data = data[0]
    }
    return this.data
  }

  async update(data:Partial<IWebPage>) {
    const { data: resData } = await supabase.from<IWebPage>(SupabaseTables.WEB_PAGES).update(data).eq('id', this.id)
    console.log('update', this.id, data, resData)
    if (resData) {
      this.data = resData[0]
    }
    return this.data
  }

  async extractOpenGraphData() {
    if (!this.data?.url) {
      await this.get()
    }
    if (this.data?.url) {
      this.openGraphData = new OpenGraph(this.data.url)
      await this.openGraphData.init()
    }
    return this.openGraphData?.data
  }

  async updateOpenGraphData() {
    const ogData = await this.extractOpenGraphData()
    const price = ogData?.price
    if (!price) return

    const priceAsString = price.toString()
    if (priceAsString !== this.data.price) { // only update if the price is different
      const history = this.data.history || {}
      await this.update({ 
        price, 
        history: { 
          ...history,
          [ Date.now() ]: { price } 
        } 
      })
    }
  }
}
