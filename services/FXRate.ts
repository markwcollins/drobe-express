import { supabase } from './supabase'
import { SupabaseTables, IFXRate, ICreateFXRate, currencies } from '../types/supabase-types'

export default class FXRate {
  static populateQuery = `*`
  static api = supabase.from<IFXRate>(SupabaseTables.FX_RATES)

  constructor() {

  }

  static isValidCurrency(currency: string) {
    return currencies.includes(currency)
  }

  static async get(currency: string) {
    if (!FXRate.isValidCurrency(currency)) {
      throw new Error('from currency not valid')
    }
    const { data, error } = await FXRate.api.select().eq('from_currency', currency)
    return data?.[0]
  }

  static async upsert(currency: string, _data: Partial<FXRate>) {
    const { data, error } = await FXRate.api.upsert({
      from_currency: currency,
      ..._data
    })
  } 

  static async conversionRate({ from_currency, to_currency }: { from_currency?: string, to_currency: string }) {
    if (!FXRate.isValidCurrency(to_currency)) {
      throw new Error('to currency not valid')
    }
    if (!from_currency) return 
    const fxRate = await FXRate.get(from_currency)
    return fxRate?.to_currencies?.[to_currency]
  }

  static async convert({ amount, from_currency, to_currency }: { amount: string, from_currency?: string, to_currency: string }) {
    const conversionRate = await FXRate.conversionRate({ from_currency, to_currency })
    if (conversionRate) {
      return (conversionRate * parseFloat(amount)).toFixed(2)
    }
    return undefined
  }
}
