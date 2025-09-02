import { createRoot } from 'react-dom/client'
import debounce from 'debounceify'
import App from './app.js'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

const reload = debounce(() => window.location.reload(), 50)

Pear.updates((updates) => {
  for (const change of updates.diff) {
    if (change.type === 'update' && change.key.startsWith('/dist/')) {
      reload()
    }
  }
})
