import axios from 'axios'
import { Currency } from '../types/supabase-types'

export default class ExchangeRatesAPI {
  static apiKey = 'bg7DpspGjhzFaIOV7KZlglNPZjuvdEQ3'
  static apiLayerBaseUrl = 'https://api.apilayer.com/exchangerates_data'

  static createGetLatestUrl(base: Currency, symbols: Currency[]) {
    const _symbols = symbols.join(',')
    return `${ExchangeRatesAPI.apiLayerBaseUrl}/latest?symbols=${_symbols},AUD&base=${base}`
  }

  static async getLatest(base: Currency, symbols: Currency[]) {
    const url = ExchangeRatesAPI.createGetLatestUrl(base, symbols)
    return await axios.get<IExchangeRatesAPILatestResponse>(url, {
      headers: {
        'apiKey': ExchangeRatesAPI.apiKey
      }
    })
  }
}

export interface IExchangeRatesAPILatestResponse {
	success: boolean,
	timestamp: number,
	base: Currency,
	date: string,
  rates: {
    [key: Currency]: number
  }
}
