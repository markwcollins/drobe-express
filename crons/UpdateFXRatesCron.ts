

import { Currency, currencies } from '../types/global-types'
import ExchangeRatesAPI from '../services/ExchangeRatesApi'
import FXRate from '../services/FXRate'
import { consoleError } from '../services/ErrorHandling'

export default class UpdateFXRatesCron  {
  currencies: Currency[]
  
  constructor() {
    this.currencies = currencies
  }

  async run() {
    this.currencies.map(async from_currency => {
      try {
        const res = await ExchangeRatesAPI.getLatest(from_currency, currencies)
        await FXRate.upsert(from_currency, {
          to_currencies: res.data.rates, 
          updated_at: res.data.date
        })
      } catch(e) {
        consoleError(e)  
      }
    })
  }
}




