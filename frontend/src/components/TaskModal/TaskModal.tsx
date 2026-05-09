import { useState } from 'react'
import type { Status, Priority, CreateTaskPayload, Task } from '../../types'

interface TaskModalProps {
  defaultStatus: Status
  existingTask?: Task
  onClose: () => void
  onSubmit: (payload: CreateTaskPayload) => Promise<void>
}

export default function TaskModal({
  existingTask,
  onClose,
  onSubmit
}: TaskModalProps) {
  const [title, setTitle] = useState(existingTask?.title ?? '')
  const [description, setDescription] = useState(existingTask?.description ?? '')
  const [priority, setPriority] = useState<Priority>(existingTask?.priority ?? 'normal')
  const [dueDate, setDueDate] = useState(existingTask?.due_date ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!existingTask

  async function handleSubmit() {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate || undefined
      })
    } catch {
      setError(`Failed to ${isEditing ? 'update' : 'create'} task. Please try again.`)
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <p className="modal-error">{error}</p>}

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? isEditing ? 'Saving...' : 'Creating...'
              : isEditing ? 'Save Changes' : 'Create Task'
            }
          </button>
        </div>
      </div>
    </div>
  )
}