import cyrpto from 'crypto'
import CONFIG from '../config'
import { EVENT_NAME, ACTION_SOURCE } from '../types'

const FACEBOOK_ACCESS_TOKEN = CONFIG.FACEBOOK_ACCESS_TOKEN
const FACEBOOK_PIXEL_ID = CONFIG.FACEBOOK_PIXEL_ID

const facebookSdk = require('facebook-nodejs-business-sdk');
const api = facebookSdk.FacebookAdsApi.init(FACEBOOK_ACCESS_TOKEN)
// api.setDebug(true)

interface IcreateFacebookConversionApiEvent { 
  email: string
  eventName: EVENT_NAME
  actionSource: ACTION_SOURCE
  eventSourceUrl?: string
  ipAddress: string
  userAgent?: string
}

export const createFacebookConversionEvent = ({ email, eventName, actionSource, eventSourceUrl, ipAddress, userAgent }: IcreateFacebookConversionApiEvent) => {
  const ServerEvent = facebookSdk.ServerEvent
  const EventRequest = facebookSdk.EventRequest
  const UserData = facebookSdk.UserData
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const hashedEmail = cyrpto.createHmac('sha256', FACEBOOK_ACCESS_TOKEN).update(email).digest('hex')

  const userData = (new UserData())
    .setEmails([ hashedEmail ])
    .setClientIpAddress(ipAddress)
    .setClientUserAgent(userAgent)
      
  const serverEvent = (new ServerEvent())
    .setEventName(eventName)
    .setEventTime(currentTimestamp)
    // .setCu custom_event_type
    .setUserData(userData)
    .setEventSourceUrl(eventSourceUrl)
    .setActionSource(actionSource)

  const eventsData = [ serverEvent ]
  const eventRequest = (new EventRequest(FACEBOOK_ACCESS_TOKEN, FACEBOOK_PIXEL_ID)).setEvents(eventsData)
  eventRequest.execute().then(
    (response: any) => {
      // console.log('Response: ', response);
    },
    (err: any) => {
      // console.error('Error: ', err);
    }
  );
}
