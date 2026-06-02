#!/usr/bin/env node
/**
 * generate_readme.js
 * Generates README.md from public/data/rankings.json.
 * The Managing Projects section is embedded here and survives every CI run.
 */

import { readFileSync, writeFileSync } from 'fs'

function formatNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function medal(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return String(rank)
}

const raw = JSON.parse(readFileSync('public/data/rankings.json', 'utf8'))

// Handle both legacy array form and current object form
const results = Array.isArray(raw) ? raw : (raw.results ?? [])
const updatedAt = raw.updatedAt ?? new Date().toISOString()
const date = new Date(updatedAt).toISOString().split('T')[0]

const sorted = [...results].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0))

const rows = sorted.map((p, i) => {
  const rank   = i + 1
  const latest = p.releases?.[0]
  const tag    = latest?.tag ?? '—'
  const dl     = formatNum(p.downloads ?? 0)
  return `| ${medal(rank)} | ${p.name} | ${dl} | \`${tag}\` | ${p.category ?? ''} |`
}).join('\n')

const readme = `# Arcade Aurora Glass — Emulator Download Rankings

![Auto-updated](https://img.shields.io/badge/auto--updated-hourly-26f7ff?style=flat-square)
![Projects](https://img.shields.io/badge/projects-${sorted.length}-9b5cff?style=flat-square)
![Last update](https://img.shields.io/badge/updated-${date}-9dff57?style=flat-square)

> Download statistics auto-fetched hourly from GitHub and Gitea release assets.
> Deploy the static dashboard at \`docs/\` on GitHub Pages, Netlify, or Vercel.

## Global Ranking

| Rank | Project | Downloads | Latest | Category |
|------|---------|-----------|--------|----------|
${rows}

## Setup

\`\`\`bash
npm install
npm run fetch    # fetch rankings.json from GitHub/Gitea APIs  (~75s without token)
npm run build    # build static site to docs/
npm run dev      # local dev server at localhost:5173
\`\`\`

## Managing Projects

All tracked projects live in one file: **\`config/projects.json\`**

Open it, find the \`"projects"\` array, and add or remove entries.
The \`"_instructions"\` key at the top of that file documents every available field.

### Add a project

\`\`\`json
{ "name": "My Emulator", "repo": "owner/repo", "category": "PC Emulator" }
\`\`\`

Then run:

\`\`\`bash
npm run fetch   # pulls fresh data from GitHub/Gitea
npm run build   # rebuilds the static site into docs/
\`\`\`

Push the result — GitHub Actions will keep it updated hourly from then on.

### Common optional fields

| Field | Purpose | Example |
|-------|---------|---------|
| \`logo\` | Image shown in the ranking | \`"gamehub.png"\` — file goes in \`public/logos/\` |
| \`extensions\` | Extra valid download types beyond \`.apk\` | \`[".zip"]\`, \`[".wcp"]\`, \`[".tar.gz"]\` |
| \`apiType\` + \`apiHost\` | For Gitea repos instead of GitHub | \`"gitea"\`, \`"https://git.citron-emu.org"\` |
| \`skipFetch\` | Show the project without fetching releases | \`true\` |
| \`upstream\` | Group related forks together | \`"winlator"\` |

### Remove a project

Delete its line from the \`"projects"\` array in \`config/projects.json\`, then run \`npm run fetch && npm run build\`.

### Known categories

\`GameHub\` · \`Winlator\` · \`Drivers\` · \`PC Emulator\` · \`GameNative\`
\`Nintendo Switch Emulator\` · \`Nintendo 3DS\` · \`Emulator PS3\` · \`Emulator PS2\`
\`PSVITA\` · \`Wii U Emulator\` · \`Xbox\` · \`Nintendo GameCube / Wii\`
\`Sega Dreamcast\` · \`All In One\`

Inventing a new category string is fine — it automatically appears as a filter option in the dashboard.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| \`GITHUB_TOKEN\` | Authenticated GitHub API (5,000 req/hr vs 60). Set in repo secrets for CI. |
| \`VITE_ENABLE_COUNTERS\` | Enable visitor counters (default: false) |

## Methodology

- Downloads are calculated by summing \`download_count\` from every release asset.
- Only assets matching a project's valid extensions are counted (default: \`.apk\`; drivers add \`.zip\`, \`.wcp\`, etc.)
- Data updates automatically every hour via GitHub Actions.
- Projects showing 0 downloads have no public releases or the API was unavailable at last fetch.

_Last auto-generated: ${updatedAt}_
`

writeFileSync('README.md', readme, 'utf-8')
console.log(`README.md generated — ${sorted.length} projects, updated ${date}`)
