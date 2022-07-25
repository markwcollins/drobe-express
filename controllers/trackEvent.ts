import { Request, Response } from 'express'
import { createFacebookConversionEvent } from '../services/FacebookEvent'
import { EVENT_NAME, ACTION_SOURCE, EventsForAPI } from '../types'

/*
  body: {
    eventName: EventName,
    actionSource: ActionSource,
    eventSourceUrl?: string
  }
*/

const handler = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email
    if (!email) {
      throw new Error('error retrieving user email')
    }
  
    const eventName = req.body?.eventName as EVENT_NAME
    if (!eventName) {
      throw new Error('eventName missing')
    }
  
    if (!EventsForAPI.includes(eventName)) {
      throw new Error('unknown eventName')
    }
  
    const actionSource = req.body?.actionSource as ACTION_SOURCE
    if (!actionSource) {
      throw new Error('actionSource missing')
    }
    if (!Object.values(ACTION_SOURCE).includes(actionSource)) {
      throw new Error('unknown actionSource')
    }
  
    const eventSourceUrl: string|undefined = req.body?.eventSourceUrl
    const userAgent = req.headers['user-agent']
    const ipAddress = req.ip || req.ips[0]

    createFacebookConversionEvent({ eventName, email, actionSource, userAgent, ipAddress, eventSourceUrl })

    res.status(200).end()
  } catch (e) {
    // consoleError(e, req)
    res.status(400).send(e)
  }
}

export default handler

