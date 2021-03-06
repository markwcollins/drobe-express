import { Request, Response } from 'express'
import WebsiteDataExtractor, { isValidHttpUrl } from '../services/WebsiteDataExtractor'
import { isValidCountry, isRestrictedSite } from '../types'

/*
  body: {
    url: string
    country?: string
  }
*/

const handler = async (req: Request, res: Response) => {
  const url = req.body?.url as string | undefined
  if (!url) {
    return res.status(400).send('Url missing')
  }

  if (!isValidHttpUrl(url)) {
    return res.status(400).send('Invalid url')
  }

  if (isRestrictedSite(url)) {
    return res.status(400).send('Site not allowed for scanning')
  }

  const country = req.body.country as string | undefined
  if (country && !isValidCountry(country)) {
    return res.status(400).send('Invalid country or country not supported')
  }

  try {
    const productData = await WebsiteDataExtractor.getProductData({ url, country })
    if (!productData) {
      throw new Error(`WebsiteDataExtractor.getProductData failed`)
    }
    res.status(200).json(productData)
  } catch (e) {
    // consoleError(e, { url, country })
    res.status(400).send(e)
  }
}

export default handler
