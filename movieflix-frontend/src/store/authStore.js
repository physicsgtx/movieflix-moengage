import { create } from 'zustand'

// Get initial state from localStorage
const getInitialState = () => {
  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        token: parsed.token || null,
        user: parsed.user || null
      }
    }
  } catch (error) {
    console.error('Error loading auth state:', error)
  }
  return { token: null, user: null }
}

export const useAuthStore = create((set) => ({
  ...getInitialState(),
  
  setAuth: (token, user) => {
    localStorage.setItem('auth-storage', JSON.stringify({ token, user }))
    set({ token, user })
  },
  
  logout: () => {
    localStorage.removeItem('auth-storage')
    set({ token: null, user: null })
  },
  
  isAuthenticated: () => {
    const state = useAuthStore.getState()
    return !!state.token
  }
}))

