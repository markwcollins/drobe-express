import { Request, Response, NextFunction } from 'express'
import { User, Session } from '@supabase/supabase-js'
import { USER_TYPE, SupabaseTables } from '../types/supabase-types'
import { supabase } from '../services/supabase'
import { consoleError } from '../services/ErrorHandling'

/*
  body: {
    email: string,
    password: string,
  }
*/

const handler = async (req: Request, res: Response) => {

  const oldUser = req.user
  if (!oldUser) {
    return res.status(400).send('User misssing missing')
  }
  const oldAccessToken = req.accessToken

  const { email, password } = req.body
  if (!email) {
    return res.status(400).send('Email missing')
  }
  if (!password) {
    return res.status(400).send('Password missing')
  }

  const { data, error: getNewUserError } = await supabase.auth.api.signUpWithEmail(
    email,
    password,
    { data: { user: USER_TYPE.USER, profile_id: oldUser.user_metadata.profile_id }}
    // `profile_id` is needed to link resources back to the user for reporting
    // resources all have `user_id` but this links to the `auth.users` table, which can't be linked to other tables `boards`
    // by keeping the `profile_id` with the user we can add both the `user_id` and `profile_id` to tables so we can 
    // use the `user_id` for row based permmissions and querying and the `profile_id` for other tacking
  )
  if (getNewUserError || !data) {
    consoleError(getNewUserError)
    return res.status(400).send(getNewUserError)
  }

  const oldUserId = oldUser.id
  const newUserId = (<Session>data)?.user?.id || (<User>data)?.id

  const responses = await Promise.allSettled([

    // the profile is updated to the new user_id and email also updated
    supabase.from(SupabaseTables.PROFILES).update({ user_id: newUserId, email, user_type: USER_TYPE.USER }).eq('user_id', oldUserId),

    // other resources only need the new user_id
    ...[ 
      SupabaseTables.WEB_PAGES, 
      SupabaseTables.PRODUCTS,
      SupabaseTables.BOARDS,
      SupabaseTables.BOARD_ITEMS 
    ].map(table => supabase.from(table).update({ user_id: newUserId }).eq('user_id', oldUserId)),

    // update the owner of the files using stored procedure
    //@TODO -- all of the above logic could be put in stored procedure so there is only one call
    supabase.rpc('change_storage_object_owner', { old_owner: oldUserId, new_owner: newUserId }),

    // old guest user is updated with the new user_ud for tracking purposes only
    supabase.auth.api.updateUser(oldAccessToken, { data: { registered_user: newUserId }})
  ])

  const errors = responses.some(promise => promise.status === 'rejected')
  if (errors) {
    consoleError(responses)
  }

  res.status(200).end()
}

export default handler