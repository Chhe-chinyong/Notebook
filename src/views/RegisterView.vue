<script setup lang="ts">
import RegisterForm from '@/components/auth/RegisterForm.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-background relative">
    <!-- Theme Toggle in top right corner -->
    <div class="absolute top-4 right-4">
      <ThemeToggle />
    </div>
    
    <RegisterForm />
  </div>
</template>
