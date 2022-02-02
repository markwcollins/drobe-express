const OPEN_GRAPH_BASE_REQUEST_URL = 'https://opengraph.io/api/1.1/site/'
const OPEN_GRAPH_API_KEY = process.env.OPEN_GRAPH_API_KEY!

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
  baseUrl = OPEN_GRAPH_BASE_REQUEST_URL
  apiKey = OPEN_GRAPH_API_KEY

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
      const res = await fetch(requestUrl)
      const data = await res.json()
      return data.hybridGraph
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  generateOpenGraphRequestUrl(url:string = this.url, baseUrl = this.baseUrl, apiKey = this.apiKey) {
    const urlEncoded = encodeURIComponent(url)
    return baseUrl + urlEncoded + '?app_id=' + apiKey
  }

  formatData(hybridGraph:any):IOpenGraphFormattedData {
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