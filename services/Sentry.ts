import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import CONFIG from '../config'
import { Express } from 'express'

export default class ExpressSentry {
  Sentry = Sentry
  isEnabled = true
  app: Express|undefined

  constructor(app: Express) {
    if (!this.isEnabled) return
    this.app = app
    this.init()
  }

  init() {
    if (!this.app) return
    this.Sentry.init({
      dsn: 'https://541922fc2168442d82331d0f53b2e845@o1141983.ingest.sentry.io/6339946',
      environment: CONFIG.NODE_ENV,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app: this.app }),
      ],
    
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  
    // The request handler must be the first middleware on the app
    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    this.app.use(Sentry.Handlers.requestHandler())
    // TracingHandler creates a trace for every incoming request
    this.app.use(Sentry.Handlers.tracingHandler())
  }

  loadErrorHandler() {
    if (!this.app) return
    this.app.use(this.Sentry.Handlers.errorHandler())
  }
}

