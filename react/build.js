import { promises as fs } from 'fs'
import path from 'path'
import babel from '@babel/standalone'

const SRC_DIR = './src'
const DIST_DIR = './dist'

export function transform(code) {
  return babel.transform(code, {
    presets: [['env', { modules: false }], 'react'],
    plugins: [['transform-react-jsx', { runtime: 'automatic' }]]
  }).code
}

export async function getAllFiles(dir) {
  const files = []
  const entries = await fs.readdir(dir)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stats = await fs.stat(fullPath)

    if (stats.isDirectory()) {
      const subFiles = await getAllFiles(fullPath)
      files.push(...subFiles)
    } else {
      files.push(fullPath)
    }
  }

  return files
}

export async function buildFile(srcPath) {
  const relativePath = path.relative(SRC_DIR, srcPath)
  const outPath = path.join(DIST_DIR, relativePath)

  await fs.mkdir(path.dirname(outPath), { recursive: true })

  if (srcPath.endsWith('.js') || srcPath.endsWith('.jsx')) {
    const code = await fs.readFile(srcPath, 'utf8')
    const transformed = transform(code)
    await fs.writeFile(outPath.replace('.jsx', '.js'), transformed)
  } else {
    const content = await fs.readFile(srcPath)
    await fs.writeFile(outPath, content)
  }
}

export async function buildAll() {
  await fs.mkdir(DIST_DIR, { recursive: true })
  const files = await getAllFiles(SRC_DIR)
  await Promise.all(files.map((file) => buildFile(file)))
}
