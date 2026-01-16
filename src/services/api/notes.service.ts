import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note.types'

const STORAGE_KEY = 'notebook_notes'

function getNotes(): Note[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export const notesService = {
  async getNotes(userId: number): Promise<Note[]> {
    const notes = getNotes()
    return notes.filter(note => note.userId === userId)
  },

  async getNoteById(id: string, userId: number): Promise<Note | null> {
    const notes = getNotes()
    const note = notes.find(n => n.id === id && n.userId === userId)
    return note || null
  },

  async createNote(data: CreateNoteRequest, userId: number): Promise<Note> {
    const notes = getNotes()
    const now = new Date().toISOString()
    
    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: data.title,
      content: data.content || '',
      createdAt: now,
      updatedAt: now,
      userId
    }

    notes.push(newNote)
    saveNotes(notes)

    return newNote
  },

  async updateNote(id: string, userId: number, updates: UpdateNoteRequest): Promise<Note> {
    const notes = getNotes()
    const noteIndex = notes.findIndex(n => n.id === id && n.userId === userId)

    if (noteIndex === -1) {
      throw new Error('Note not found or access denied')
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    notes[noteIndex] = updatedNote
    saveNotes(notes)

    return updatedNote
  },

  async deleteNote(id: string, userId: number): Promise<void> {
    const notes = getNotes()
    const noteIndex = notes.findIndex(n => n.id === id && n.userId === userId)

    if (noteIndex === -1) {
      throw new Error('Note not found or access denied')
    }

    notes.splice(noteIndex, 1)
    saveNotes(notes)
  }
}
