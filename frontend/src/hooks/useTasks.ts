import { useEffect, useState } from 'react'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types'
import { api } from '../lib/api'

export function useTasks(ready: boolean) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    fetchTasks()
  }, [ready])

  async function fetchTasks() {
    try {
      setLoading(true)
      const data = await api.getTasks()
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  async function createTask(payload: CreateTaskPayload) {
    try {
      const newTask = await api.createTask(payload)
      setTasks(prev => [...prev, newTask])
    } catch (err) {
      setError('Failed to create task')
    }
  }

  async function updateTask(id: string, payload: UpdateTaskPayload) {
    // Update UI immediately, sync with backend
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...payload } : task))
    )
    try {
      const updated = await api.updateTask(id, payload)
      setTasks(prev =>
        prev.map(task => (task.id === id ? updated : task))
      )
    } catch (err) {
      setError('Failed to update task')
      fetchTasks() 
    }
  }

  async function deleteTask(id: string) {
    setTasks(prev => prev.filter(task => task.id !== id))
    try {
      await api.deleteTask(id)
    } catch (err) {
      setError('Failed to delete task')
      fetchTasks()
    }
  }

  return { tasks, loading, error, createTask, updateTask, deleteTask }
}