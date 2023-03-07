import {createRoot} from 'react-dom/client'
import {App} from './App'
// import siteConfig from 'island:site-data'
import {BrowserRouter} from 'react-router-dom'

//CSR 入口
function renderInBrowser() {
  const containerEl = document.getElementById('root')
  if (!containerEl) {
    throw new Error('#root element not found')
  }
  createRoot(containerEl).render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  )
}

renderInBrowser()
