export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'
export type Priority = 'low' | 'normal' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  due_date?: string
  user_id: string
  created_at: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  priority?: Priority
  due_date?: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  status?: Status
  priority?: Priority
  due_date?: string
}

export interface Comment {
    id: string
    task_id: string
    user_id: string
    body: string
    created_at: string
  }
  
  export interface CreateCommentPayload {
    body: string
  }