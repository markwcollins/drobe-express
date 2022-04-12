import axios from 'axios'
import CONFIG from '../config'

const KLAVYIVO_API_KEY = CONFIG.KLAVYIVO_API_KEY

interface IaddUserToKlaviyoList { 
  email: string, 
  listID?: string, 
}

// Rmi6sC is all list in Klavyivo
export const addUserToKlaviyoList = async ({ email, listID = 'Rmi6sC' }: IaddUserToKlaviyoList) => {
  const url = `https://a.klaviyo.com/api/v2/list/${listID}/subscribe?api_key=${KLAVYIVO_API_KEY}`
  return axios.post(url, 
    {
      profiles: [ 
        { email } 
      ]
    },
    {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    }
  )
}
