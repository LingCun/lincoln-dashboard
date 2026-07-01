# Lincoln Dashboard

React + Vite + TypeScript 로 만든 **개인 대시보드**. 자주 쓰는 위젯을 한 화면에 모아
브라우저에서 바로 사용할 수 있습니다. 모든 데이터는 서버 없이 브라우저
`localStorage` 에만 저장됩니다.

## 위젯

| 위젯 | 설명 |
| --- | --- |
| ⏰ 시계 / 인사 | 실시간 시계, 날짜, 시간대별 인사말 |
| 🌦️ 날씨 | 현재 위치(또는 서울) 기준 실시간 날씨 — [Open-Meteo](https://open-meteo.com) (API 키 불필요) |
| 💬 오늘의 명언 | 매일 바뀌는 명언 |
| ✅ 할 일 | 체크 가능한 투두 리스트 (자동 저장) |
| 🍅 포모도로 | 25분 집중 / 5분 휴식 타이머 |
| 📝 메모 | 자동 저장되는 자유 메모장 |
| 🔖 즐겨찾기 | 자주 쓰는 링크 모음 (추가/삭제 가능) |

라이트/다크 테마 전환과 이름 커스터마이징을 지원합니다.

## 개발

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

## 기술 스택

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 5](https://vite.dev) — 빌드 도구
- [Tailwind CSS 3](https://tailwindcss.com) — 스타일링

## 구조

```
src/
├─ App.tsx              # 레이아웃 · 헤더 · 위젯 배치
├─ components/Card.tsx  # 공통 위젯 컨테이너
├─ hooks/               # useLocalStorage · useNow · useTheme
└─ widgets/             # 각 대시보드 위젯
```
