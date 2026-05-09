import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import type { Task, Status, UpdateTaskPayload } from '../../types'

interface ColumnProps {
  id: Status
  label: string
  tasks: Task[]
  onAddTask: () => void
  onUpdateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>
  onDeleteTask: (id: string) => Promise<void>
  onEditTask: (task: Task) => void
}

export default function Column({
  id,
  label,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className={`column column--${id}`}>
      <div className="column-header">
        <span className="column-label">{label}</span>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`column-cards ${isOver ? 'column-cards--drag-over' : ''}`}
      >
        {tasks.length === 0 ? (
          <div className="column-empty">
            <p>No tasks yet</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>

      <button className="column-add-btn" onClick={onAddTask}>
        + Add Task
      </button>
    </div>
  )
}