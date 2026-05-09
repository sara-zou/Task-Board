import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInAnonymously() {
    const { error } = await supabase.auth.signInAnonymously()
    if (error) throw error
  }

  async function signUp(email: string, password: string) {
    // If already anonymous, upgrade the session instead of creating new account
    // This preserves the user_id so all tasks carry over automatically
    if (session?.user?.is_anonymous) {
      const { error } = await supabase.auth.updateUser({ email, password })
      if (error) throw error
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    session,
    loading,
    isAnonymous: session?.user?.is_anonymous ?? false,
    signInAnonymously,
    signUp,
    signIn,
    signOut
  }
}