import { ApiID, IWebPage, SupabaseTables } from 'types'
import OpenGraph from 'services/OpenGraph'
import { supabase } from 'services/supabase'

export default class WebPage {
  id: ApiID
  data?: IWebPage
  openGraphData?: OpenGraph

  constructor(id:ApiID, data:IWebPage|undefined=undefined) {
    this.id = id
    this.data = data
    this.openGraphData = undefined
  }

  async get() {
    const { data, error } = await supabase.from(SupabaseTables.WEB_PAGES).select().eq('id', this.id)
    if (data) {
      this.data = data[0]
    }
    return this.data
  }

  async update(data={}) {
    const { data:resData, error } = await supabase.from(SupabaseTables.WEB_PAGES).update(data).eq('id', this.id)
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
}