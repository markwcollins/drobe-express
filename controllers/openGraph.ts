import { Request, Response, NextFunction } from 'express'
import OpenGraph from '../services/OpenGraph'

/*
  body: {
    urls: string[]
  }
*/

const handler = async (req: Request, res: Response) => {
  const urls = req.body?.urls as string[] | undefined
  if (!urls || !urls.length) {
    return res.status(400).send('Urls missing')
  }
  try {
    const openGraphs = await Promise.allSettled(urls.map(async url => {
      const og = new OpenGraph(url)
      await og.init() 
      return { url: og.url, ...og.data }
    }))
    res.status(200).json({ data: openGraphs })
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default handler