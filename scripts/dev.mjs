// npm run dev -- 20261202_DiesAcademicus   (defaults to the newest talk)
import { spawnSync } from 'node:child_process'
import { listTalks } from './talk.mjs'

const talks = listTalks()
const slug = process.argv[2] ?? talks[0]
if (!talks.includes(slug)) {
  console.error(`Unknown talk "${slug}". Available: ${talks.join(', ')}`)
  process.exit(1)
}
const result = spawnSync('npx', ['slidev', `talks/${slug}/slides.md`, ...process.argv.slice(3)], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
process.exit(result.status ?? 0)
