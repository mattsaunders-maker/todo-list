'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Todo = {
  id: string
  task: string
  is_complete: boolean
  created_at: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setTodos(data as Todo[])
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!newTask.trim()) return
    const { error } = await supabase.from('todos').insert({ task: newTask })
    if (error) console.error(error)
    else {
      setNewTask('')
      fetchTodos()
    }
  }

  async function toggleTodo(id: string, current: boolean) {
    await supabase.from('todos').update({ is_complete: !current }).eq('id', id)
    fetchTodos()
  }

  async function deleteTodo(id: string) {
    await supabase.from('todos').delete().eq('id', id)
    fetchTodos()
  }

  return (
    <main className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 border-b pb-2">
            <input
              type="checkbox"
              checked={todo.is_complete}
              onChange={() => toggleTodo(todo.id, todo.is_complete)}
            />
            <span className={todo.is_complete ? 'line-through flex-1' : 'flex-1'}>
              {todo.task}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="text-red-500 text-sm">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}