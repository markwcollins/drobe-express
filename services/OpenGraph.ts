import CONFIG from '../config'
import axios from 'axios'

export interface IOpenGraphFormattedData { 
  title?: string, 
  site_name?: string, 
  image_url?: string, 
  description?: string, 
  price?: string, 
  currency?: string 
} 

export default class OpenGraph {
  url: string
  rawResponse: any
  data: IOpenGraphFormattedData | undefined
  isValid: boolean | undefined
  baseUrl = 'https://opengraph.io/api/1.1/site/'
  apiKey = CONFIG.OPEN_GRAPH_API_KEY

  constructor(url:string) {
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
    try {
      const requestUrl = this.generateOpenGraphRequestUrl(url)
      const res = await axios.get(requestUrl)
      return res.data.hybridGraph
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.error('get og-data error', url, e.response?.data.message)
      }
      return undefined
    }
  }

  generateOpenGraphRequestUrl(url: string = this.url, baseUrl = this.baseUrl, apiKey = this.apiKey) {
    return baseUrl + encodeURIComponent(url) + '?app_id=' + apiKey
  }

  formatData(hybridGraph: any): IOpenGraphFormattedData {
    const data:IOpenGraphFormattedData = {}

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
    if (hybridGraph.products?.length && hybridGraph.products[0].offers.length) {
      const offer = hybridGraph.products[0].offers[0]
      data.price = offer.price
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