// import { Request, Response } from 'express'
// import FXRate from '../services/FXRate'
// import OpenGraph from '../services/OpenGraph'
// import { IWebsiteProductDataWithConversion } from '../types/global-types'

// /*
//   body: {
//     urls: string[]
//     profileCurrency?: string
//   }
// */

// const CURRENCY_CONVERSION_ENABLED = false

// const handler = async (req: Request, res: Response) => {
//   const urls = req.body?.urls as string[] | undefined
//   if (!urls || !urls.length) {
//     return res.status(400).send('Urls missing')
//   }

//   try {
//     const openGraphs = await Promise.allSettled(urls.map(async (url): Promise<IWebsiteProductDataWithConversion> => {
//       const og = new OpenGraph(url)
//       await og.init() 

//       let converted_price: string|undefined
//       let converted_currency: string|undefined

//       const profileCurrency = req.body?.profileCurrency as string | undefined
//       if (CURRENCY_CONVERSION_ENABLED && profileCurrency && og.data?.price && profileCurrency !== og.data?.currency) {
//         converted_currency = profileCurrency
//         converted_price = await FXRate.convert({ 
//           amount: og.data.price, 
//           from_currency: og.data?.currency, 
//           to_currency: converted_currency 
//         })
//       }
      
//       return { 
//         ...og.data,
//         url: og.url,
//         converted_currency: converted_currency || og.data?.currency, 
//         converted_price: converted_price || og.data?.price,
//       }
//     }))
    
//     res.status(200).json({ data: openGraphs })
//   } catch (e) {
//     console.error(e)
//     res.status(400).send(e)
//   }
// }

// export default handler
