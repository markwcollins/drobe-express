import fastq from 'fastq'
import WebPage from '../services/WebPage'
import Product from '../services/Product'
import { IProductPopulated, IProfile, SupabaseTables } from '../types/supabase-types'
import { consoleError } from '../services/ErrorHandling'
import { trackAnalyticsEvent } from '../services/Analytics'
import { EVENT_NAME } from '../types/events'
import { supabase } from '../services/supabase'

interface IuserQueue {
  profileFrom: number
  profileTo: number
}

interface IwebPagesQueue {
  product: IProductPopulated
  profile: IProfile
}

export default class UpdateWebPagesCron {
  increment = 1
  concurrency = 1
  userQueue: fastq.queueAsPromised<IuserQueue, any>
  webPageQueue: fastq.queueAsPromised<IwebPagesQueue, any>

  constructor() {
    this.userQueue = fastq.promise(this.addWebPagesToQueue, this.concurrency)
    this.webPageQueue = fastq.promise(this.updateWebPages, this.concurrency)
  }

  async run() {
    const { error, count } = await supabase.from(SupabaseTables.PROFILES).select('*', { count: 'exact', head: true })
    if (!count || error) {
      return consoleError(error, count)
    }

    for (let profileFrom = 0; profileFrom <= count; profileFrom += this.increment) {
      await this.userQueue.push({ profileFrom, profileTo: profileFrom + this.increment })
    }
  }

  async addWebPagesToQueue({ profileFrom, profileTo }: IuserQueue) {
    let profile: IProfile|undefined
    let products: IProductPopulated[]|undefined

    try {
      const { data: profileData, error: profileError } =  await supabase.from<IProfile>(SupabaseTables.PROFILES).select().range(profileFrom, profileFrom)
      if (profileError) {
        throw profileError
      }
      if (!profileData) return false
      profile = profileData[0] as IProfile

      const { data: productsData, error: productsError } = await Product.selectAndPopulate({ userId: profile.user_id })
      if (productsError) {
        throw productsError
      }
      if (!productsData || !productsData.length) return false
      products = productsData as IProductPopulated[]
    } catch (e) {
      consoleError(e)
      return false
    }
    
    if (!products) return false

    products.forEach(product => {
      if (!profile) return false
      this.webPageQueue.push({ profile, product })
    })
  }

  async updateWebPages({ product, profile }: IwebPagesQueue) {
    try {
      if (!product.webPage) {
        throw new Error('productData.webPage is missing')
      }
      const webPage = product.webPage
      if (!WebPage.isValid(webPage)) {
        throw new Error('webPage.isValid is not missing')
      }
      // only get data if there is a price alredy attached to the page and we the page is page_foundr
      const { hasPriceChanged, webPage: webPageUpdated } = await WebPage.updateOpenGraphData({ webPage, profile })
      if (hasPriceChanged && webPageUpdated) {
        // prices data is on both the product and web page so we need to update both
        const _product = new Product(product)

        trackAnalyticsEvent(product.profile_id, EVENT_NAME.PriceChanged, { 
          url: webPageUpdated.url,
          price: webPageUpdated.price,
          oldPrice: webPage.price,
          currency: webPageUpdated.currency,
          title: webPageUpdated.title
        })

        _product.update({ price: webPageUpdated.price, currency: webPageUpdated.currency, title: webPageUpdated.title })
      }
      return true
    } catch (e) {
      consoleError(e)
      return false
    }
  }

}