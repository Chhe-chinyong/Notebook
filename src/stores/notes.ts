import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '@/services/types/note.types'
import { notesService } from '@/services/api/notes.service'
import { useAuthStore } from './auth'

export type SortOption = 'created-desc' | 'created-asc' | 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const sortOption = ref<SortOption>('updated-desc')

  const authStore = useAuthStore()

  const filteredNotes = computed(() => {
    let result = [...notes.value]

    // Apply search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption.value) {
        case 'created-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'created-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'updated-desc':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'updated-asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return result
  })

  async function fetchNotes() {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null
    try {
      notes.value = await notesService.getNotes(authStore.user.id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch notes'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getNote(id: string): Promise<Note | null> {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null
    try {
      return await notesService.getNoteById(id, authStore.user.id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch note'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createNote(data: CreateNoteRequest): Promise<Note> {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null
    try {
      const newNote = await notesService.createNote(data, authStore.user.id)
      notes.value.push(newNote)
      return newNote
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create note'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateNote(id: string, updates: UpdateNoteRequest): Promise<Note> {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null
    try {
      const updatedNote = await notesService.updateNote(id, authStore.user.id, updates)
      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      return updatedNote
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update note'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteNote(id: string): Promise<void> {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null
    try {
      await notesService.deleteNote(id, authStore.user.id)
      notes.value = notes.value.filter(n => n.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete note'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setSortOption(option: SortOption) {
    sortOption.value = option
  }

  return {
    notes,
    loading,
    error,
    searchQuery,
    sortOption,
    filteredNotes,
    fetchNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    setSearchQuery,
    setSortOption
  }
})
