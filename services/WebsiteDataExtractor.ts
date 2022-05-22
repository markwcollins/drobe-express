import axios from 'axios'
import * as cheerio from 'cheerio'
import { consoleError } from './ErrorHandling'
import { HttpsProxyAgent } from 'hpagent'
import { extractOpenGraph } from '@devmehq/open-graph-extractor'
import { IWebsiteProductData } from '../types/global-types'
import { Product, Offer } from 'schema-dts'

interface IOpenGraphRaw {
  ogSiteName?: string
  ogUrl?: string
  ogTitle?: string
  ogType?: string
  ogDescription?: string

  ogProductPriceAmount?: string
  ogPriceAmount?: string
  productPriceAmount?: string

  ogProductPriceCurrency?: string
  ogPriceCurrency?: string
  productPriceCurrency?: string

  ogProductAvailability?: string
  ogAvailability?: string
  ogImageURL?: string
  ogImage?: {
    url?: string
    width?: string
    height?: string
    type?: string
  }
  ogLocale?: string
  favicon?: string
}

const PROXY_PASSWORD = '9exmcx947dkb'

interface IGetDataParams  {
  url: string,
  country?: string,
  useProxy?: boolean
}

export default class WebsiteDataExtractor {

  static async getProductData({ url, country }: IGetDataParams)  {
    // const url = 'https://shonajoy.com/products/iris-cut-out-backless-midi-dress-saffron?variant=39539691913300'
    // const url = 'https://www.marcjacobs.com/default/the-large-tote-bag/M0016156.html'
    const { html, error } = await WebsiteDataExtractor.getHtml({ url, country, useProxy: !!country  })
    if (html) {
      return await WebsiteDataExtractor.extractData({ html })
    }
    throw error
  }

  static getHtml= async ({ url, country, useProxy = false }: IGetDataParams) => {
    let html: string|undefined
    let error: Error|undefined
    
    try {
      if (!isValidHttpUrl(url)) {
        throw new Error(`Invalid url on requesting html ${url}`)
      }
  
      const options = useProxy 
        ? {
          httpsAgent: new HttpsProxyAgent({
            proxy: `http://lum-customer-hl_5175c637-zone-zone1-country-${country}:${PROXY_PASSWORD}@zproxy.lum-superproxy.io:22225`
          })
        } : undefined
        
      const response = await axios.get(url, options)
  
      html = response.data as string
    } catch(e) {
      error = axios.isAxiosError(e) ? e :  new Error('Unknown error while extracting through proxy') 
      consoleError(error)
    }
    return { html, error}
  }

  static async extractData({ html }: { html: string }) {
    const openGraphData = WebsiteDataExtractor.extractOpenGraphData(html)
    const schemeIdData = WebsiteDataExtractor.extractSchemaIdData(html)
    
    return {
      hybrid: {
        ...WebsiteDataExtractor.formatOpenGraphData(openGraphData),
        ...WebsiteDataExtractor.formatSchemaIdData(schemeIdData),
      },
      openGraphData,
      schemeIdData
    }
  }

  static formatOpenGraphData(data: IOpenGraphRaw): IWebsiteProductData {
    return {
      url: data.ogUrl,
      title: data.ogTitle,
      site_name: data.ogSiteName,
      image_url: data.ogImage?.url,
      description: data.ogDescription,
      price: data.ogProductPriceAmount || data.ogPriceAmount || data.productPriceAmount,
      currency: data.ogProductPriceCurrency || data.ogPriceCurrency || data.productPriceCurrency,
      availability: data.ogAvailability ? !!data.ogAvailability : undefined
    }
  }

  static formatSchemaIdData(data: any): IWebsiteProductData {
    if (data?.['@type'] !== 'Product') return {}

    const _data = data as Product
    const _offer = _data.offers as Offer || {}
    
    return {
      title: _data.name as string,
      site_name: _data.name as string,
      image_url: _data.image as string,
      description: _data.description as string,
      price: _offer.price as string,
      currency: _offer.priceCurrency as string,
      availability: _offer.availability ? !!_offer.availability as boolean : undefined
    }
  }
  
  static extractOpenGraphData(html: string): IOpenGraphRaw {
    return extractOpenGraph(html, { 
      customMetaTags: [
        {
          multiple: false,
          property: 'product:price:amount',
          fieldName: 'productPriceAmount',
        },
        {
          multiple: false,
          property: 'product:price:currency',
          fieldName: 'productPriceCurrency',
        },
      ] 
    })
  }

  
  static extractSchemaIdData(html: string) {
    let data: Record<string, any> = {}
    try {
      const $ = cheerio.load(html)
      /* @ts-ignore */
      const jsonRaw = $("script[type='application/ld+json']")[0].children[0].data
        // do not use JSON.stringify on the jsonRaw content, as it's already a string
      if (jsonRaw) {
        data = JSON.parse(jsonRaw) as {}
      }
    } catch (e) {
      consoleError(e)
    }
    return data
  }
}


export const isValidHttpUrl = (string:string) => {
  let url:URL
  try {
    url = new URL(string)
  } catch (_) {
    return false; 
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}
