import { Card } from '../components/Card'
import { useLocalStorage } from '../hooks/useLocalStorage'

export function NotesWidget() {
  const [note, setNote] = useLocalStorage('dashboard:note', '')

  return (
    <Card
      title="메모"
      icon={<span aria-hidden>📝</span>}
      action={
        <span className="text-xs text-slate-400">{note.length}자</span>
      }
      bodyClassName="flex"
    >
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="떠오르는 생각을 자유롭게 적어두세요. 자동 저장됩니다."
        className="thin-scroll min-h-[9rem] w-full resize-none rounded-lg border border-slate-200 bg-white/70 p-3 text-sm leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-100 dark:focus:ring-indigo-900/40"
      />
    </Card>
  )
}
