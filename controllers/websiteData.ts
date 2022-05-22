import { Request, Response } from 'express'
import { consoleError } from '../services/ErrorHandling'
import WebsiteDataExtractor, { isValidHttpUrl } from '../services/WebsiteDataExtractor'
import { isValidCountry } from '../types/global-types'

/*
  body: {
    url: string
    country?: string
  }
*/

const handler = async (req: Request, res: Response) => {
  const url = req.body?.url as string
  if (!url) {
    return res.status(400).send('Url missing')
  }

  if (!isValidHttpUrl(url)) {
    return res.status(400).send('Invalid url')
  }

  const country = req.body.country
  if (country && !isValidCountry(country)) {
    return res.status(400).send('Invalid country or country not supported')
  }

  try {
    const productData = await WebsiteDataExtractor.getProductData({ url, country })
    res.status(200).json({ ...productData.hybrid })
  } catch (e) {
    consoleError(e)
    res.status(500).send(e)
  }
}

export default handler
