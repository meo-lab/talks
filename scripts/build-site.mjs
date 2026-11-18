import { copyFileSync, cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { listTalks, readMeta, rootDir } from './talk.mjs'

// GitHub Pages project site: https://<org>.github.io/talks/  (override with SITE_BASE)
const siteBase = process.env.SITE_BASE ?? '/talks/'
const distDir = resolve(rootDir, 'dist')
const tempDir = resolve(rootDir, 'tmp-slidev-build')

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0)
    process.exit(result.status ?? 1)
}

const escapeHtml = text => text.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function formatDate(date) {
  const m = date.match(/^(\d{4})-?(\d{2})-?(\d{2})/)
  return m ? `${m[3]}.${m[2]}.${m[1]}` : date
}

function indexHtml(talks) {
  const items = talks.map(t => `
      <li>
        <a href="./${t.slug}/">
          <span class="date">${escapeHtml(formatDate(t.date))}</span>
          <span class="title">${escapeHtml(t.title)}</span>
          ${t.event ? `<span class="event">${escapeHtml(t.event)}</span>` : ''}
        </a>
        <a class="pdf" href="./${t.slug}/slides.pdf">PDF</a>
      </li>`).join('')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Talks — Marc Rußwurm</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; color: #222; background: #fff; }
    main { max-width: 760px; margin: 0 auto; padding: 64px 24px; }
    h1 { color: #00457c; border-bottom: 4px solid #f2c300; padding-bottom: 12px; }
    ul { list-style: none; padding: 0; }
    li { display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #d7d9d8; padding: 14px 0; }
    li > a:first-child { flex: 1; display: grid; grid-template-columns: 110px 1fr; gap: 2px 16px; text-decoration: none; color: inherit; }
    .date { color: #5f625f; grid-row: 1 / 3; }
    .title { font-weight: 700; color: #00457c; }
    .event { color: #5f625f; font-size: .9rem; }
    .pdf { font-size: .8rem; color: #00457c; }
  </style>
</head>
<body>
  <main>
    <h1>Talks</h1>
    <ul>${items}
    </ul>
  </main>
</body>
</html>
`
}

const talks = listTalks().map(readMeta)
if (talks.length === 0) {
  console.error('No talks found in talks/*/slides.md')
  process.exit(1)
}

rmSync(distDir, { recursive: true, force: true })
rmSync(tempDir, { recursive: true, force: true })
mkdirSync(distDir, { recursive: true })
mkdirSync(tempDir, { recursive: true })

for (const talk of talks) {
  const out = resolve(tempDir, talk.slug)
  const dest = resolve(distDir, talk.slug)
  run('npx', ['slidev', 'build', talk.entry, '--base', `${siteBase}${talk.slug}/`, '--out', out])
  cpSync(out, dest, { recursive: true })
  for (const route of ['presenter', 'overview']) {
    mkdirSync(resolve(dest, route), { recursive: true })
    copyFileSync(resolve(dest, 'index.html'), resolve(dest, route, 'index.html'))
  }
}

writeFileSync(resolve(distDir, 'index.html'), indexHtml(talks))
writeFileSync(resolve(distDir, '.nojekyll'), '')
rmSync(tempDir, { recursive: true, force: true })
console.log(`Built ${talks.length} talk(s) into dist/`)
