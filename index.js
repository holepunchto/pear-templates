import fsp from 'bare-fs/promises'
import os from 'bare-os'
import { basename, resolve } from 'bare-path'
import { ansi, outputter, permit, explain } from 'pear-terminal'
import { command, bail } from 'paparam'
import init from 'pear-init'
import pipe from 'pear-pipe'
import { pear } from './package.json' with { type: 'json' }

const output = outputter('init', {
  writing: () => '',
  wrote: ({ path }) => `* ${path}`,
  written: () => ''
})

const program = command(
  'init',
  pear.platform.command,
  async function (cmd) {
    const cwd = os.cwd()
    const { yes, force, ask } = cmd.flags
    const dir = cmd.args.dir ? resolve(cwd, cmd.args.dir) : cwd
    let dirStat = null
    try {
      dirStat = await fsp.stat(dir)
    } catch {}
    const pkgPath = resolve(dir, 'package.json')
    let pkg = null
    const dirExists = dirStat !== null && dirStat.isDirectory()
    if (dirExists) {
      try {
        pkg = JSON.parse(await fsp.readFile(pkgPath))
      } catch {}
    }

    const cfg = pkg?.pear || {}
    const name = cfg?.name || pkg?.name || basename(dir)
    const link = cmd.args.link || 'default'

    const defaults = { name }

    const banner = `${ansi.bold(name)} ~ ${ansi.dim('Welcome to the Internet of Peers')}`
    let header = `\n${banner}${ansi.dim('›')}\n\n`
    if (force) header += ansi.bold('FORCE MODE\n\n')

    const cmdArgs = cmd.argv

    try {
      await output(
        false,
        init(link, {
          dir,
          cwd,
          autosubmit: yes,
          ask,
          force,
          defaults,
          header,
          pkg,
          cmdArgs
        })
      )
    } catch (err) {
      if (err.info?.code !== 'ERR_PERMISSION_REQUIRED' || !ask) throw err
      await permit(Pear.constructor[Pear.constructor.IPC], err.info, 'init')
    } finally {
      pipe().end()
    }
  },
  bail(explain)
)



program.parse(Pear.app.args)