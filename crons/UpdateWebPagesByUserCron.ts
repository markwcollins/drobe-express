import fastq from 'fastq'
import WebPage from '../services/WebPage'
import Product from '../services/Product'
import { IProductPopulated, IProfile, SupabaseTables } from '../types/supabase-types'
import { consoleError } from '../services/ErrorHandling'
import { trackAnalyticsEvent } from '../services/Analytics'
import { EVENT_NAME } from '../types/events'
import { supabase } from '../services/supabase'

interface IupdateWebPagesProps {
  from: number
  to: number
}

export default class UpdateWebPagesCron {
  increment = 1
  concurrency = 1
  queue: fastq.queueAsPromised<IupdateWebPagesProps, any>

  constructor() {
    this.queue = fastq.promise(this.updateWebPages, this.concurrency)
  }

  async run() {
    const { error, count } = await supabase.from(SupabaseTables.PROFILES).select('*', { count: 'exact', head: true })
    if (!count || error) {
      return consoleError(error, count)
    }

    for (let from = 0; from <= count; from += this.increment) {
      await this.queue.push({ from, to: from + this.increment })
    }
  }

  async updateWebPages({ from, to }: IupdateWebPagesProps) {
    let profile: IProfile|undefined
    let products: IProductPopulated[]|undefined

    try {
      const { data: profileData, error: profileError } =  await supabase.from<IProfile>(SupabaseTables.PROFILES).select().range(from, from)
      if (profileError) {
        throw profileError
      }
      profile = profileData[0]

      const { data: productsData, error: productsError } = await Product.selectAndPopulate({ userId: profile.user_id })
      if (productsError) {
        throw productsError
      }
      products = productsData
    } catch (e) {
      consoleError(e)
      return false
    }
 
    if (!profile) return false
    if (!products || !products.length) return false
    
    return await Promise.allSettled(products.map(async (productData) => {
      try {
        if (!productData.webPage) {
          throw new Error('productData.webPage is missing')
        }
        const webPage = productData.webPage
        if (!WebPage.isValid(webPage)) {
          throw new Error('webPage.isValid is not missing')
        }
        // only get data if there is a price alredy attached to the page and we the page is page_found

        const { hasPriceChanged, webPage: webPageUpdated } = await WebPage.updateOpenGraphData({ webPage, profile })
        if (hasPriceChanged && webPageUpdated) {
          // prices data is on both the product and web page so we need to update both
          const product = new Product(productData)

          trackAnalyticsEvent(product.data.profile_id, EVENT_NAME.PriceChanged, { 
            url: webPageUpdated.url,
            price: webPageUpdated.price,
            oldPrice: webPage.price,
            currency: webPageUpdated.currency,
            title: webPageUpdated.title
          })

          product.update({ price: webPageUpdated.price, currency: webPageUpdated.currency, title: webPageUpdated.title })
        }
        return true
      } catch (e) {
        consoleError(e)
        return false
      }
    }))
  }

}