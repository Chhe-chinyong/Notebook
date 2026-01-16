<script setup lang="ts">
import type { Note } from '@/services/types/note.types'
import { formatDate } from '@/utils/date.utils'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
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
  <Card v-if="note" class="w-full">
    <CardHeader>
      <div class="flex items-start justify-between">
        <CardTitle class="flex-1">{{ note.title }}</CardTitle>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="handleEdit">
            Edit
          </Button>
          <Button variant="destructive" size="sm" @click="handleDelete">
            Delete
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="note.content" class="prose max-w-none">
        <p class="whitespace-pre-wrap">{{ note.content }}</p>
      </div>
      <div v-else class="text-muted-foreground italic">
        No content
      </div>
      
      <div class="flex flex-wrap gap-2 pt-4 border-t">
        <Badge variant="outline">
          Created: {{ formatDate(note.createdAt) }}
        </Badge>
        <Badge v-if="note.updatedAt !== note.createdAt" variant="outline">
          Updated: {{ formatDate(note.updatedAt) }}
        </Badge>
      </div>
    </CardContent>
  </Card>
  
  <Card v-else class="w-full">
    <CardContent class="p-6 text-center text-muted-foreground">
      Select a note to view details
    </CardContent>
  </Card>
</template>
