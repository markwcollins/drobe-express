import OpenGraph from './OpenGraph'
import { supabase } from './supabase'
import { ApiID, IWebPage, IIWebPageBaseHistory, SupabaseTables } from '../types'

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
    const newPrice = ogData?.price
    if (!newPrice) return

    const oldPrice = this.data.price
    if (!oldPrice) return

    if (newPrice !== oldPrice) { // only update if the price is different
      // default history if it doesn't exist yet
      const oldHistory = this.data.history || createHistory({ timestamp: new Date(this.data.inserted_at!).getTime(), price: oldPrice })
        
      // update price to new price and add history
      await this.update({ 
        price: newPrice, 
        history: createHistory({ timestamp: Date.now(), price: newPrice, history: oldHistory })  
      })
    }
  }
}

interface IcreateHistory {
  timestamp: number,
  price: string
  history?: IIWebPageBaseHistory 
}

const createHistory = ({ timestamp = Date.now(), price, history }: IcreateHistory ): IIWebPageBaseHistory => (
  { 
    timestamps: [ ...history?.timestamps || [], timestamp.toString() ],
    data: { 
      ...history?.data || {},
      [ timestamp ]: { price } 
    } 
  }
)