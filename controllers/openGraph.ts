import { Request, Response } from 'express'
import FXRate from '../services/FXRate'
import OpenGraph from '../services/OpenGraph'
import { IOpenGraphFormattedApiRes, IOpenGraphFormattedData } from '../types/supabase-types'

/*
  body: {
    urls: string[]
    profileCurrency?: string
  }
*/

const handler = async (req: Request, res: Response) => {
  const urls = req.body?.urls as string[] | undefined
  if (!urls || !urls.length) {
    return res.status(400).send('Urls missing')
  }

  const profileCurrency = req.body?.profileCurrency as string | undefined

  try {
    const openGraphs = await Promise.allSettled(urls.map(async (url): Promise<IOpenGraphFormattedApiRes> => {
      const og = new OpenGraph(url)
      await og.init() 

      let converted_price: string|undefined

      if (profileCurrency && og.data?.price && profileCurrency !== og.data?.currency) {
        converted_price = await FXRate.convert({ 
          amount: og.data.price, 
          from_currency: og.data?.currency, 
          to_currency: profileCurrency 
        })
      }
      
      return { 
        ...og.data,
        url: og.url, 
        converted_currency: profileCurrency || og.data?.currency, 
        converted_price: converted_price || og.data?.price,
      }
    }))
    
    res.status(200).json({ data: openGraphs })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default handler
