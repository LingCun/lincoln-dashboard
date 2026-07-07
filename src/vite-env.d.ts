/// <reference types="vite/client" />

interface DesktopPetBridge {
  /** 커서가 캐릭터 위에 있을 때만 클릭 통과를 해제한다. */
  setInteractive: (on: boolean) => void
  /** 데스크톱 펫을 종료한다. */
  quit: () => void
}

interface Window {
  desktopPet?: DesktopPetBridge
}
