import express from 'express'

const app = express()
const PORT = 8000

app.get('/', (req, res) => res.send('Test'))

import checkPrices from './routes/webpages/check-prices'
app.get('/webpages/check-prices', checkPrices)


import { initUpdateWebPagesCron } from './crons/updateWebPages'
import cron from 'node-cron'

cron.schedule('* * * * *', () => {
  initUpdateWebPagesCron()
})

app.listen(PORT, () => {
  console.log('Server is running')
});