// import fastq from 'fastq'
// import WebPage from '../services/WebPage'
// import Product from '../services/Product'
// import { IProduct } from '../types/supabase-types'
// import { consoleError } from '../services/ErrorHandling'
// import { analytics, trackAnalyticsEvent } from '../services/Analytics'
// import { EVENT_NAME } from '../types/events'

// interface IupdateWebPagesProps {
//   from: number
//   to: number
// }

// export default class UpdateWebPagesCron {
//   increment = 10
//   queue: fastq.queueAsPromised<IupdateWebPagesProps, any>

//   constructor() {
//     this.queue = fastq.promise(this.updateWebPages, 1)
//   }

//   async run() {
//     // only to get count of all products,
//     const { error, count } = await Product.api.select('*', { count: 'exact', head: true })
//     if (!count || error) {
//       return consoleError(error, count)
//     }

//     for (let from = 0; from <= count; from += this.increment) {
//       await this.queue.push({ from, to: from + this.increment })
//     }
//   }

//   async updateWebPages ({ from, to }: IupdateWebPagesProps) {
//     const { data: products, error } = await Product.selectAndPopulate().range(from, to)
//     if (!products || error) {
//       console.error(error)
//       return false
//     }
    
//     return await Promise.allSettled(products.map(async productData => {
//       try {
//         if (!productData.webPage) throw new Error('productData.webPage is missing')
//         const webPage = new WebPage(productData.webPage)
//         if (!webPage.isValid) throw new Error('webPage.isValid is not missing')
//         // only get data if there is a price alredy attached to the page and we the page is page_found

//         const { hasPriceChanged } = await webPage.updateOpenGraphData()
//         const ogData = webPage.openGraphData?.data
//         if (ogData && hasPriceChanged) {
//           // prices data is on both the product and web page so we need to update both
//           const product = new Product(productData)
          
//           trackAnalyticsEvent(product.data.profile_id, EVENT_NAME.PriceChanged, { 
//             url: webPage.data.url,
//             price: ogData.price,
//             oldPrice: product.data.price,
//             currency: ogData.currency,
//             title: ogData.title
//           })

//           product.update({ 
//             price: webPage.data.price, 
//             currency: webPage.data.currency, 
//             title: webPage.data.title 
//           })
//         }
//         return true
//       } catch (e) {
//         return false
//       }
//     }))
//   }
// }