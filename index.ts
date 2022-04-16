import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = 8000

import { initSentry } from './services/Sentry'

const sentry = initSentry(app)

app.use(cookieParser())
app.use(express.json())

import cors from 'cors'
app.use(cors())

app.get('/', (req, res) => {
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
app.use(sentry.Handlers.errorHandler());

import { initCrons } from './crons'
import { consoleError } from './services/ErrorHandling'
initCrons()

app.listen(PORT, () => {
  console.log(`Server is running running on ${PORT}`)
})