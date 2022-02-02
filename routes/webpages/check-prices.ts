import OpenGraph from 'services/OpenGraph'
import { IProductPopulated, IWebPage, SupabaseTables } from 'types'
import { ApiHandlerWithSupabaseJwt, validateSupabaseJwt } from 'middleware/validateSupabaseJwt'

const PRODUCTS_POPULATED_QUERY = `
  *, 
  webPage:web_page_id(*)
`

const handler: ApiHandlerWithSupabaseJwt = async (req, res, supabase, user) => {
  const { data, error: apiError} = await supabase.from<IProductPopulated>(SupabaseTables.PRODUCTS).select(PRODUCTS_POPULATED_QUERY).eq('user_id', user.id)
  if (!data || apiError) {
    throw new Error('Supabase query error ' + apiError?.message)
  }
    
  const responses = data.map(async item => {
    const url = item.webPage?.url
    if (!url) {
      return Promise.resolve()
    }
    const og = new OpenGraph(url)
    const websiteData = await og.init()
    return supabase.from<IWebPage>(SupabaseTables.WEB_PAGES).update({ ...websiteData }).eq('user_id', user.id)
  })

  await Promise.allSettled(responses)
  res.status(200).json(true)
}

export default validateSupabaseJwt(handler)