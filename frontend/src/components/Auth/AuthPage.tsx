import { useState } from 'react'

type AuthMode = 'login' | 'signup'

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string) => Promise<void>
  onAnonymous: () => Promise<void>
}

export default function AuthPage({ onSignIn, onSignUp, onAnonymous }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        await onSignIn(email, password)
      } else {
        await onSignUp(email, password)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleAnonymous() {
    setLoading(true)
    setError(null)
    try {
      await onAnonymous()
    } catch {
      setError('Failed to continue as guest')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">Kanban</h1>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div className="auth-body">
          {error && <p className="auth-error">{error}</p>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button
            className="btn btn--primary btn--full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? '...'
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className="btn btn--ghost btn--full"
            onClick={handleAnonymous}
            disabled={loading}
          >
            Continue as Guest
          </button>
        </div>

        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              No account?{' '}
              <button className="auth-switch" onClick={() => { setMode('signup'); setError(null) }}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="auth-switch" onClick={() => { setMode('login'); setError(null) }}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}