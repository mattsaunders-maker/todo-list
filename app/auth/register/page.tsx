'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleRegister(e: React.SubmitEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName },
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.user?.identities?.length === 0) {
      setError('This email is already registered. Try logging in instead.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="max-w-sm mx-auto mt-16 p-6">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p>We&apos;ve sent a confirmation link to {email}. Click it to activate your account.</p>
      </main>
    )
  }

  return (
    <main className="max-w-sm mx-auto mt-16 p-6">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          required
          className="border rounded px-3 py-2"
        />
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
          Create account
        </button>
      </form>
    </main>
  )
}
