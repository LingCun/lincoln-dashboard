import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DesktopPet } from './components/DesktopPet'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesktopPet />
  </StrictMode>,
)
