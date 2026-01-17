import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth.types'
import apiClient from './client'

const CURRENT_USER_KEY = 'notebook_current_user'
const TOKEN_KEY = 'notebook_token'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // POST to /api/auth/login
    // Response will be { success: true, data: { user, token } }
    // Axios interceptor extracts the data field, so we receive { user, token } directly
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials)
    
    // Store user and token in localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.data.user))
    localStorage.setItem(TOKEN_KEY, response.data.token)

    return response.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // POST to /api/auth/register
    // Response will be { success: true, data: { user, token } }
    // Axios interceptor extracts the data field, so we receive { user, token } directly
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data)
    
    // Store user and token in localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.data.user))
    localStorage.setItem(TOKEN_KEY, response.data.token)

    return response.data
  },

  async logout(): Promise<void> {
    // Clear token and user from localStorage
    // Optionally, could call POST /api/auth/logout if backend supports it
    localStorage.removeItem(CURRENT_USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }
}
