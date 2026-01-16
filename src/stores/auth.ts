import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/services/types/auth.types'
import { authService } from '@/services/api/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(authService.getCurrentUser())
  const token = ref<string | null>(authService.getToken())

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  async function login(credentials: LoginRequest) {
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      token.value = response.token
      return response
    } catch (error) {
      throw error
    }
  }

  async function register(data: RegisterRequest) {
    try {
      const response = await authService.register(data)
      user.value = response.user
      token.value = response.token
      return response
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    await authService.logout()
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
})
