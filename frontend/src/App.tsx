import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import Board from './components/Board/Board'
import AuthPage from './components/Auth/AuthPage'

function App() {
  const {
    session,
    loading: authLoading,
    signIn,
    signUp,
    signOut,
    signInAnonymously
  } = useAuth()

  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } =
    useTasks(!!session)

  if (authLoading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!session) {
    return (
      <AuthPage
        onSignIn={signIn}
        onSignUp={signUp}
        onAnonymous={signInAnonymously}
      />
    )
  }

  return (
    <Board
      tasks={tasks}
      loading={tasksLoading}
      onCreateTask={createTask}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
      onSignOut={signOut}
    />
  )
}

export default App