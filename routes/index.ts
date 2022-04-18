import express from 'express'
import cors from 'cors'
import proxyUrl from '../controllers/proxyUrl'
import openGraph from '../controllers/openGraph'
import convertGuestToUser from '../controllers/convertGuestToUser'
import trackEvent from '../controllers/trackEvent'
import validateSupabaseJwt from '../middleware/validateSupabaseJwt'

const router = express.Router()

const corsOptions = {
  origin: 'https://web.medleyapp.co',
  credentials: true
}

router.post('/proxy-url', proxyUrl)
router.post('/open-graph', validateSupabaseJwt, openGraph)
router.post('/convert-guest-to-user', validateSupabaseJwt, convertGuestToUser)
router.post('/track-event', [cors(corsOptions), validateSupabaseJwt], trackEvent)

export default router