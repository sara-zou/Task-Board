import { useState } from 'react'
import Column from './Column'
import TaskModal from '../TaskModal/TaskModal'
import type { Task, Status, CreateTaskPayload, UpdateTaskPayload } from '../../types'

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review', label: 'In Review' },
  { id: 'done', label: 'Done' }
]

interface BoardProps {
  tasks: Task[]
  loading: boolean
  onCreateTask: (payload: CreateTaskPayload) => Promise<void>
  onUpdateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>
  onDeleteTask: (id: string) => Promise<void>
}

export default function Board({
  tasks,
  loading,
  onCreateTask,
  onUpdateTask,
  onDeleteTask
}: BoardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState<Status>('todo')

  function handleAddTask(status: Status) {
    setDefaultStatus(status)
    setModalOpen(true)
  }

  function getTasksByStatus(status: Status) {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="board-container">
      <header className="board-header">
        <h1>My Board</h1>
      </header>

      {loading ? (
        <div className="board-loading">
          <div className="skeleton-board">
            {COLUMNS.map(col => (
              <div key={col.id} className="skeleton-column">
                <div className="skeleton-title" />
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="board">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              id={col.id}
              label={col.label}
              tasks={getTasksByStatus(col.id)}
              onAddTask={() => handleAddTask(col.id)}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <TaskModal
          defaultStatus={defaultStatus}
          onClose={() => setModalOpen(false)}
          onSubmit={async (payload) => {
            await onCreateTask(payload)
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}