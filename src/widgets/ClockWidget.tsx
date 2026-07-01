import { useNow } from '../hooks/useNow'

function greeting(hour: number): string {
  if (hour < 6) return '늦은 밤이에요'
  if (hour < 12) return '좋은 아침이에요'
  if (hour < 18) return '좋은 오후예요'
  return '좋은 저녁이에요'
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

interface ClockWidgetProps {
  name: string
}

/** Hero tile: live clock, date, and a time-aware greeting. */
export function ClockWidget({ name }: ClockWidgetProps) {
  const now = useNow()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  const dateLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${WEEKDAYS[now.getDay()]})`

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-6 text-white shadow-lg">
      <p className="text-sm font-medium text-white/80">{dateLabel}</p>
      <div className="mt-1 flex items-end gap-2 font-semibold tabular-nums">
        <span className="text-6xl leading-none tracking-tight">
          {hh}:{mm}
        </span>
        <span className="mb-1 text-2xl text-white/70">{ss}</span>
      </div>
      <p className="mt-4 text-lg font-medium">
        {greeting(now.getHours())}, <span className="font-bold">{name}</span>님 👋
      </p>
    </div>
  )
}
