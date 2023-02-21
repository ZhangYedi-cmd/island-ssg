import { createRoot } from 'react-dom/client'
import { App } from './App'
import siteConfig from 'island:site-data'

//CSR 入口
function renderInBrowser() {
  console.log(siteConfig)
  const containerEl = document.getElementById('root')
  if (!containerEl) {
    throw new Error('#root element not found')
  }
  createRoot(containerEl).render(<App />)
}

renderInBrowser()
