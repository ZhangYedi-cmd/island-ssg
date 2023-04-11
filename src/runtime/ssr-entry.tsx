import { renderToString } from 'react-dom/server'
import { App } from './App'
import { StaticRouter } from 'react-router-dom/server';

// SSR入口
// export const render = () => renderToString(<App/>)
export function render() {
  return renderToString(
    <StaticRouter location={'/guide/a'}>
      <App />
    </StaticRouter>
  )
}
