import fs from 'fs'
import path from 'path'
import babel from '@babel/standalone'

const SRC_DIR = './src'

function transform(code) {
  return babel.transform(code, {
    presets: [['env', { modules: false }], 'react'],
    plugins: [['transform-react-jsx', { runtime: 'automatic' }]]
  }).code
}

function getAllFiles(dir) {
  const files = []
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath))
    } else {
      files.push(fullPath)
    }
  }
  return files
}

fs.mkdirSync('dist', { recursive: true })

for (const file of getAllFiles(SRC_DIR)) {
  const outPath = path.join('dist', path.relative(SRC_DIR, file))
  fs.mkdirSync(path.dirname(outPath), { recursive: true })

  if (file.endsWith('.js') || file.endsWith('.jsx')) {
    fs.writeFileSync(
      outPath.replace('.jsx', '.js'),
      transform(fs.readFileSync(file, 'utf8'))
    )
  } else {
    fs.writeFileSync(outPath, fs.readFileSync(file))
  }
}

await import('pear-electron/pre')
