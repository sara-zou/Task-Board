import { supabase } from './supabase'
import type { CreateTaskPayload, UpdateTaskPayload, Task, Comment } from '../types'


const API_URL = import.meta.env.VITE_API_URL

async function getHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

export const api = {
  async getTasks(): Promise<Task[]> {
    const headers = await getHeaders()
    const res = await fetch(`${API_URL}/tasks`, { headers })
    if (!res.ok) throw new Error('Failed to fetch tasks')
    return res.json()
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const headers = await getHeaders()
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Failed to create task')
    return res.json()
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const headers = await getHeaders()
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Failed to update task')
    return res.json()
  },

  async deleteTask(id: string): Promise<void> {
    const headers = await getHeaders()
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers
    })
    if (!res.ok) throw new Error('Failed to delete task')
  },

  async getComments(taskId: string): Promise<Comment[]> {
    const headers = await getHeaders()
    const res = await fetch(`${API_URL}/tasks/${taskId}/comments`, { headers })
    if (!res.ok) throw new Error('Failed to fetch comments')
    return res.json()
  },
  
  async createComment(taskId: string, body: string): Promise<Comment> {
    const headers = await getHeaders()
    const res = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ body })
    })
    if (!res.ok) throw new Error('Failed to create comment')
    return res.json()
  },
  
  async deleteComment(id: string): Promise<void> {
    const headers = await getHeaders()
    const res = await fetch(`${API_URL}/comments/${id}`, {
      method: 'DELETE',
      headers
    })
    if (!res.ok) throw new Error('Failed to delete comment')
  }
}