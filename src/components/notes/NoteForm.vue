<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Note, CreateNoteRequest } from '@/services/types/note.types'
import Dialog from '@/components/ui/Dialog.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Label from '@/components/ui/Label.vue'

interface Props {
  modelValue: boolean
  note?: Note | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: CreateNoteRequest]
}>()

const title = ref('')
const content = ref('')
const error = ref('')

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.note) {
      title.value = props.note.title
      content.value = props.note.content
    } else {
      title.value = ''
      content.value = ''
    }
    error.value = ''
  }
})

function handleSubmit() {
  error.value = ''

  if (!title.value.trim()) {
    error.value = 'Title is required'
    return
  }

  emit('submit', {
    title: title.value.trim(),
    content: content.value.trim()
  })

  emit('update:modelValue', false)
}

function handleCancel() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <template #header>
      <h2 class="text-lg font-semibold">{{ note ? 'Edit Note' : 'Create Note' }}</h2>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
        {{ error }}
      </div>

      <div class="space-y-2">
        <Label for="note-title" required>Title</Label>
        <Input
          id="note-title"
          v-model="title"
          type="text"
          placeholder="Enter note title"
          required
        />
      </div>

      <div class="space-y-2">
        <Label for="note-content">Content</Label>
        <Textarea
          id="note-content"
          v-model="content"
          placeholder="Enter note content (optional)"
          :rows="8"
        />
      </div>
    </form>

    <template #footer>
      <Button type="button" variant="outline" @click="handleCancel">
        Cancel
      </Button>
      <Button type="button" @click="handleSubmit">
        {{ note ? 'Update' : 'Create' }}
      </Button>
    </template>
  </Dialog>
</template>
