import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's not already a login request
    if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/login')) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  refreshToken: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
}

// Movie APIs
export const movieAPI = {
  searchMovies: (params) => api.get('/api/movies', { params }),
  getMovieById: (id) => api.get(`/api/movies/${id}`),
  getStats: () => api.get('/api/stats'),
}

// Admin APIs
export const adminAPI = {
  updateMovie: (id, data) => api.put(`/api/admin/movies/${id}`, data),
  deleteMovie: async (id) => {
    console.log('AdminAPI deleteMovie called with ID:', id)
    console.log('Current token:', useAuthStore.getState().token)
    try {
      const response = await api.delete(`/api/admin/movies/${id}`)
      console.log('AdminAPI deleteMovie response:', response)
      return response
    } catch (error) {
      console.error('AdminAPI deleteMovie error:', error)
      throw error
    }
  },
}

export default api

