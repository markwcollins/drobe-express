import { createSupabaseApi } from 'services/supabase'
import { IWebPage, SupabaseTables } from 'types'
import fastq from 'fastq'
import type { queueAsPromised } from 'fastq'
import { SupabaseClient } from '@supabase/supabase-js'
import WebPage from 'services/WebPage'

interface IUpdateWebPagesProps {
  supabase: SupabaseClient
  from: number
  to: number
}

export const initUpdateWebPagesCron = async () => {
  const increment = 100
  const supabase = createSupabaseApi()
  const { count } = await supabase.from<IWebPage>(SupabaseTables.WEB_PAGES).select('*', { count: 'exact', head: true })
  if (!count) return
  for (let from = 0; from <= count; from += increment) {
    updateWebPagesQueue.push({ supabase, from, to: from + increment })
  }
}

const updateWebPages = async ({ supabase, from, to }: IUpdateWebPagesProps) => {
  const { data, error } = await supabase.from<IWebPage>(SupabaseTables.WEB_PAGES).select().range(from, to)
  if (!data || error) return
  data.map(async webPageSupabase => {
    const webPage = new WebPage(webPageSupabase.id, webPageSupabase)
    await webPage.extractOpenGraphData()
    await webPage.update(webPage.openGraphData)
  })
}

const updateWebPagesQueue: queueAsPromised<IUpdateWebPagesProps> = fastq.promise(updateWebPages, 10)
