import { useState } from 'react'
import TitleBar from './components/title-bar'

function App() {
  const [emoji, setEmoji] = useState('🐻')

  return (
    <main>
      <TitleBar />

      <div>
        <h1>{emoji}</h1>
        <button onClick={() => setEmoji(emoji === '🐻' ? '🍐' : '🐻')}>
          Toggle
        </button>
      </div>
    </main>
  )
}

export default App
