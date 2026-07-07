// 렌더러 ↔ 메인 안전한 브릿지
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktopPet', {
  setInteractive: (on) => ipcRenderer.send('pet:interactive', !!on),
  quit: () => ipcRenderer.send('pet:quit'),
})
