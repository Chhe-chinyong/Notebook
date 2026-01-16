<script setup lang="ts">
import { ref } from 'vue'
import type { Note } from '@/services/types/note.types'
import { useNotesStore } from '@/stores/notes'
import AppLayout from '@/components/layout/AppLayout.vue'
import NoteList from '@/components/notes/NoteList.vue'
import NoteDetail from '@/components/notes/NoteDetail.vue'
import NoteForm from '@/components/notes/NoteForm.vue'

const notesStore = useNotesStore()
const selectedNote = ref<Note | null>(null)
const showForm = ref(false)
const editingNote = ref<Note | null>(null)

function handleView(note: Note) {
  selectedNote.value = note
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
      // Update selected note if it's the one being edited
      if (selectedNote.value?.id === editingNote.value.id) {
        const updated = await notesStore.getNote(editingNote.value.id)
        if (updated) {
          selectedNote.value = updated
        }
      }
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
  <AppLayout>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Notes List (2 columns on large screens) -->
      <div class="lg:col-span-2">
        <NoteList @view="handleView" />
      </div>
      
      <!-- Note Detail (1 column on large screens) -->
      <div class="lg:col-span-1">
        <NoteDetail
          :note="selectedNote"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- Note Form Dialog -->
    <NoteForm
      :model-value="showForm"
      :note="editingNote"
      @update:model-value="showForm = $event"
      @submit="handleFormSubmit"
    />
  </AppLayout>
</template>
