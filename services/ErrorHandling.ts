
import * as Sentry from '@sentry/node'
import CONFIG from '../config'

export const consoleError = (error: any, context?: any) => {
  if (!error) return
  if(CONFIG.NODE_ENV === 'development') {
     console.log(error, context)
   } else {
     Sentry.captureException(error, context)
   }
}