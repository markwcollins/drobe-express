import { Request, Response, NextFunction } from 'express'
import { getUser } from '../services/supabase'

const validateSupabaseJwt =  async (req: Request, res: Response, next: NextFunction) => {
  const jwt = req.get('X-Supabase-Auth')
    
  if (!jwt) {
    return res.status(400).send('Supabase user token missing')
  }

  try {
    const { user, error } = await getUser(jwt) // getting the user validates the JWT
    if (!user || error) {
      throw new Error(error?.message)
    }
    req.user = user
    req.accessToken = jwt
    next()
  } catch (error) {
    res.status(400).send(error)
  }
}

export default validateSupabaseJwt