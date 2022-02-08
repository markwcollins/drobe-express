import { ApiHandlerWithSupabaseJwt, validateSupabaseJwt } from '../middleware/validateSupabaseJwt'
import { User, Session } from '@supabase/supabase-js'
import { AUTH_TYPE, SupabaseTables } from '../types'
import { supabase } from '../services/supabase'

const handler: ApiHandlerWithSupabaseJwt = async (req, res, { user: oldUser, accessToken: oldAccessToken }) => {
  const { email, password } = req.body
  if (!email) {
    console.error('Email missing')
    return res.status(400).send('Email missing')
  }
  if (!password) {
    console.error('Password missing')
    return res.status(400).send('Password missing')
  }

  const { data, error: getNewUserError } = await supabase.auth.api.signUpWithEmail(
    email,
    password,
    { data: { user: AUTH_TYPE.USER, profile_id: oldUser.user_metadata.profile_id }}
    // `profile_id` is needed to link resources back to the user for reporting
    // resources all have `user_id` but this links to the `auth.users` table, which can't be linked to other tables `boards`
    // by keeping the `profile_id` with the user we can add both the `user_id` and `profile_id` to tables so we can 
    // use the `user_id` for row based permmissions and querying and the `profile_id` for other tacking
  )
  if (getNewUserError || !data) {
    console.error(getNewUserError)
    return res.status(400).send(getNewUserError)
  }

  const oldUserId = oldUser.id
  const newUserId = (<Session>data)?.user?.id || (<User>data)?.id

  const responses = await Promise.allSettled([

    // the profile is updated to the new user_id and email also updated
    supabase.from(SupabaseTables.PROFILES).update({ user_id: newUserId, email, user_type: AUTH_TYPE.USER }).eq('user_id', oldUserId),

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
    console.error(responses)
  }

  res.status(200).end()
}

export default validateSupabaseJwt(handler) 