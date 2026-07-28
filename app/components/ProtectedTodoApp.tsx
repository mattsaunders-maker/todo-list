'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/useSession'
import TodoApp from './TodoApp'

export default function ProtectedTodoApp({ page }: { page: number }) {
  const { session, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) router.replace('/')
  }, [loading, session, router])

  if (loading || !session) return null
  return <TodoApp page={page} userId={session.user.id} />
}
