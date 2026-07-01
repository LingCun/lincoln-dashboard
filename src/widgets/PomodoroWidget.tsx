import { useEffect, useRef, useState } from 'react'
import { Card } from '../components/Card'

type Mode = 'focus' | 'break'

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  break: 5 * 60,
}

export function PomodoroWidget() {
  const [mode, setMode] = useState<Mode>('focus')
  const [remaining, setRemaining] = useState(DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [rounds, setRounds] = useState(0)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running])

  // Handle a completed timer.
  useEffect(() => {
    if (remaining > 0) return
    setRunning(false)
    if (mode === 'focus') {
      setRounds((n) => n + 1)
      switchMode('break')
    } else {
      switchMode('focus')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  function switchMode(next: Mode) {
    setMode(next)
    setRemaining(DURATIONS[next])
    setRunning(false)
  }

  function reset() {
    setRemaining(DURATIONS[mode])
    setRunning(false)
  }

  const total = DURATIONS[mode]
  const progress = ((total - remaining) / total) * 100
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <Card
      title="포모도로"
      icon={<span aria-hidden>🍅</span>}
      action={
        <span className="text-xs text-slate-400">완료 {rounds}회</span>
      }
    >
      <div className="flex flex-col items-center">
        <div className="mb-3 flex gap-1 rounded-full bg-slate-100 p-1 text-xs font-medium dark:bg-slate-700">
          {(['focus', 'break'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-3 py-1 transition-colors ${
                mode === m
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {m === 'focus' ? '집중 25분' : '휴식 5분'}
            </button>
          ))}
        </div>

        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={mode === 'focus' ? 'stroke-indigo-500' : 'stroke-emerald-500'}
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
          </svg>
          <span className="absolute text-3xl font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {mm}:{ss}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-lg bg-indigo-500 px-5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 active:scale-95"
          >
            {running ? '일시정지' : '시작'}
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            초기화
          </button>
        </div>
      </div>
    </Card>
  )
}
