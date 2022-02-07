import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = 8000

app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('ok')
})

import UpdateWebPagesCron from './crons/UpdateWebPagesCron'
import schedule from 'node-schedule'

const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, 2, 4, 6]
rule.hour = 0
rule.minute = 0

schedule.scheduleJob(rule, function() { // once a day at midnight utc time
  console.log('starting crons')
  const updateWebPagesCron = new UpdateWebPagesCron()
  updateWebPagesCron.init()
})

app.listen(PORT, () => {
  console.log('Server is running')
})