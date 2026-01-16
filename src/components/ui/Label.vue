<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  for?: string
  class?: string
  required?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <label
    :for="for"
    :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class)"
  >
    <slot />
    <span v-if="required" class="text-destructive ml-1">*</span>
  </label>
</template>
