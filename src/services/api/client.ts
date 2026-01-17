import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { ApiSuccessResponse, ApiErrorResponse } from '../types/api.types'
import { ApiError as ApiErrorClass } from '../types/api.types'
import router from '@/router'

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5266'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('notebook_token')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle standardized response format
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiSuccessResponse<any> | ApiErrorResponse>) => {
    const data = response.data
    
    // Check if response has success field (standardized format)
    if (typeof data === 'object' && 'success' in data) {
      if (data.success === true) {
        // Success response - return the data field
        return {
          ...response,
          data: (data as ApiSuccessResponse<any>).data
        }
      } else {
        // Error response in success format - throw error
        const errorResponse = data as ApiErrorResponse
        const apiError = new ApiErrorClass(
          errorResponse.error.code,
          errorResponse.error.message,
          errorResponse.error.details,
          response.status
        )
        return Promise.reject(apiError)
      }
    }
    
    // Fallback: if response doesn't have success field, return as-is
    return response
  },
  (error) => {
    // Handle axios errors (network errors, timeouts, etc.)
    if (error.response) {
      // Server responded with error status
      const response = error.response
      const data = response.data
      
      // Check if it's a standardized error response
      if (data && typeof data === 'object' && 'success' in data && data.success === false) {
        const errorResponse = data as ApiErrorResponse
        const apiError = new ApiErrorClass(
          errorResponse.error.code,
          errorResponse.error.message,
          errorResponse.error.details,
          response.status
        )
        
        // Handle 401 Unauthorized - clear auth and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('notebook_token')
          localStorage.removeItem('notebook_current_user')
          router.push({ name: 'login' })
        }
        
        return Promise.reject(apiError)
      }
      
      // Non-standardized error response - create generic error
      const apiError = new ApiErrorClass(
        'HTTP_ERROR',
        data?.message || error.message || 'An error occurred',
        data,
        response.status
      )
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('notebook_token')
        localStorage.removeItem('notebook_current_user')
        router.push({ name: 'login' })
      }
      
      return Promise.reject(apiError)
    } else if (error.request) {
      // Request was made but no response received (network error)
      const apiError = new ApiErrorClass(
        'NETWORK_ERROR',
        'Network error. Please check your connection.',
        null,
        undefined
      )
      return Promise.reject(apiError)
    } else {
      // Something else happened
      const apiError = new ApiErrorClass(
        'UNKNOWN_ERROR',
        error.message || 'An unexpected error occurred',
        null,
        undefined
      )
      return Promise.reject(apiError)
    }
  }
)

export default apiClient
