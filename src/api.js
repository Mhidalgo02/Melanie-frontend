import axios from 'axios'

// The API address comes from .env (VITE_API_URL). Never hard-code localhost here.
const API_URL = import.meta.env.VITE_API_URL

const http = axios.create({ baseURL: API_URL })

// ---- token storage (browser localStorage) ----
export const auth = {
  get access() { return localStorage.getItem('access_token') },
  get refresh() { return localStorage.getItem('refresh_token') },
  get username() { return localStorage.getItem('username') },
  save(tokens, username) {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    if (username) localStorage.setItem('username', username)
  },
  clear() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
  },
}

// App.jsx sets this so we can log the user out when the session fully expires
let onSessionExpired = () => {}
export const setSessionExpiredHandler = (fn) => { onSessionExpired = fn }

// Attach the token to every request
http.interceptors.request.use((config) => {
  if (auth.access) config.headers.Authorization = `Bearer ${auth.access}`
  return config
})

// If the access token expired (401), try once to get a new one with the refresh token
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const isAuthCall = original?.url?.includes('/api/login') || original?.url?.includes('/api/refresh')

    if (error.response?.status === 401 && !original._retry && !isAuthCall && auth.refresh) {
      original._retry = true
      try {
        const res = await axios.post(`${API_URL}/api/refresh`, { refresh_token: auth.refresh })
        auth.save(res.data.tokens)
        original.headers.Authorization = `Bearer ${auth.access}`
        return http(original)
      } catch {
        auth.clear()
        onSessionExpired()
      }
    }
    return Promise.reject(error)
  }
)

// Turn any error into a readable message
export function errorMessage(err) {
  if (!err.response) return 'Cannot reach the server. Check your internet or the API URL.'
  const data = err.response.data
  if (data?.errors) return Object.values(data.errors).join(' ')
  return data?.error || `Request failed (${err.response.status}).`
}

// ---- API calls ----
export async function login(username, password) {
  const res = await http.post('/api/login', { username, password })
  auth.save(res.data.tokens, res.data.user.username)
  return res.data
}

export async function logout() {
  try {
    await http.post('/api/logout', { refresh_token: auth.refresh })
  } finally {
    auth.clear()
  }
}

export const getProducts = async () => (await http.get('/api/products')).data.data
export const createProduct = async (p) => (await http.post('/api/products', p)).data
export const updateProduct = async (id, p) => (await http.put(`/api/products/${id}`, p)).data
export const deleteProduct = async (id) => (await http.delete(`/api/products/${id}`)).data
