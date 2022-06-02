import axios from 'axios'
import { Request, Response } from 'express'
import CONFIG from '../config'
import { consoleError } from '../services/ErrorHandling'
import { ISovrnGetLinkRes } from '../types/global-types'

/*
  body: {
    url: string
  }
*/


const SOVRN_GET_LINK_URL = 'http://api.viglink.com/api/link?format=json'

const handler = async (req: Request, res: Response) => {
  const { url } = req.body
  if (!url) {
    return res.status(400).send('url missing')
  }
  try {
    const response = await getAffiliateLink(url)
    res.status(200).json(response.data)
  } catch (e) {
    consoleError(e, { url })
    res.status(400).send(e)
  }
}

export default handler


const getAffiliateLink = (url: string) => axios.get<ISovrnGetLinkRes>(`${SOVRN_GET_LINK_URL}&out=${url}&key=${CONFIG.SOVRN_API_KEY}`)