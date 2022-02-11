import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = 8000

app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('ok')
})

const router = express.Router()

router.get('/health', (req, res) => {
  res.send('ok')
})

import openGraph from './routes/openGraph'
router.post('/open-graph', openGraph)

import convertGuestToUser from './routes/convertGuestToUser'
router.post('/convert-guest-to-user', convertGuestToUser)

app.use('/v2', router)

import UpdateWebPagesCron from './crons/UpdateWebPagesCron'
import schedule from 'node-schedule'

const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, 1, 2, 4, 4, 5, 6] // every 2nd day
rule.hour = 20 // utc time
rule.minute = 45

schedule.scheduleJob(rule, function() {
  console.log('starting crons')
  const updateWebPagesCron = new UpdateWebPagesCron()
  updateWebPagesCron.init()
})

app.listen(PORT, () => {
  console.log(`Server is running running on ${PORT}`)
})