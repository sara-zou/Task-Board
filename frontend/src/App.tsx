import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import Board from './components/Board/Board'

function App() {
  const { session, loading: authLoading } = useAuth()
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } =
    useTasks(!!session)

  if (authLoading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <Board
      tasks={tasks}
      loading={tasksLoading}
      onCreateTask={createTask}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
    />
  )
}

export default App