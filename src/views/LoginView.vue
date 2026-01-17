<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const router = useRouter()

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-background relative">
    <!-- Theme Toggle in top right corner -->
    <div class="absolute top-4 right-4">
      <ThemeToggle />
    </div>
    
    <div class="w-full max-w-md space-y-8 text-center">
      <!-- Icon -->
      <div class="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>

      <!-- Welcome Header -->
      <h1 class="text-3xl font-bold text-foreground">Welcome to Note taking APP</h1>
      
      <!-- Register Link -->
      <div>
        <span class="text-muted-foreground">Don't have an account? </span>
        <button
          type="button"
          @click="goToRegister"
          class="text-primary hover:underline font-medium"
        >
          Register
        </button>
      </div>

      <!-- Login Form -->
      <LoginForm />
    </div>
  </div>
</template>
