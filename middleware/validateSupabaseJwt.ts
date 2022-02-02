import { Request, Response } from 'express'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { createSupabaseApi, getUser } from 'services/supabase'

export type ApiHandlerWithSupabaseJwt = (req:Request, res:Response, supabase:SupabaseClient, user:User) => any

export const validateSupabaseJwt = (handler:ApiHandlerWithSupabaseJwt) => async (req:Request, res:Response) => {
  const jwt = req.cookies['X-Supabase-Auth']
  if (!jwt) {
    return res.status(400).send('Supabase user token missing')
  }

  const supabase = createSupabaseApi()

  const { user, error } = await getUser(jwt, supabase) // getting the user validates the JWT
  if (!user || error) {
    return res.status(400).send('User not found')
  }

  return handler(req, res, supabase, user)
}
