import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = 8000

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
router.post('/track-event', trackEvent)

app.use('/api/v2', router)

import { initCrons } from './crons'
initCrons()

app.listen(PORT, () => {
  console.log(`Server is running running on ${PORT}`)
})