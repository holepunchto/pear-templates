/** @typedef {import('pear-interface')} */ /* global Pear */
import Runtime from 'pear-electron'
import Bridge from 'pear-bridge'
import updates from 'pear-updates'
import { buildFile } from './build.js'

const isDev = Pear.config.dev

const bridge = new Bridge({
  mount: '/dist',
  bypass: ['/node_modules', '/dist']
})
await bridge.ready()

const runtime = new Runtime()
const pipe = await runtime.start({ bridge })
pipe.on('close', () => Pear.exit())

pipe.on('data', (data) => {
  const cmd = Buffer.from(data).toString()
  if (cmd === 'hello from ui') pipe.write('sweet bidirectionality')
  console.log('PIPE DATA', data + '')
})

pipe.write('hello from app')

updates(async (update) => {
  console.log('Application update available:', update)

  if (isDev && update.diff) {
    for (const change of update.diff) {
      if (change.type === 'update' && change.key.startsWith('/src/')) {
        try {
          const srcPath = '.' + change.key
          console.log('Rebuilding:', srcPath)
          await buildFile(srcPath)
        } catch (err) {
          console.error('Build error:', err)
        }
      }
    }
  }
})
