import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import Column from './Column'
import TaskModal from '../TaskModal/TaskModal'
import TaskCard from './TaskCard'
import type { Task, Status, CreateTaskPayload, UpdateTaskPayload } from '../../types'
import TaskDetailPanel from '../TaskDetail/TaskDetailPanel'

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
  onSignOut: () => Promise<void>
}

export default function Board({
  tasks,
  loading,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onSignOut
}: BoardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState<Status>('todo')
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [openTask, setOpenTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  function handleEditTask(task: Task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function handleAddTask(status: Status) {
    setDefaultStatus(status)
    setModalOpen(true)
  }

  function getTasksByStatus(status: Status) {
    return tasks.filter(task => task.status === status)
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  function handleDragOver(event: DragOverEvent) {
    // TODO: add visual feedback when hovering over a column
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Status

    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return

    // Only update if dropped on a valid column
    if (COLUMNS.some(col => col.id === newStatus)) {
      await onUpdateTask(taskId, { status: newStatus })
    }
  }

  return (
    
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board-container">
      <header className="board-header">
  <h1>My Board</h1>
  <button className="btn btn--secondary" onClick={onSignOut}>
    Sign Out
  </button>
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
              onEditTask={handleEditTask}
              onOpenTask={setOpenTask}
            />
            ))}
          </div>
        )}

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onEdit={handleEditTask}
              onOpen={setOpenTask}
            />
          ) : null}
        </DragOverlay>
      </div>

      {modalOpen && (
  <TaskModal
    defaultStatus={defaultStatus}
    existingTask={editingTask ?? undefined}
    onClose={() => {
      setModalOpen(false)
      setEditingTask(null)
    }}
    onSubmit={async payload => {
      if (editingTask) {
        await onUpdateTask(editingTask.id, payload)
      } else {
        await onCreateTask(payload)
      }
      setModalOpen(false)
      setEditingTask(null)
    }}
  />
)}

{openTask && (
  <TaskDetailPanel
    task={openTask}
    onClose={() => setOpenTask(null)}
    onEdit={task => {
      setOpenTask(null)
      handleEditTask(task)
    }}
    onDelete={async id => {
      await onDeleteTask(id)
      setOpenTask(null)
    }}
  />
)}
    </DndContext>
  )
}