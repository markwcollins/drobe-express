import OpenGraph from './OpenGraph'
import { supabase } from './supabase'
import { ApiID, IWebPage, IIWebPageBaseHistory, SupabaseTables } from '../types/supabase-types'

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

  get isValid() {
    return this.data.price && this.data.page_found
  }

  async get() {
    const { data, error } = await WebPage.api.select().eq('id', this.id)
    if (data) {
      this.data = data[0]
      this.id = this.data.id
    }
    return this.data
  }

  async update(data:Partial<IWebPage>) {
    const { data: resData } = await supabase.from<IWebPage>(SupabaseTables.WEB_PAGES).update(data).eq('id', this.id)
    if (resData) {
      this.data = resData[0]
      this.id = this.data.id
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

    // if we didnt get a response then we set the page as not found so we dont rescan the page
    if (!this.openGraphData?.isValid) {
      this.update({ page_found: false })
    }

    return this.openGraphData?.data
  }
  
  async updateOpenGraphData() {
    const ogData = await this.extractOpenGraphData()
    const newPrice = ogData?.price
    if (!newPrice) return

    const oldPrice = this.data.price
    if (!oldPrice) return

    if (newPrice !== oldPrice) { // only update if the price is different
      // default history if it doesn't exist yet
      const oldHistory = this.data.history || WebPage.createHistory({ timestamp: new Date(this.data.inserted_at!).getTime(), price: oldPrice })
        
      // update price to new price and add history
      await this.update({ 
        price: newPrice, 
        history: WebPage.createHistory({ timestamp: Date.now(), price: newPrice, history: oldHistory })  
      })
    }
  }
  

  static createHistory({ timestamp = Date.now(), price, history }: IcreateHistory ): IIWebPageBaseHistory {
    return {
      data: [
        ...history?.data || [],
        { timestamp, price }
      ]
    }
  }
}

interface IcreateHistory {
  timestamp: number,
  price: string
  history?: IIWebPageBaseHistory 
}