
import express from 'express'
import { Request, Response } from 'express'
import { supabase } from '../services/supabase'

const router = express.Router()

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email) {
    return res.status(400).send('Email missing')
  }
  if (!password) {
    return res.status(400).send('Password missing')
  }

  const { error, session } = await supabase.auth.signIn({ email, password})

  if (error) {
    return res.status(400).send(error)
  }

  res.status(200).send(session)
}

router.post('/sign-in', signIn)

export default router