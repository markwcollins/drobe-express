import OpenGraph from './OpenGraph'
import { supabase } from './supabase'
import { IWebPage, IIWebPageBaseHistory, SupabaseTables, IProfile, IIWebPageBaseHistoryResult, IWebPageBase } from '../types/global-types'
import FXRate from './FXRate'

export default class WebPage {
  data?: Partial<IWebPage>
  static api = supabase.from<IWebPageBase>(SupabaseTables.WEB_PAGES)

  constructor(data?: Partial<IWebPage>) {
    this.data = data
  }

  get isValid() {
    return this.data && WebPage.isValid(this.data)
  }

  static isValid(webPage: Partial<IWebPage>) {
    return webPage.id && webPage.price && webPage.page_found && webPage.display_url && !isRestrictedSite(webPage.display_url)
  }

  async get() {
    if (!this.data?.id) {
      throw new Error('id missing')
    }
    this.data = await WebPage.get(this.data.id)
  }

  static async get(id: string):Promise<IWebPageBase|undefined> {
    const { data, error } = await WebPage.api.select().eq('id', id)
    return data?.[0]
  }

  async update(_data: Partial<IWebPage>) {
    if (!this.data?.id) {
      throw new Error('id missing')
    }
    this.data = await WebPage.update(this.data.id, _data)
  }

  static async update(id:string, _data:Partial<IWebPage>):Promise<IWebPage|undefined>  {
    const { data, error } = await WebPage.api.update(_data).eq('id', id)
    return data?.[0]
  }

  static async extractOpenGraphData(url: string) {
    const openGraphData = new OpenGraph(url)
    await openGraphData.init()
    return openGraphData?.data
  }
  
  static async updateOpenGraphData({ webPage, profile }: { webPage: IWebPage, profile?: IProfile}) {
    let hasPriceChanged = false
    const mostRecentOgData = await WebPage.extractOpenGraphData(webPage.url)
    const newOgPrice = mostRecentOgData?.price
    const oldOgPrice = webPage.og_price
    let newWebPage: IWebPage|undefined

    if (newOgPrice && oldOgPrice && newOgPrice !== oldOgPrice) { // only update if the price is different
      hasPriceChanged = true
      
      // default history if it doesn't exist yet
      const oldHistory = webPage.history || WebPage.createHistory({ 
        timestamp: new Date(webPage.inserted_at!).getTime(), 
        price: webPage.price ,
        currency: webPage.currency,
        og_price: webPage.og_price,
        og_currency: webPage.og_currency,
      })
        
      const userPreferredCurrency = profile?.currency
      const newOgCurrency = mostRecentOgData.currency

      let price = newOgPrice
      if (userPreferredCurrency) {
        price = await FXRate.convert({ 
          amount: newOgPrice, 
          from_currency: newOgCurrency, 
          to_currency: userPreferredCurrency
        }) || newOgPrice
      } 

      const updateData = {
        price, 
        currency: userPreferredCurrency || newOgCurrency,
        og_price: newOgPrice,
        og_currency: newOgCurrency,
      }
      // update price to new price and add history
      newWebPage = await WebPage.update(webPage.id, { 
        ...updateData,
        history: WebPage.createHistory({ 
          timestamp: Date.now(), 
          ...updateData,
          history: oldHistory
        })  
      })
    }

    return { hasPriceChanged, webPage: newWebPage }
  }
  

  static createHistory({ timestamp = Date.now(), price, history, currency }: IcreateHistory ): IIWebPageBaseHistory {
    return {
      data: [
        ...history?.data || [],
        { 
          timestamp, 
          price, 
          currency 
        }
      ]
    }
  }
}

interface IcreateHistory extends IIWebPageBaseHistoryResult {
  history?: IIWebPageBaseHistory 
}

const sitesToExclude = [
  'google', 
  'ad.doubleclick.net',
  'facebook',
  'clickserve.dartsearch.net',
  'youtube',
  'pixel',
  'apple.com',
  'track.trafficguard.ai',
  'goo.gl',
  'amazon',
  'ebay',
  'xg4ken.com',
]

const regexExclusion = new RegExp(sitesToExclude.join('|'))
export const isRestrictedSite = (url: string): boolean => regexExclusion.test(url)