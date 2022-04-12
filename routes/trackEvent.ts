import { ApiHandlerWithSupabaseJwt, validateSupabaseJwt } from '../middleware/validateSupabaseJwt'
import { createFacebookConversionEvent } from '../services/FacebookEvent'
import { EVENT_NAME, ACTION_SOURCE, EventsForAPI } from '../types/events'
import { addUserToKlaviyoList } from '../services/Klaviyo'

/*
  body: {
    eventName: EventName,
    actionSource: ActionSource,
    eventSourceUrl?: string
  }
*/

const handler: ApiHandlerWithSupabaseJwt = async (req, res, { user }) => {
  const email = user.email
  if (!email) {
    return res.status(400).send('error retrieving user email')
  }

  const eventName = req.body?.eventName as EVENT_NAME
  if (!eventName) {
    return res.status(400).send('eventName missing')
  }

  if (!Object.values(EventsForAPI).includes(eventName)) {
    return res.status(400).send('unknown eventName')
  }

  const actionSource = req.body?.actionSource as ACTION_SOURCE
  if (!actionSource) {
    return res.status(400).send('actionSource missing')
  }
  if (!Object.values(ACTION_SOURCE).includes(actionSource)) {
    return res.status(400).send('unknown actionSource')
  }

  const eventSourceUrl: string|undefined = req.body?.eventSourceUrl
  const userAgent = req.headers['user-agent']

  try {
    if (eventName === EVENT_NAME.SignedUp) {
      addUserToKlaviyoList({ email })
    }

    createFacebookConversionEvent({ eventName, email, actionSource, userAgent, eventSourceUrl })

    res.status(200).end()
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export default validateSupabaseJwt(handler) 

