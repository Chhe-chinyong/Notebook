import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note.types'
import apiClient from './client'

export const notesService = {
  async getNotes(userId: number): Promise<Note[]> {
    // GET /api/notes
    // Backend filters notes by authenticated user from JWT token
    // Response will be { success: true, data: Note[] }
    // Axios interceptor extracts the data field
    const response = await apiClient.get<Note[]>('/api/notes')
    return response.data
  },

  async getNoteById(id: string, userId: number): Promise<Note | null> {
    // GET /api/notes/:id
    // Backend verifies ownership via JWT token
    // Response will be { success: true, data: Note }
    try {
      const response = await apiClient.get<Note>(`/api/notes/${id}`)
      return response.data
    } catch (error: any) {
      // If 404, return null (note not found)
      if (error.statusCode === 404) {
        return null
      }
      throw error
    }
  },

  async createNote(data: CreateNoteRequest, userId: number): Promise<Note> {
    // POST /api/notes
    // Backend associates note with authenticated user from JWT token
    // Response will be { success: true, data: Note }
    const response = await apiClient.post<Note>('/api/notes', data)
    return response.data
  },

  async updateNote(id: string, userId: number, updates: UpdateNoteRequest): Promise<Note> {
    // PUT /api/notes/:id or PATCH /api/notes/:id
    // Backend verifies ownership via JWT token
    // Response will be { success: true, data: Note }
    const response = await apiClient.put<Note>(`/api/notes/${id}`, updates)
    return response.data
  },

  async deleteNote(id: string, userId: number): Promise<void> {
    // DELETE /api/notes/:id
    // Backend verifies ownership via JWT token
    // Response will be { success: true, data: null } or just success
    await apiClient.delete(`/api/notes/${id}`)
  }
}
