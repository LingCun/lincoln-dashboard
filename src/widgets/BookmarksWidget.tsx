import { useState } from 'react'
import { Card } from '../components/Card'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Bookmark {
  id: string
  label: string
  url: string
}

const DEFAULTS: Bookmark[] = [
  { id: 'gh', label: 'GitHub', url: 'https://github.com' },
  { id: 'gm', label: 'Gmail', url: 'https://mail.google.com' },
  { id: 'yt', label: 'YouTube', url: 'https://youtube.com' },
  { id: 'nv', label: 'Naver', url: 'https://naver.com' },
]

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function normalizeUrl(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
}

function faviconFor(url: string): string {
  try {
    const host = new URL(normalizeUrl(url)).hostname
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`
  } catch {
    return ''
  }
}

export function BookmarksWidget() {
  const [items, setItems] = useLocalStorage<Bookmark[]>(
    'dashboard:bookmarks',
    DEFAULTS,
  )
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')

  function add() {
    const l = label.trim()
    const u = url.trim()
    if (!l || !u) return
    setItems((prev) => [...prev, { id: newId(), label: l, url: normalizeUrl(u) }])
    setLabel('')
    setUrl('')
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <Card title="즐겨찾기" icon={<span aria-hidden>🔖</span>}>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((b) => (
          <li key={b.id} className="group relative">
            <a
              href={b.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-700/40 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <img
                src={faviconFor(b.url)}
                alt=""
                width={16}
                height={16}
                className="shrink-0 rounded"
                onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              />
              <span className="truncate">{b.label}</span>
            </a>
            <button
              onClick={() => remove(b.id)}
              aria-label="삭제"
              className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white group-hover:flex"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="이름"
          className="w-24 shrink-0 rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-100"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="example.com"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-100"
        />
        <button
          onClick={add}
          className="shrink-0 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 active:scale-95"
        >
          +
        </button>
      </div>
    </Card>
  )
}
