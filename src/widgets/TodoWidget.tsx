import { useState } from 'react'
import { Card } from '../components/Card'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Todo {
  id: string
  text: string
  done: boolean
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function TodoWidget() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('dashboard:todos', [])
  const [draft, setDraft] = useState('')

  const remaining = todos.filter((t) => !t.done).length

  function add() {
    const text = draft.trim()
    if (!text) return
    setTodos((prev) => [{ id: newId(), text, done: false }, ...prev])
    setDraft('')
  }

  function toggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <Card
      title="할 일"
      icon={<span aria-hidden>✅</span>}
      action={
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {remaining}개 남음
        </span>
      }
      bodyClassName="flex flex-col"
    >
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="새 할 일 추가…"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-100 dark:focus:ring-indigo-900/40"
        />
        <button
          onClick={add}
          className="shrink-0 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 active:scale-95"
        >
          추가
        </button>
      </div>

      <ul className="thin-scroll mt-3 max-h-56 space-y-1 overflow-y-auto pr-1">
        {todos.length === 0 && (
          <li className="py-6 text-center text-sm text-slate-400">
            아직 할 일이 없어요. 하나 추가해보세요!
          </li>
        )}
        {todos.map((t) => (
          <li
            key={t.id}
            className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/40"
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
              className="h-4 w-4 shrink-0 accent-indigo-500"
            />
            <span
              className={`flex-1 text-sm ${
                t.done
                  ? 'text-slate-400 line-through'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              {t.text}
            </span>
            <button
              onClick={() => remove(t.id)}
              aria-label="삭제"
              className="shrink-0 text-slate-300 opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
