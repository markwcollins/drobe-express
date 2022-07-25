import express from 'express'
import cookieParser from 'cookie-parser'
import { User } from '@supabase/supabase-js'
import ExpressSentry from './services/Sentry'
import index from './routes'
import userRoutes from './routes/user'

const app = express()
const PORT = 8000

declare global{
  namespace Express {
      interface Request {
          user?: User
          accessToken: string
      }
  }
}

const sentry = new ExpressSentry(app)

app.use(cookieParser())
app.use(express.json({limit: '50mb'}));
app.set('trust proxy', true)

import cors from 'cors'
app.use(cors())

app.get('/', (req, res) => {
  res.send('ok')
})

app.get('/health', (req, res) => {
  res.send('ok')

})

app.use('/api/v2', index)
app.use('/api/v2/user', userRoutes)

// The error handler must be before any other error middleware and after all controllers
sentry.loadErrorHandler()

import { initCrons } from './crons'
initCrons()

app.listen(PORT, () => {
  console.log(`Server is running running on ${PORT}`)
})
