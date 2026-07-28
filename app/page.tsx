'use client'

import { useSession } from '@/lib/useSession'
import Welcome from './components/Welcome'
import TodoApp from './components/TodoApp'

export default function Home() {
  const { session, loading } = useSession()

  if (loading) return null
  if (!session) return <Welcome />
  return <TodoApp page={1} userId={session.user.id} />
}
