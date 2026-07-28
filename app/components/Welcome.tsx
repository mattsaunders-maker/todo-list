'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function Welcome() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleLogin(e: React.SubmitEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) {
      if (error.code === 'email_not_confirmed') {
        setError('Please check your email and confirm your account before logging in.')
      } else {
        setError(error.message)
      }
    }
  }

  return (
    <main className="max-w-sm mx-auto mt-16 p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border rounded px-3 py-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm">
        <Link href="/auth/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </main>
  )
}
