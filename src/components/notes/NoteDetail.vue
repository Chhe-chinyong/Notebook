<script setup lang="ts">
import type { Note } from '@/services/types/note.types'
import { formatDate } from '@/utils/date.utils'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

interface Props {
  note: Note | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [note: Note]
  delete: [note: Note]
  close: []
}>()

function handleEdit() {
  if (props.note) {
    emit('edit', props.note)
  }
}

function handleDelete() {
  if (props.note) {
    emit('delete', props.note)
  }
}
</script>

<template>
  <div v-if="note" class="w-full">
    <!-- Title -->
    <div class="mb-4 sm:mb-6">
      <h3 class="text-lg sm:text-xl font-semibold leading-tight">{{ note.title }}</h3>
    </div>
    
    <!-- Content -->
    <div class="mb-4 sm:mb-6">
      <div v-if="note.content" class="prose max-w-none">
        <p class="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-foreground">{{ note.content }}</p>
      </div>
      <div v-else class="text-muted-foreground italic text-sm sm:text-base">
        No content
      </div>
    </div>
    
    <!-- Metadata badges -->
    <div class="flex flex-wrap gap-2 mb-4 sm:mb-6 pt-4 border-t">
      <Badge variant="outline" class="text-xs sm:text-sm">
        Created: {{ formatDate(note.createdAt) }}
      </Badge>
      <Badge v-if="note.updatedAt !== note.createdAt" variant="outline" class="text-xs sm:text-sm">
        Updated: {{ formatDate(note.updatedAt) }}
      </Badge>
    </div>
    
    <!-- Action buttons -->
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
      <Button 
        variant="outline" 
        size="default" 
        class="flex-1 min-h-[44px] touch-manipulation" 
        @click="handleEdit"
      >
        Edit
      </Button>
      <Button 
        variant="destructive" 
        size="default" 
        class="flex-1 min-h-[44px] touch-manipulation" 
        @click="handleDelete"
      >
        Delete
      </Button>
    </div>
  </div>
</template>
