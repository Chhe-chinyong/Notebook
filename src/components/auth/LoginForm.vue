<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    loading.value = false
    return
  }

  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    router.push('/notes')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div v-if="error" class="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
        {{ error }}
      </div>
      
      <div class="space-y-2 text-left">
        <Label for="email" class="text-foreground">Email</Label>
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="m@example.com"
          required
          :disabled="loading"
          class="w-full"
        />
      </div>

      <div class="space-y-2 text-left">
        <Label for="password" class="text-foreground">Password</Label>
        <Input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          required
          :disabled="loading"
          class="w-full"
        />
      </div>

      <Button 
        type="submit" 
        class="w-full bg-muted text-foreground hover:bg-muted/90 font-medium" 
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </Button>
    </form>
  </div>
</template>
