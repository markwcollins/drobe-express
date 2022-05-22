import express from 'express'
import cors from 'cors'
import proxyUrl from '../controllers/proxyUrl'
import WebsiteDataExtractor from '../controllers/websiteData'
import convertGuestToUser from '../controllers/convertGuestToUser'
import trackEvent from '../controllers/trackEvent'
import validateSupabaseJwt from '../middleware/validateSupabaseJwt'

const router = express.Router()

const corsOptions = {
  origin: 'https://web.medleyapp.co',
  credentials: true
}

router.post('/proxy-url', proxyUrl)
router.post('/website-data', validateSupabaseJwt, WebsiteDataExtractor)
router.post('/convert-guest-to-user', validateSupabaseJwt, convertGuestToUser)
router.post('/track-event', [cors(corsOptions), validateSupabaseJwt], trackEvent)

export default router