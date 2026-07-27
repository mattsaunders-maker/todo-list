'use client'

import { useEffect, useState } from 'react'
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

function formatDueDate(dueDate: string) {
  return new Date(dueDate + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function hasDetails(todo: Todo) {
  return Boolean(todo.description || todo.due_date || todo.priority)
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTask, setNewTask] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState<Priority>('medium')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

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
    </main>
  )
}
