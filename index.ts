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

// schedule.scheduleJob('* 1 * * *', function() { // once a day at midnight
//   console.log('starting crons')
//   const updateWebPagesCron = new UpdateWebPagesCron()
//   updateWebPagesCron.init()
// })

schedule.scheduleJob('* * * * *', function() { // once a day at midnight
  console.log('starting crons')
  const updateWebPagesCron = new UpdateWebPagesCron()
  updateWebPagesCron.init()
})

app.listen(PORT, () => {
  console.log('Server is running')
})