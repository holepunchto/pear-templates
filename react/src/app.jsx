import { useState } from 'react'
import TitleBar from './ui/TitleBar'
import Button from './ui/Button'

function App() {
  const [emoji, setEmoji] = useState('desktop')

  return (
    <main>
      <pear-ctrl></pear-ctrl>
      <div>
        <h1>{emoji}</h1>
        <Button
          onClick={() => setEmoji(emoji === 'desktop' ? '🍐' : 'desktop')}
        >
          Toggle
        </Button>
      </div>
    </main>
  )
}

export default App
