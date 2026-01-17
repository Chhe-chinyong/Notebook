<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

// Get user initials for avatar fallback
function getUserInitials(name: string | undefined): string {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold">Notebook App</h1>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {{ getUserInitials(authStore.user?.name) }}
              </AvatarFallback>
            </Avatar>
          </div>
          <Button variant="outline" size="sm" @click="handleLogout">
            Logout
          </Button>
        </div>
      </div>
    </header>
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
