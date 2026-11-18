// Shared helpers: discover talks under talks/<folder>/slides.md
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const rootDir = process.cwd()
export const talksDir = resolve(rootDir, 'talks')

export function listTalks() {
  return readdirSync(talksDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(resolve(talksDir, entry.name, 'slides.md')))
    .map(entry => entry.name)
    .sort()
    .reverse() // newest first (folders start with YYYYMMDD)
}

export function readMeta(slug) {
  const source = readFileSync(resolve(talksDir, slug, 'slides.md'), 'utf8')
  const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const pick = key => front.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^["']|["']$/g, '')
  return {
    slug,
    entry: `talks/${slug}/slides.md`,
    title: pick('title') ?? slug,
    date: pick('date') ?? slug.slice(0, 8),
    event: pick('event') ?? '',
  }
}
