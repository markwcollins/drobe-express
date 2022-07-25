import { Request, Response } from 'express'
import WebsiteDataExtractor from '../services/WebsiteDataExtractor'

/*
  body: {
    html: string
  }
*/

const handler = async (req: Request, res: Response) => {
  const html = req.body?.html as string | undefined
  if (!html) {
    return res.status(400).send('Html missing or wrong format')
  }

  try {
    const _html = decodeURIComponent(html)
    const productData = await WebsiteDataExtractor.extractData({ html: _html })
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
