import express from 'express'
import cookieParser from 'cookie-parser'
import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"

const app = express()
const PORT = 8000

Sentry.init({
  dsn: "https://541922fc2168442d82331d0f53b2e845@o1141983.ingest.sentry.io/6339946",
  environment: process.env.NODE_ENV,
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

app.use(cookieParser())
app.use(express.json())

import cors from 'cors'
app.use(cors())

app.get('/', (req, res) => {
  console.error('test')
  res.send('ok')
})

app.get('/health', (req, res) => {
  res.send('ok')
})

const router = express.Router()

import proxy from './routes/proxyUrl'
router.post('/proxy-url', proxy)

import openGraph from './routes/openGraph'
router.post('/open-graph', openGraph)

import convertGuestToUser from './routes/convertGuestToUser'
router.post('/convert-guest-to-user', convertGuestToUser)

import trackEvent from './routes/trackEvent'

var corsOptions = {
  origin: 'https://web.medleyapp.co',
  credentials: true
};

router.post('/track-event', cors(corsOptions), trackEvent)

app.use('/api/v2', router)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

import { initCrons } from './crons'
initCrons()

app.listen(PORT, () => {
  console.log(`Server is running running on ${PORT}`)
})