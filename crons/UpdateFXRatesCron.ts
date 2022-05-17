

import { supabase } from '../services/supabase'
import { Currency, currencies, SupabaseTables } from '../types/supabase-types'
import ExchangeRatesAPI, { IExchangeRatesAPILatestResponse } from '../services/ExchangeRatesApi'

export default class UpdateFXRatesCron  {
  currencies: Currency[]
  
  constructor() {
    this.currencies = currencies
  }

  async run() {
    this.currencies.map(async currency => {
      const res = await ExchangeRatesAPI.getLatest(currency, currencies)
      UpdateFXRatesCron.updateFXRates(res.data)
    })
  }

 static async updateFXRates(data: IExchangeRatesAPILatestResponse) {
    return await supabase.from(SupabaseTables.FX_RATES).upsert({
      from_currency: data.base,
      to_currency: data.rates
    })
  }
}




