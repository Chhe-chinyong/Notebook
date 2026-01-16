<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue: boolean
  title?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function close() {
  isOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="close"
      >
        <div class="fixed inset-0 bg-black/50" />
        <div
          class="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg"
          @click.stop
        >
          <div v-if="title || $slots.header" class="mb-4">
            <h2 v-if="title" class="text-lg font-semibold">{{ title }}</h2>
            <slot name="header" />
          </div>
          <slot />
          <div v-if="$slots.footer" class="mt-4 flex justify-end gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
