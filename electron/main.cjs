// Desktop Pet — Electron 메인 프로세스
// 투명 · 프레임리스 · 항상 위 · 클릭 통과 창을 바탕화면 위에 띄우고,
// 그 안에서 캐릭터(렌더러)가 자유롭게 돌아다닌다.
const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  Tray,
  Menu,
  nativeImage,
  globalShortcut,
} = require('electron')
const path = require('node:path')

const DEV_URL = process.env.ELECTRON_START_URL // 개발 시 Vite dev 서버 주소

let win = null
let tray = null

function createWindow() {
  const primary = screen.getPrimaryDisplay()
  const { x, y, width, height } = primary.workArea

  win = new BrowserWindow({
    x,
    y,
    width,
    height,
    transparent: true,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    alwaysOnTop: true,
    // 배경을 완전히 투명하게 (일부 플랫폼에서 필요)
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // 모든 가상 데스크톱/전체화면 앱 위에 표시
  win.setAlwaysOnTop(true, 'screen-saver')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  // 기본은 클릭 통과(바탕화면/아이콘을 그대로 쓸 수 있게) —
  // 렌더러가 커서가 캐릭터 위에 있을 때만 통과를 해제한다.
  win.setIgnoreMouseEvents(true, { forward: true })

  if (DEV_URL) {
    win.loadURL(DEV_URL)
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  win.on('closed', () => {
    win = null
  })
}

function createTray() {
  // 트레이 아이콘: 캐릭터를 닮은 작은 갈색 블록
  const icon = nativeImage.createFromPath(path.join(__dirname, 'pet-icon.png'))
  tray = new Tray(icon)
  tray.setToolTip('Desktop Pet')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: '데스크톱 펫', enabled: false },
      { type: 'separator' },
      { label: '종료', click: () => app.quit() },
    ]),
  )
}

// 한 인스턴스만 실행
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.whenReady().then(() => {
    createWindow()
    createTray()

    // 커서가 캐릭터 위에 있을 때만 클릭을 받도록 렌더러가 토글
    ipcMain.on('pet:interactive', (_e, on) => {
      if (win) win.setIgnoreMouseEvents(!on, { forward: true })
    })
    ipcMain.on('pet:quit', () => app.quit())

    // 비상 종료 단축키
    globalShortcut.register('CommandOrControl+Shift+Q', () => app.quit())

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // 트레이 앱이므로 창을 모두 닫아도 종료하지 않음
  app.on('window-all-closed', () => {})
  app.on('will-quit', () => globalShortcut.unregisterAll())
}
