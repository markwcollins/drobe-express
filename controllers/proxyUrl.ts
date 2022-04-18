import { Request, Response } from 'express'
import axios from 'axios'

/*
  body: {
    url: string
  }
*/

const handler = async (req: Request, res: Response) => {
  const { url } = req.body
  if (!url) {
    return res.status(400).send('url missing')
  }
  try {
    const response = await axios({
      method: 'get',
      url,
      responseType: 'stream'
    })
    response.data.pipe(res)
  } catch (e) {
    res.status(400).send(e)
  }
}

export default handler