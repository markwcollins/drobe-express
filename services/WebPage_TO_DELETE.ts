// import OpenGraph from './OpenGraph'
// import { supabase } from './supabase'
// import { ApiID, IWebPage, IIWebPageBaseHistory, SupabaseTables, IProfile, IIWebPageBaseHistoryResult } from '../types/supabase-types'
// import FXRate from './FXRate'

// export default class WebPage {
//   id: ApiID
//   data: IWebPage
//   openGraphData?: OpenGraph
//   static api = supabase.from<IWebPage>(SupabaseTables.WEB_PAGES)

//   constructor(data: IWebPage) {
//     this.data = data
//     this.id = this.data.id
//     this.openGraphData = undefined
//   }

//   get isValid() {
//     return this.data.price && this.data.page_found
//   }

//   async get() {
//     const { data, error } = await WebPage.api.select().eq('id', this.id)
//     if (data) {
//       this.data = data[0]
//       this.id = this.data.id
//     }
//     return this.data
//   }

//   async update(data:Partial<IWebPage>) {
//     const { data: resData } = await supabase.from<IWebPage>(SupabaseTables.WEB_PAGES).update(data).eq('id', this.id)
//     if (resData) {
//       this.data = resData[0]
//       this.id = this.data.id
//     }
//     return this.data
//   }

//   async extractOpenGraphData() {
//     if (!this.data?.url) {
//       await this.get()
//     }
//     if (this.data?.url) {
//       this.openGraphData = new OpenGraph(this.data.url)
//       await this.openGraphData.init()
//     }

//     // if we didnt get a response then we set the page as not found so we dont rescan the page
//     if (!this.openGraphData?.isValid) {
//       this.update({ page_found: false })
//     }

//     return this.openGraphData?.data
//   }
  
//   async updateOpenGraphData({ profile }: { profile?: IProfile} = {}) {
//     let hasPriceChanged = false
//     const mostRecentOgData = await this.extractOpenGraphData()
//     const newOgPrice = mostRecentOgData?.price
//     const oldOgPrice = this.data.og_price

//     if (newOgPrice && oldOgPrice && newOgPrice !== oldOgPrice) { // only update if the price is different
//       hasPriceChanged = true
      
//       // default history if it doesn't exist yet
//       const oldHistory = this.data.history || WebPage.createHistory({ 
//         timestamp: new Date(this.data.inserted_at!).getTime(), 
//         price: this.data.price ,
//         currency: this.data.currency,
//         og_price: this.data.og_price,
//         og_currency: this.data.og_currency,
//       })
        
//       const userPreferredCurrency = profile?.currency
//       const newOgCurrency = mostRecentOgData.currency

//       let price = newOgPrice
//       if (userPreferredCurrency) {
//         price = await FXRate.convert({ 
//           amount: newOgPrice, 
//           from_currency: newOgCurrency, 
//           to_currency: userPreferredCurrency
//         }) || newOgPrice
//       } 

//       const updateData = {
//         price, 
//         currency: userPreferredCurrency || newOgCurrency,
//         og_price: newOgPrice,
//         og_currency: newOgCurrency,
//       }

//       // update price to new price and add history
//       await this.update({ 
//         ...updateData,
//         history: WebPage.createHistory({ 
//           timestamp: Date.now(), 
//           ...updateData,
//           history: oldHistory
//         })  
//       })
//     }

//     return { hasPriceChanged }
//   }
  

//   static createHistory({ timestamp = Date.now(), price, history, currency }: IcreateHistory ): IIWebPageBaseHistory {
//     return {
//       data: [
//         ...history?.data || [],
//         { 
//           timestamp, 
//           price, 
//           currency 
//         }
//       ]
//     }
//   }
// }

// interface IcreateHistory extends IIWebPageBaseHistoryResult {
//   history?: IIWebPageBaseHistory 
// }