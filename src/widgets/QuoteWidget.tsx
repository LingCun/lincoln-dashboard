import { useMemo } from 'react'
import { Card } from '../components/Card'
import { useNow } from '../hooks/useNow'

interface Quote {
  text: string
  author: string
}

const QUOTES: Quote[] = [
  { text: '오늘 할 수 있는 일에 전력을 다하라.', author: '아이작 뉴턴' },
  { text: '시작이 반이다.', author: '아리스토텔레스' },
  { text: '천 리 길도 한 걸음부터.', author: '노자' },
  { text: '가장 큰 위험은 위험 없는 삶이다.', author: '스티븐 코비' },
  { text: '작은 기회로부터 종종 위대한 업적이 시작된다.', author: '데모스테네스' },
  { text: '행동은 모든 성공의 기초가 되는 열쇠다.', author: '파블로 피카소' },
  { text: '오늘의 나는 어제의 내 생각의 결과다.', author: '부처' },
  { text: '실패는 성공의 어머니다.', author: '토머스 에디슨' },
  { text: '늦었다고 생각할 때가 가장 빠른 때다.', author: '박명수' },
  { text: '꿈을 밀고 나가는 힘은 이성이 아니라 희망이다.', author: '도스토옙스키' },
]

/** Deterministic "quote of the day" — same quote all day, rotates daily. */
export function QuoteWidget() {
  const now = useNow(60_000)
  const quote = useMemo(() => {
    const dayIndex = Math.floor(
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() /
        86_400_000,
    )
    return QUOTES[dayIndex % QUOTES.length]
  }, [now])

  return (
    <Card title="오늘의 명언" icon={<span aria-hidden>💬</span>}>
      <figure className="flex h-full flex-col justify-center">
        <blockquote className="text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-100">
          “{quote.text}”
        </blockquote>
        <figcaption className="mt-2 text-sm text-slate-400">
          — {quote.author}
        </figcaption>
      </figure>
    </Card>
  )
}
