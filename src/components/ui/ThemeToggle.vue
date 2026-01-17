<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import Button from './Button.vue'

// Use useDark with localStorage persistence, default to dark
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  initialValue: 'dark', // Default to dark mode
})

const toggleDark = useToggle(isDark)
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleDark()"
    class="relative h-9 w-9"
    aria-label="Toggle theme"
  >
    <Icon
      icon="radix-icons:moon"
      class="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Icon
      icon="radix-icons:sun"
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
