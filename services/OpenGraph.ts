import CONFIG from '../config'
import axios from 'axios'
import { IOpenGraphFormattedData } from '../types/supabase-types'

export default class OpenGraph {
  url: string
  rawResponse: any
  data: IOpenGraphFormattedData | undefined
  isValid: boolean | undefined
  baseUrl = 'https://opengraph.io/api/1.1/site/'
  apiKey = CONFIG.OPEN_GRAPH_API_KEY

  constructor(url: string) {
    this.url = url
    this.data = undefined
    this.isValid = undefined
  }

  async init() {
    this.rawResponse = await this.getData()
    this.isValid = !!this.rawResponse
    if (this.isValid) {
      this.data = this.formatData(this.rawResponse)
    } 
    return this.data
  }

  async getData(url = this.url) {
    let graphData: any
    ({ graphData } = await this.openGraphRequest({ url } ));
    // if (!graphData) { 
    //   ({ graphData } = await this.openGraphRequest({ url, useProxy: true })); // retry with proxy
    // }
    // if (!graphData) { 
    //   ({ graphData } = await this.openGraphRequest({ url, useProxy: true, fullRender: true })); // retry with proxy and full render
    // }
    return graphData
  }

  async openGraphRequest({ url = this.url, baseUrl = this.baseUrl, apiKey = this.apiKey, useProxy = false, fullRender = false }) {
    let error: Error|undefined
    let graphData: any 

    try {
      const urlEncoded = encodeURIComponent(url)
      const requestUrl = `${baseUrl}${urlEncoded}?app_id=${apiKey}&use_proxy=${useProxy}&full_render=${fullRender}`
      const res = await axios.get(requestUrl, { timeout: 10000 })
      graphData =  res.data.hybridGraph
      if (!graphData) { 
        error = new Error(`hybridGraph data missing: ${url} use_proxy=${useProxy}&full_render=${fullRender}`)
        throw error
      }
    } catch(e) {
      if (axios.isAxiosError(e)) {
        error = e
        console.error('get og-data error', url, e.response?.data, e.response?.status, e.response?.statusText)
      } else {
        console.error(e)
      }
    }
    return { graphData, error }
  }

  formatData(hybridGraph: any): IOpenGraphFormattedData {
    const data: IOpenGraphFormattedData = {}

    if (hybridGraph.title) { 
      data.title = hybridGraph.title
    }
    if (hybridGraph.site_name) {
      data.title = hybridGraph.site_name
    }
    if (hybridGraph.image && isValidHttpUrl(hybridGraph.image)) {
      data.image_url = hybridGraph.image
    }
    if (hybridGraph.description) {
      data.description = hybridGraph.description
    }
    if (hybridGraph.products?.length && hybridGraph.products[0]?.offers.length) {
      const offer = hybridGraph.products[0].offers[0]
      if (offer.price) {
        data.price = offer.price.toString() // force as string
      }
      data.currency = offer.currency
    } 

    return data
  }
}

function isValidHttpUrl(string:string) {
  let url:URL
  try {
    url = new URL(string)
  } catch (_) {
    return false; 
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}
