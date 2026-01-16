export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  userId: number
}

export interface CreateNoteRequest {
  title: string
  content?: string
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
}
