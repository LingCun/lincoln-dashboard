import { useEffect, useState } from 'react'
import { Card } from '../components/Card'

interface WeatherState {
  status: 'idle' | 'loading' | 'ready' | 'error'
  temp?: number
  feels?: number
  code?: number
  wind?: number
  place?: string
  message?: string
}

/** Maps WMO weather codes to an emoji + Korean label. */
function describe(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: '맑음' }
  if (code <= 2) return { icon: '🌤️', label: '대체로 맑음' }
  if (code === 3) return { icon: '☁️', label: '흐림' }
  if (code <= 48) return { icon: '🌫️', label: '안개' }
  if (code <= 57) return { icon: '🌦️', label: '이슬비' }
  if (code <= 67) return { icon: '🌧️', label: '비' }
  if (code <= 77) return { icon: '🌨️', label: '눈' }
  if (code <= 82) return { icon: '🌧️', label: '소나기' }
  if (code <= 86) return { icon: '🌨️', label: '눈 소나기' }
  return { icon: '⛈️', label: '뇌우' }
}

const SEOUL = { lat: 37.5665, lon: 126.978, place: '서울' }

export function WeatherWidget() {
  const [state, setState] = useState<WeatherState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load(lat: number, lon: number, place?: string) {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`
        const res = await fetch(url)
        if (!res.ok) throw new Error('네트워크 오류')
        const data = await res.json()
        const c = data.current
        if (cancelled) return
        setState({
          status: 'ready',
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          code: c.weather_code,
          wind: Math.round(c.wind_speed_10m),
          place: place ?? `${lat.toFixed(1)}, ${lon.toFixed(1)}`,
        })
      } catch (err) {
        if (!cancelled)
          setState({ status: 'error', message: (err as Error).message })
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude, '현재 위치'),
        () => load(SEOUL.lat, SEOUL.lon, SEOUL.place),
        { timeout: 5000 },
      )
    } else {
      load(SEOUL.lat, SEOUL.lon, SEOUL.place)
    }

    return () => {
      cancelled = true
    }
  }, [])

  const weather = state.code !== undefined ? describe(state.code) : null

  return (
    <Card title="날씨" icon={<span aria-hidden>🌦️</span>}>
      {state.status === 'loading' && (
        <p className="text-sm text-slate-400">날씨 정보를 불러오는 중…</p>
      )}
      {state.status === 'error' && (
        <p className="text-sm text-rose-500">불러오기 실패: {state.message}</p>
      )}
      {state.status === 'ready' && weather && (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {state.temp}°
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {weather.label}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              체감 {state.feels}° · 바람 {state.wind}km/h · {state.place}
            </p>
          </div>
          <span className="text-5xl" aria-hidden>
            {weather.icon}
          </span>
        </div>
      )}
    </Card>
  )
}
