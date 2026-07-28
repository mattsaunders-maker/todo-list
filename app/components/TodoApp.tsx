'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type Priority = 'low' | 'medium' | 'high'

type Todo = {
  id: string
  task: string
  is_complete: boolean
  created_at: string
  description: string | null
  due_date: string | null
  priority: Priority | null
}

const PAGE_SIZE = 5

function formatDueDate(dueDate: string) {
  return new Date(dueDate + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function hasDetails(todo: Todo) {
  return Boolean(todo.description || todo.due_date || todo.priority)
}

export default function TodoApp({ page }: { page: number }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [newTask, setNewTask] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState<Priority>('medium')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function fetchTodos() {
    const { count, error: countError } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
    if (countError) {
      console.error(countError)
      return
    }
    const total = count ?? 0
    setTotalCount(total)

    const from = (page - 1) * PAGE_SIZE
    if (from >= total) {
      setTodos([])
      return
    }

    const to = from + PAGE_SIZE - 1
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)
    if (error) console.error(error)
    else setTodos(data as Todo[])
  }

  async function addTodo(e: React.SubmitEvent) {
    e.preventDefault()
    if (!newTask.trim()) return
    const { error } = await supabase.from('todos').insert({
      task: newTask,
      description: newDescription.trim() || null,
      due_date: newDueDate || null,
      priority: newPriority,
    })
    if (error) console.error(error)
    else {
      setNewTask('')
      setNewDescription('')
      setNewDueDate('')
      setNewPriority('medium')
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

  function toggleExpanded(todo: Todo) {
    if (!hasDetails(todo)) return
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(todo.id)) next.delete(todo.id)
      else next.add(todo.id)
      return next
    })
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const isBeyondRange = totalPages > 0 && page > totalPages

  return (
    <main className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <form onSubmit={addTodo} className="flex flex-col gap-2 mb-6">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="border rounded px-3 py-2"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description (optional)"
          className="border rounded px-3 py-2"
          rows={2}
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Priority)}
            className="border rounded px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Add
        </button>
      </form>
      {isBeyondRange ? (
        <p className="text-center text-gray-500">you&apos;ve travelled too far</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => {
            const expandable = hasDetails(todo)
            const expanded = expandedIds.has(todo.id)
            return (
              <li key={todo.id} className="border-b pb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.is_complete}
                    onChange={() => toggleTodo(todo.id, todo.is_complete)}
                  />
                  <span
                    onClick={() => toggleExpanded(todo)}
                    className={
                      (todo.is_complete ? 'line-through ' : '') +
                      'flex-1' +
                      (expandable ? ' cursor-pointer' : '')
                    }
                  >
                    {todo.task}
                  </span>
                  <button onClick={() => deleteTodo(todo.id)} className="text-red-500 text-sm">
                    Delete
                  </button>
                </div>
                {expandable && expanded && (
                  <div className="mt-1 ml-6 text-sm text-gray-500 space-y-0.5">
                    {todo.description && <p>{todo.description}</p>}
                    {todo.due_date && <p>Due {formatDueDate(todo.due_date)}</p>}
                    {todo.priority && <p>Priority: {todo.priority}</p>}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {totalPages > 1 && (
        <nav className="flex gap-3 justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? '/' : `/page/${n}`}
              className={n === page ? 'font-bold underline' : 'text-blue-600'}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </main>
  )
}
