import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// Extended config to track token refresh retries
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage')
  if (raw) {
    try {
      const state = JSON.parse(raw)
      const token = state?.state?.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Corrupted storage — leave header empty
    }
  }
  return config
})

// On 401, attempt a single token refresh then retry the original request
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined
    if (!config || config._retry || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    config._retry = true

    try {
      const raw = localStorage.getItem('auth-storage')
      if (!raw) throw new Error('No refresh token')

      const state = JSON.parse(raw)
      const refreshToken: string | undefined = state?.state?.refreshToken
      if (!refreshToken) throw new Error('No refresh token')

      // Call refresh endpoint directly to avoid re-entering the interceptor
      const { data } = await axios.post<{ access: string }>(
        '/api/v1/accounts/token/refresh/',
        { refresh: refreshToken }
      )

      // Update stored access token
      state.state.accessToken = data.access
      localStorage.setItem('auth-storage', JSON.stringify(state))

      config.headers.Authorization = `Bearer ${data.access}`
      return apiClient(config)
    } catch {
      // Refresh failed — clear auth state and redirect to login
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
      return Promise.reject(error)
    }
  }
)

export default apiClient
