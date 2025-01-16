import { CONFIG } from '../config'
import { Api } from '../services/api'

export const api = new Api({
  securityWorker: token => token ? { headers: { Authorization: `Bearer ${String(token)}` } } : {},
  baseUrl: `${CONFIG.API_HOST}`
})

api.setSecurityData(localStorage.getItem('authToken'))

