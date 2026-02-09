import Runtime from 'pear-electron'
import Bridge from 'pear-bridge'

// Auto-rebuild when in development
const onDisk = Pear.app.key === null
if (onDisk) await import('./dev.js')

// Bridge is how your app window communicates to its background Pear process (you are here)
const bridge = new Bridge()
await bridge.ready()

const runtime = new Runtime()

// Launch the main Electron window, connect to here through bridge
const pipe = await runtime.start({ bridge })

// When window closes
pipe.on('end', () => Pear.exit())
