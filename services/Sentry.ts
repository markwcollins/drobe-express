import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import CONFIG from '../config'
import { Express } from 'express'

export const initSentry = (app: Express) => {
  Sentry.init({
    dsn: 'https://541922fc2168442d82331d0f53b2e845@o1141983.ingest.sentry.io/6339946',
    environment: CONFIG.ENV,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // The request handler must be the first middleware on the app
  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler())
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler())

  return Sentry
}


