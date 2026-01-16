import type { AuthUser, LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth.types'

// Mock user storage (in-memory with localStorage backup)
const STORAGE_KEY = 'notebook_users'
const CURRENT_USER_KEY = 'notebook_current_user'
const TOKEN_KEY = 'notebook_token'

// Simple hash function for mock password storage
function hashPassword(password: string): string {
  return btoa(password).split('').reverse().join('')
}

function getUsers(): AuthUser[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

function saveUsers(users: AuthUser[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const users = getUsers()
    const user = users.find(u => u.email === credentials.email)
    
    if (!user || hashPassword(credentials.password) !== user.password) {
      throw new Error('Invalid email or password')
    }

    const { password, ...userWithoutPassword } = user
    const token = `mock_token_${user.id}_${Date.now()}`

    // Store current user and token
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    localStorage.setItem(TOKEN_KEY, token)

    return {
      user: userWithoutPassword,
      token
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const users = getUsers()
    
    // Check if user already exists
    if (users.some(u => u.email === data.email)) {
      throw new Error('User with this email already exists')
    }

    // Generate a numeric ID (using timestamp as base, but ensure it's a number)
    const newUser: AuthUser = {
      id: Date.now(),
      email: data.email,
      name: data.name,
      password: hashPassword(data.password)
    }

    users.push(newUser)
    saveUsers(users)

    const { password, ...userWithoutPassword } = newUser
    const token = `mock_token_${newUser.id}_${Date.now()}`

    // Store current user and token
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    localStorage.setItem(TOKEN_KEY, token)

    return {
      user: userWithoutPassword,
      token
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem(CURRENT_USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return null
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }
}
