import { IProductPopulated, SupabaseTables } from '../../types'
import { ApiHandlerWithSupabaseJwt, validateSupabaseJwt } from '../../middleware/validateSupabaseJwt'
import { supabase } from '../../services/supabase'
import WebPage from '../../services/WebPage'

const productsApi = () => supabase.from<IProductPopulated>(SupabaseTables.PRODUCTS)

const PRODUCTS_POPULATED_QUERY = `
  * , 
  webPage: web_page_id (
    *
  )
`

const handler: ApiHandlerWithSupabaseJwt = async (req, res, { user }) => {
  const { data: products, error: apiError} = await productsApi().select(PRODUCTS_POPULATED_QUERY).eq('user_id', user.id)
  if (!products || apiError) {
    throw new Error('Supabase query error ' + apiError?.message)
  }
  const responses = products.map(async product => {
    if (!product.webPage) {
      return Promise.resolve()
    }
    const webPage = new WebPage(product.webPage)
    return await webPage.updateOpenGraphData()
  })

  await Promise.allSettled(responses)
  res.status(200).json(true)
}

export default validateSupabaseJwt(handler)