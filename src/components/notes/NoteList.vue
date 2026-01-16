<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Note } from '@/services/types/note.types'
import { useNotesStore, type SortOption } from '@/stores/notes'
import NoteCard from './NoteCard.vue'
import NoteForm from './NoteForm.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'

const notesStore = useNotesStore()

const selectedNote = ref<Note | null>(null)
const showForm = ref(false)
const editingNote = ref<Note | null>(null)

const emit = defineEmits<{
  view: [note: Note]
}>()

onMounted(async () => {
  await notesStore.fetchNotes()
})

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updated-desc', label: 'Recently Updated' },
  { value: 'updated-asc', label: 'Oldest Updated' },
  { value: 'created-desc', label: 'Newest First' },
  { value: 'created-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' }
]

function handleCreate() {
  editingNote.value = null
  showForm.value = true
}

function handleView(note: Note) {
  selectedNote.value = note
  emit('view', note)
}

function handleEdit(note: Note) {
  editingNote.value = note
  showForm.value = true
}

async function handleDelete(note: Note) {
  if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
    try {
      await notesStore.deleteNote(note.id)
      if (selectedNote.value?.id === note.id) {
        selectedNote.value = null
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete note')
    }
  }
}

async function handleFormSubmit(data: { title: string; content?: string }) {
  try {
    if (editingNote.value) {
      await notesStore.updateNote(editingNote.value.id, data)
    } else {
      await notesStore.createNote(data)
    }
    showForm.value = false
    editingNote.value = null
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to save note')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Search, Sort, and Create Button -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex-1 w-full sm:w-auto">
        <Input
          v-model="notesStore.searchQuery"
          type="text"
          placeholder="Search notes..."
          class="w-full"
        />
      </div>
      
      <div class="flex gap-2 w-full sm:w-auto">
        <div class="flex-1 sm:flex-initial">
          <Select
            v-model="notesStore.sortOption"
            class="w-full sm:w-auto"
          >
            <option
              v-for="option in sortOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </Select>
        </div>
        
        <Button @click="handleCreate">
          Create Note
        </Button>
      </div>
    </div>

    <!-- Notes Grid -->
    <div v-if="notesStore.loading" class="text-center py-8 text-muted-foreground">
      Loading notes...
    </div>
    
    <div v-else-if="notesStore.filteredNotes.length === 0" class="text-center py-8 text-muted-foreground">
      <p v-if="notesStore.searchQuery">No notes found matching your search.</p>
      <p v-else>No notes yet. Create your first note!</p>
    </div>
    
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <NoteCard
        v-for="note in notesStore.filteredNotes"
        :key="note.id"
        :note="note"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Note Form Dialog -->
    <NoteForm
      :model-value="showForm"
      :note="editingNote"
      @update:model-value="showForm = $event"
      @submit="handleFormSubmit"
    />
  </div>
</template>
