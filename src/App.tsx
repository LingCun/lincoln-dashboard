import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { ClockWidget } from './widgets/ClockWidget'
import { WeatherWidget } from './widgets/WeatherWidget'
import { TodoWidget } from './widgets/TodoWidget'
import { NotesWidget } from './widgets/NotesWidget'
import { BookmarksWidget } from './widgets/BookmarksWidget'
import { QuoteWidget } from './widgets/QuoteWidget'
import { PomodoroWidget } from './widgets/PomodoroWidget'
import { DesktopPet } from './components/DesktopPet'

export default function App() {
  const { theme, toggle } = useTheme()
  const [name, setName] = useLocalStorage('dashboard:name', '링컨')
  const [editing, setEditing] = useState(false)

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Lincoln Dashboard
            </h1>
            <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              {editing ? (
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
                  className="w-28 rounded border border-slate-300 bg-white px-2 py-0.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-800"
                />
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="underline decoration-dotted underline-offset-2 hover:text-indigo-500"
                >
                  {name}님의 개인 대시보드
                </button>
              )}
            </div>
          </div>
          <button
            onClick={toggle}
            aria-label="테마 전환"
            className="rounded-full border border-slate-200 bg-white/70 p-2.5 text-lg shadow-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>

        <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="animate-fade-in md:col-span-2 lg:col-span-1">
            <ClockWidget name={name} />
          </div>
          <div className="animate-fade-in [animation-delay:60ms]">
            <WeatherWidget />
          </div>
          <div className="animate-fade-in [animation-delay:120ms]">
            <QuoteWidget />
          </div>

          <div className="animate-fade-in [animation-delay:180ms]">
            <TodoWidget />
          </div>
          <div className="animate-fade-in [animation-delay:240ms]">
            <PomodoroWidget />
          </div>
          <div className="animate-fade-in [animation-delay:300ms]">
            <NotesWidget />
          </div>

          <div className="animate-fade-in md:col-span-2 lg:col-span-3 [animation-delay:360ms]">
            <BookmarksWidget />
          </div>
        </main>

        <footer className="mt-10 text-center text-xs text-slate-400">
          모든 데이터는 브라우저에만 저장됩니다 · Lincoln Dashboard
        </footer>
      </div>

      <DesktopPet />
    </div>
  )
}
