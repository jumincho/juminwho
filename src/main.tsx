import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import 'virtual:hangul-font.css'
import './styles/tokens.css'
import './styles/tones.css'
import './styles/global.css'
import App from './App'
import LanguageProvider from './components/LanguageProvider'
import { followSystemTheme } from './lib/theme'

followSystemTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
