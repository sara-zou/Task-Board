import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Task, UpdateTaskPayload } from '../../types'
import { LuPencil } from 'react-icons/lu'

type Status = 'todo' | 'in_progress' | 'in_review' | 'done'

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, payload: UpdateTaskPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onEdit: (task: Task) => void
  onOpen: (task: Task) => void
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' }
]

function getPriorityClass(priority: string) {
  switch (priority) {
    case 'high': return 'priority--high'
    case 'low': return 'priority--low'
    default: return 'priority--normal'
  }
}

function isOverdue(dueDate?: string) {
  if (!dueDate) return false
  return new Date(dueDate + 'T00:00:00') < new Date()
}

function isDueSoon(dueDate?: string) {
  if (!dueDate) return false
  const due = new Date(dueDate + 'T00:00:00')
  const now = new Date()
  const twoDaysFromNow = new Date()
  twoDaysFromNow.setDate(now.getDate() + 2)
  return due >= now && due <= twoDaysFromNow
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit, onOpen }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1
  }

  return (
    <div
  ref={setNodeRef}
  style={style}
  className={`task-card ${getPriorityClass(task.priority)}`}
  {...attributes}
  {...listeners}
>

      <div className="task-card-header">
  <span className={`priority-badge priority-badge--${task.priority}`}>
    {task.priority}
  </span>
  <div className="task-card-actions">
  <button
  className="task-edit-btn"
  onClick={() => onEdit(task)}
  aria-label="Edit task"
>
  <LuPencil size={14} />
</button>
    <button
      className="task-delete-btn"
      onClick={() => onDelete(task.id)}
      aria-label="Delete task"
    >
      ×
    </button>

    
  </div>
</div>

      <p className="task-title task-title--clickable" onClick={() => onOpen(task)}>
  {task.title}
</p>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.due_date && (
        <span className={`due-date ${
          isOverdue(task.due_date)
            ? 'due-date--overdue'
            : isDueSoon(task.due_date)
            ? 'due-date--soon'
            : ''
        }`}>
          {isOverdue(task.due_date) ? '! Overdue' : ''}{' '}
          {new Date(task.due_date + 'T00:00:00').toLocaleDateString()}
        </span>
      )}

      <select
        className="task-status-select"
        value={task.status}
        onChange={e => onUpdate(task.id, { status: e.target.value as Status })}
      >
        {STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}