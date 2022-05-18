

import { Currency, currencies } from '../types/supabase-types'
import ExchangeRatesAPI from '../services/ExchangeRatesApi'
import FXRate from '../services/FXRate'

export default class UpdateFXRatesCron  {
  currencies: Currency[]
  
  constructor() {
    this.currencies = currencies
  }

  async run() {
    this.currencies.map(async from_currency => {
      const res = await ExchangeRatesAPI.getLatest(from_currency, currencies)
      FXRate.upsert(from_currency, {
        to_currencies: res.data.rates, 
        updated_at: res.data.date
      })
    })
  }
}




