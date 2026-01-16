<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '@/services/types/note.types'
import { formatRelativeTime } from '@/utils/date.utils'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  note: Note
}

const props = defineProps<Props>()

const emit = defineEmits<{
  view: [note: Note]
  edit: [note: Note]
  delete: [note: Note]
}>()

const preview = computed(() => {
  if (!props.note.content) return 'No content'
  return props.note.content.length > 100
    ? props.note.content.substring(0, 100) + '...'
    : props.note.content
})
</script>

<template>
  <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="emit('view', note)">
    <CardContent class="p-4">
      <div class="space-y-3">
        <div>
          <h3 class="font-semibold text-lg mb-1">{{ note.title }}</h3>
          <p class="text-sm text-muted-foreground line-clamp-2">{{ preview }}</p>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="text-xs text-muted-foreground">
            {{ formatRelativeTime(note.createdAt) }}
          </span>
          
          <div class="flex gap-2" @click.stop>
            <Button
              variant="ghost"
              size="sm"
              @click="emit('edit', note)"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              @click="emit('delete', note)"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
