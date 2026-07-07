import { useEffect, useRef, useState } from 'react'

/**
 * DesktopPet — 바탕화면(대시보드)을 자유롭게 돌아다니는 픽셀 캐릭터.
 *
 * 업로드된 스티커 세트의 갈색 블록 캐릭터를 SVG 픽셀아트로 재현했다.
 * 화면 바닥을 따라 걷고/뛰고/점프하고/졸고, 클릭하면 반응하며,
 * 드래그해서 집어 올렸다 놓으면 떨어졌다가 착지한다.
 */

type Action = 'idle' | 'walk' | 'run' | 'dash' | 'jump' | 'sleep' | 'drag' | 'fall'
type Mood =
  | 'normal'
  | 'happy'
  | 'surprised'
  | 'confused'
  | 'sleepy'
  | 'tired'
  | 'dizzy'

const PET_W = 72
const PET_H = 64
const MARGIN = 10 // 화면 가장자리 여백

const SPEED: Record<string, number> = {
  walk: 42,
  run: 120,
  dash: 240,
}

const BUBBLE: Partial<Record<Mood, string>> = {
  happy: '❤️',
  surprised: '❗',
  confused: '❓',
  sleepy: '💤',
  tired: '💦',
  dizzy: '😵',
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function DesktopPet() {
  const petRef = useRef<HTMLDivElement>(null)

  // 렌더에 영향을 주는(=드물게 바뀌는) 상태만 React state 로 관리
  const [action, setAction] = useState<Action>('idle')
  const [mood, setMood] = useState<Mood>('normal')
  const [facing, setFacing] = useState<1 | -1>(1)
  const [blink, setBlink] = useState(false)

  // 물리/좌표는 ref 로 관리하고 transform 을 DOM 에 직접 반영(리렌더 최소화)
  const st = useRef({
    x: 120,
    y: 0, // top(px)
    targetX: 120,
    vy: 0,
    action: 'idle' as Action,
    facing: 1 as 1 | -1,
    dragDX: 0,
    dragDY: 0,
    idleStreak: 0, // 연속 idle 횟수 → 일정 이상이면 잠듦
  })

  // 최신 setState 를 rAF/타이머에서 안전하게 부르기 위한 헬퍼
  const setAct = (a: Action) => {
    st.current.action = a
    setAction(a)
  }
  const face = (f: 1 | -1) => {
    st.current.facing = f
    setFacing(f)
  }

  useEffect(() => {
    const groundTop = () => window.innerHeight - PET_H - MARGIN
    const maxX = () => Math.max(MARGIN, window.innerWidth - PET_W - MARGIN)

    st.current.x = rand(MARGIN, maxX())
    st.current.y = groundTop()

    let raf = 0
    let brainTimer = 0
    let last = performance.now()
    let mounted = true

    const draw = () => {
      const el = petRef.current
      if (!el) return
      el.style.transform = `translate3d(${st.current.x}px, ${st.current.y}px, 0)`
      // 점프/드래그 높이에 따라 그림자 크기 조절
      const lift = Math.max(0, groundTop() - st.current.y)
      const shadow = el.querySelector<HTMLElement>('.pet-shadow')
      if (shadow) {
        const k = Math.max(0.35, 1 - lift / 260)
        shadow.style.transform = `scaleX(${k})`
        shadow.style.opacity = String(0.25 + 0.75 * k)
      }
    }

    // 다음 자율 행동 결정
    const nextAction = () => {
      if (!mounted) return
      clearTimeout(brainTimer)
      const s = st.current

      if (s.action === 'drag') return

      // 충분히 오래 쉬었으면 잠들기
      if (s.idleStreak >= 3 && Math.random() < 0.6) {
        s.idleStreak = 0
        setMood('sleepy')
        setAct('sleep')
        brainTimer = window.setTimeout(() => {
          setMood('normal')
          nextAction()
        }, rand(4500, 9000))
        return
      }

      const roll = Math.random()
      if (roll < 0.16) {
        // 잠깐 대기 (가끔 두리번/의아)
        s.idleStreak++
        setMood('normal')
        setAct('idle')
        if (Math.random() < 0.25) {
          setMood('confused')
          window.setTimeout(() => mounted && setMood('normal'), 900)
        }
        brainTimer = window.setTimeout(nextAction, rand(1400, 3400))
      } else if (roll < 0.34) {
        // 점프
        s.idleStreak = 0
        setMood('surprised')
        setAct('jump')
        s.vy = -260
        window.setTimeout(() => mounted && setMood('normal'), 700)
      } else if (roll < 0.5) {
        // 대쉬(빠른 질주)
        s.idleStreak = 0
        startMove('dash')
      } else if (roll < 0.72) {
        // 달리기
        s.idleStreak = 0
        startMove('run')
      } else {
        // 걷기
        s.idleStreak = 0
        setMood('normal')
        startMove('walk')
      }
    }

    const startMove = (kind: 'walk' | 'run' | 'dash') => {
      const s = st.current
      const target = rand(MARGIN, maxX())
      s.targetX = target
      face(target >= s.x ? 1 : -1)
      if (kind !== 'walk') setMood('normal')
      setAct(kind)
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const s = st.current
      const gt = groundTop()

      switch (s.action) {
        case 'walk':
        case 'run':
        case 'dash': {
          const dir = s.targetX >= s.x ? 1 : -1
          s.x += dir * SPEED[s.action] * dt
          if ((dir === 1 && s.x >= s.targetX) || (dir === -1 && s.x <= s.targetX)) {
            s.x = s.targetX
            if (s.action === 'dash' || s.action === 'run') {
              setMood('tired')
              setAct('idle')
              s.idleStreak = 1
              window.setTimeout(() => mounted && setMood('normal'), 800)
              clearTimeout(brainTimer)
              brainTimer = window.setTimeout(nextAction, rand(700, 1400))
            } else {
              nextAction()
            }
          }
          break
        }
        case 'jump': {
          s.vy += 900 * dt // gravity
          s.y += s.vy * dt
          if (s.y >= gt) {
            s.y = gt
            s.vy = 0
            nextAction()
          }
          break
        }
        case 'fall': {
          s.vy += 1400 * dt
          s.y += s.vy * dt
          if (s.y >= gt) {
            s.y = gt
            s.vy = 0
            setMood('dizzy')
            setAct('idle')
            window.setTimeout(() => mounted && setMood('normal'), 1100)
            clearTimeout(brainTimer)
            brainTimer = window.setTimeout(nextAction, rand(1000, 1800))
          }
          break
        }
        case 'idle':
        case 'sleep':
          if (s.y < gt) {
            s.y = Math.min(gt, s.y + 400 * dt)
          }
          break
      }

      // 화면 경계 보정
      const mx = maxX()
      if (s.x < MARGIN) s.x = MARGIN
      if (s.x > mx) s.x = mx

      draw()
    }

    // ── 상호작용: 클릭 반응 + 드래그 ────────────────────────
    const el = petRef.current
    let pointerId: number | null = null
    let moved = false
    let downX = 0
    let downY = 0

    const onDown = (e: PointerEvent) => {
      pointerId = e.pointerId
      moved = false
      downX = e.clientX
      downY = e.clientY
      const s = st.current
      s.dragDX = e.clientX - s.x
      s.dragDY = e.clientY - s.y
      el?.setPointerCapture(e.pointerId)
      el?.classList.add('dragging')
    }
    const onMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 4) {
        if (!moved) {
          moved = true
          clearTimeout(brainTimer)
          setMood('surprised')
          setAct('drag')
        }
        const s = st.current
        s.x = Math.min(maxX(), Math.max(MARGIN, e.clientX - s.dragDX))
        s.y = Math.min(groundTop(), Math.max(0, e.clientY - s.dragDY))
        draw()
      }
    }
    const onUp = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      el?.releasePointerCapture(e.pointerId)
      el?.classList.remove('dragging')
      pointerId = null
      const s = st.current
      if (moved) {
        // 집었다 놓음 → 낙하
        setMood('surprised')
        s.vy = 0
        setAct('fall')
      } else {
        // 제자리 클릭 → 좋아요 반응 후 재개
        setMood('happy')
        setAct('idle')
        clearTimeout(brainTimer)
        brainTimer = window.setTimeout(() => {
          if (!mounted) return
          setMood('normal')
          nextAction()
        }, 1200)
      }
    }

    const onResize = () => {
      const s = st.current
      s.x = Math.min(maxX(), s.x)
      if (s.action === 'idle' || s.action === 'sleep') s.y = groundTop()
      draw()
    }

    el?.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', onResize)

    // 눈 깜빡임
    const blinkTimer = window.setInterval(() => {
      if (!mounted) return
      setBlink(true)
      window.setTimeout(() => mounted && setBlink(false), 140)
    }, rand(2600, 5200))

    draw()
    raf = requestAnimationFrame(tick)
    brainTimer = window.setTimeout(nextAction, 900)

    return () => {
      mounted = false
      cancelAnimationFrame(raf)
      clearTimeout(brainTimer)
      clearInterval(blinkTimer)
      el?.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const bubble = BUBBLE[mood]

  return (
    <div className="pet-root" aria-hidden="true">
      <div
        ref={petRef}
        className={`pet action-${action} mood-${mood} ${
          facing === -1 ? 'face-left' : 'face-right'
        }`}
        title="코딩 할때 이거 확인도 안했움"
      >
        <div className="pet-streak">
          <span />
          <span />
          <span />
        </div>
        <div
          className="pet-flip"
          style={{ transform: `scaleX(${facing})` }}
        >
          <div className="pet-body">
            <PetSprite mood={mood} blink={blink} />
          </div>
        </div>
        <div className="pet-shadow" />
        {bubble && <div className="pet-bubble">{bubble}</div>}
      </div>
    </div>
  )
}

/* ── 픽셀아트 스프라이트 (viewBox 72×64) ─────────────────────── */
function PetSprite({ mood, blink }: { mood: Mood; blink: boolean }) {
  const C = {
    outline: '#3f2515',
    dark: '#5f3a22',
    main: '#7b4a2d',
    light: '#976340',
    leg: '#6b4025',
    eye: '#241309',
    white: '#fbe4d3',
  }

  const eyesClosed = mood === 'sleepy' || blink
  const eyeY = 30

  return (
    <svg viewBox="0 0 72 64" shapeRendering="crispEdges">
      {/* 다리 (몸통 뒤) */}
      <g className="pet-leg leg-a" fill={C.leg}>
        <rect x="16" y="46" width="7" height="12" />
        <rect x="40" y="46" width="7" height="12" />
      </g>
      <g className="pet-leg leg-b" fill={C.leg}>
        <rect x="28" y="46" width="7" height="12" />
        <rect x="50" y="46" width="7" height="12" />
      </g>
      {/* 발바닥 그림자 */}
      <g fill={C.outline} opacity="0.5">
        <rect x="16" y="56" width="7" height="2" />
        <rect x="28" y="56" width="7" height="2" />
        <rect x="40" y="56" width="7" height="2" />
        <rect x="50" y="56" width="7" height="2" />
      </g>

      {/* 몸통 */}
      <rect x="9" y="17" width="54" height="34" rx="4" fill={C.outline} />
      <rect x="11" y="19" width="50" height="30" rx="3" fill={C.main} />
      <rect x="13" y="21" width="46" height="9" rx="2" fill={C.light} />
      <rect x="11" y="43" width="50" height="6" rx="2" fill={C.dark} />
      {/* 브라우니 텍스처 점 */}
      <g fill={C.dark} opacity="0.55">
        <rect x="18" y="36" width="3" height="3" />
        <rect x="34" y="39" width="3" height="3" />
        <rect x="49" y="35" width="3" height="3" />
      </g>

      {/* 눈 / 표정 */}
      {eyesClosed ? (
        <g fill={C.eye}>
          <rect x="26" y={eyeY + 3} width="7" height="2" rx="1" />
          <rect x="40" y={eyeY + 3} width="7" height="2" rx="1" />
        </g>
      ) : mood === 'happy' ? (
        <g stroke={C.eye} strokeWidth="2.4" fill="none" strokeLinecap="round">
          <path d="M26 33 l3.5 -4 l3.5 4" />
          <path d="M40 33 l3.5 -4 l3.5 4" />
        </g>
      ) : mood === 'dizzy' ? (
        <g stroke={C.eye} strokeWidth="2.2" strokeLinecap="round">
          <path d="M26 29 l6 6 M32 29 l-6 6" />
          <path d="M40 29 l6 6 M46 29 l-6 6" />
        </g>
      ) : mood === 'surprised' ? (
        <g fill={C.eye}>
          <rect x="26" y={eyeY - 2} width="7" height="10" rx="1.5" />
          <rect x="40" y={eyeY - 2} width="7" height="10" rx="1.5" />
        </g>
      ) : (
        <g fill={C.eye}>
          <rect x="27" y={eyeY} width="5" height="8" rx="1.5" />
          <rect x="41" y={eyeY} width="5" height="8" rx="1.5" />
        </g>
      )}

      {/* 땀방울 (지침) */}
      {mood === 'tired' && (
        <path d="M55 26 q2 4 0 6 q-2 -2 0 -6z" fill="#7cc4f2" fillOpacity="0.9" />
      )}
      {/* 볼 홍조 (좋아) */}
      {mood === 'happy' && (
        <g fill="#e8896a" opacity="0.55">
          <rect x="20" y="35" width="5" height="3" rx="1.5" />
          <rect x="47" y="35" width="5" height="3" rx="1.5" />
        </g>
      )}
    </svg>
  )
}
