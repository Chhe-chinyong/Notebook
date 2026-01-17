<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
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

// Prevent body scroll when drawer is open on mobile
watch(selectedNote, (isOpen) => {
  if (isOpen) {
    // Prevent body scroll on mobile
    document.body.style.overflow = 'hidden'
    // Prevent iOS bounce scroll
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
  } else {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
})

function handleView(note: Note) {
  selectedNote.value = note
}

function handleCloseDetail() {
  selectedNote.value = null
}

// Handle escape key to close
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedNote.value) {
    handleCloseDetail()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

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
    <div class="relative">
      <!-- Notes List (full width, adjusts when detail is open) -->
      <div
        class="w-full transition-all duration-300"
        :class="selectedNote ? 'lg:pr-[400px]' : ''"
      >
        <NoteList @view="handleView" />
      </div>
      
      <!-- Note Detail Blade (fixed on the right) -->
      <div
        class="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-background border-l shadow-xl transform transition-transform duration-300 ease-out z-50 overflow-hidden flex flex-col"
        :class="selectedNote ? 'translate-x-0' : 'translate-x-full'"
        :style="{ 
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }"
      >
        <!-- Mobile drag handle -->
        <div class="sm:hidden flex justify-center pt-2 pb-1">
          <div class="w-12 h-1 bg-muted rounded-full"></div>
        </div>
        
        <!-- Header -->
        <div class="sticky top-0 bg-background border-b px-4 py-3 sm:py-4 flex items-center justify-between z-10 shadow-sm flex-shrink-0">
          <h2 class="text-base sm:text-lg font-semibold">Note Details</h2>
          <button
            @click="handleCloseDetail"
            class="text-muted-foreground hover:text-foreground active:bg-accent transition-colors p-2 -mr-2 rounded-md touch-manipulation"
            aria-label="Close detail"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <!-- Content (scrollable) -->
        <div class="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:py-6">
          <NoteDetail
            v-if="selectedNote"
            :note="selectedNote"
            @edit="handleEdit"
            @delete="handleDelete"
            @close="handleCloseDetail"
          />
        </div>
      </div>
      
      <!-- Backdrop overlay for mobile -->
      <div
        v-if="selectedNote"
        class="fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity duration-300"
        :class="selectedNote ? 'opacity-100' : 'opacity-0'"
        @click="handleCloseDetail"
        @touchstart.prevent
      />
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
