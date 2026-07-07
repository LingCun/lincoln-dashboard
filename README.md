# Desktop Pet 🐾

바탕화면 위를 **자유롭게 돌아다니는 픽셀 캐릭터** 데스크톱 펫. 갈색 브라우니
블록 캐릭터가 화면 아래를 걷고 · 뛰고 · 점프하고 · 졸며, 클릭하거나 집어
옮길 수 있습니다. Electron 으로 투명 · 항상 위 · 클릭 통과 창을 띄워, 평소엔
바탕화면과 아이콘을 그대로 쓰다가 커서를 캐릭터에 올렸을 때만 상호작용합니다.

## 동작

- **자율 이동** — 걷기 · 달리기 · 대쉬 · 점프 · 대기 · 잠자기를 스스로 반복하며
  이동 방향을 바라봅니다.
- **클릭** — 좋아요 반응(❤️)
- **드래그** — 집어 올렸다 놓으면 떨어져서 착지하며 어질어질(😵) 해집니다.
- 눈 깜빡임, 달릴 때 속도선, 감정 말풍선 등 세부 표현 포함.
- `prefers-reduced-motion` 을 존중합니다.

## 실행

```bash
npm install      # 의존성 설치 (Electron 바이너리 자동 다운로드)
npm run dev      # Vite + Electron 동시 실행 → 바탕화면에 캐릭터 등장
```

종료는 시스템 트레이 아이콘 → **종료**, 또는 `Ctrl/Cmd + Shift + Q`.

### 빌드 / 패키징

```bash
npm run build    # 렌더러 빌드 → dist/
npm start        # 빌드 후 Electron 으로 실행
npm run pack     # electron-builder 로 설치 파일 생성 → release/
```

> 브라우저에서 캐릭터만 미리 보고 싶다면 `npm run dev:renderer` 후
> http://localhost:5173 접속. (클릭 통과 등 데스크톱 기능은 Electron 에서만 동작)

## 기술 스택

- [Electron 33](https://www.electronjs.org) — 투명 · 클릭 통과 데스크톱 오버레이 창
- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) — 캐릭터 렌더러
- [Vite 5](https://vite.dev) — 빌드 도구
- 캐릭터는 순수 SVG 픽셀아트 + CSS 키프레임 애니메이션 (외부 스프라이트 에셋 없음)

## 구조

```
electron/
├─ main.cjs        # 투명·항상 위·클릭 통과 창, 트레이, 종료 단축키
├─ preload.cjs     # 렌더러 ↔ 메인 안전한 브릿지 (setInteractive / quit)
└─ pet-icon.png    # 트레이 아이콘 (캐릭터 모양)
src/
├─ main.tsx                 # 캐릭터만 마운트
├─ components/DesktopPet.tsx # 캐릭터 스프라이트 + 이동/상호작용 로직
└─ index.css                # 투명 배경 + 캐릭터 애니메이션
```

## 작동 원리

Electron 메인은 기본적으로 창을 `setIgnoreMouseEvents(true, { forward: true })`
로 두어 마우스가 바탕화면으로 통과되게 합니다. 렌더러는 커서가 캐릭터 위에
있을 때만 `preload` 브릿지를 통해 상호작용을 켜, 캐릭터를 클릭 · 드래그할 수
있게 합니다.
