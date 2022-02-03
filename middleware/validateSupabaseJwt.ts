import { Request, Response } from 'express'
import { User } from '@supabase/supabase-js'
import { getUser } from '../services/supabase'

export type ApiHandlerWithSupabaseJwt = (req: Request, res: Response, data: { user: User }) => any

export const validateSupabaseJwt = (handler: ApiHandlerWithSupabaseJwt) => async (req: Request, res: Response) => {
  const jwt = req.cookies['X-Supabase-Auth']
  if (!jwt) {
    return res.status(400).send('Supabase user token missing')
  }

  const { user, error } = await getUser(jwt) // getting the user validates the JWT
  if (!user || error) {
    return res.status(400).send('User not found')
  }

  return handler(req, res, { user })
}
