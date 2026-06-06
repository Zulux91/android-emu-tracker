#!/usr/bin/env node
/**
 * fetch_downloads.js
 * Fetches release download counts from GitHub and Gitea APIs for all tracked
 * emulator/driver projects and writes public/data/rankings.json.
 *
 * Run: node scripts/fetch_downloads.js
 * Env: GITHUB_TOKEN — optional; enables authenticated requests + concurrency
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { setTimeout as sleep } from 'timers/promises'

// ─── Project config (edit config/projects.json to add/remove projects) ───────

const { projects: PROJECTS } = JSON.parse(
  readFileSync(new URL('../config/projects.json', import.meta.url), 'utf8')
)

// ─── API helpers ─────────────────────────────────────────────────────────────

const HAS_TOKEN = !!process.env.GITHUB_TOKEN
const CONCURRENCY = 5
const DELAY_MS    = 1200 // between unauthenticated requests

function githubHeaders() {
  const h = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'ranking-emu-bot/1.0',
  }
  if (HAS_TOKEN) h['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

function giteaHeaders() {
  return {
    'Accept': 'application/json',
    'User-Agent': 'ranking-emu-bot/1.0',
  }
}

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`)
  }
  return res.json()
}

async function fetchGithubReleases(repo) {
  const url = `https://api.github.com/repos/${repo}/releases?per_page=100`
  return fetchJson(url, githubHeaders())
}

async function fetchGiteaReleases(apiHost, repo) {
  const url = `${apiHost}/api/v1/repos/${repo}/releases?limit=50&page=1`
  return fetchJson(url, giteaHeaders())
}

async function fetchForgejoReleases(apiHost, repo) {
  const url = `${apiHost}/api/v1/repos/${repo}/releases?limit=50&page=1`
  return fetchJson(url, giteaHeaders())
}

// Forgejo/Gitea CI uploads often record size=0 on assets. Resolve via HEAD request.
async function resolveAssetSizes(assets, headers) {
  return Promise.all(assets.map(async a => {
    if (a.size !== 0) return a
    try {
      const res = await fetch(a.url, { method: 'HEAD', headers })
      const len = parseInt(res.headers.get('content-length') ?? '0', 10)
      return { ...a, size: len || 0 }
    } catch {
      return a
    }
  }))
}

async function fetchManifestDrivers() {
  try {
    const url = 'https://raw.githubusercontent.com/StevenMXZ/Winlator-Contents/main/contents.json'
    const items = await fetchJson(url, { 'User-Agent': 'ranking-emu-bot/1.0' })
    const groups = {}
    for (const item of (Array.isArray(items) ? items : [])) {
      const type = item.type ?? 'Other'
      if (!groups[type]) groups[type] = []
      groups[type].push({
        name: item.verName ?? item.name ?? 'Unknown',
        version: item.verCode ?? item.version ?? '',
        url: item.remoteUrl ?? item.url ?? '',
        date: item.date ?? new Date().toISOString(),
      })
    }
    return groups
  } catch (err) {
    console.error('  [manifest] Failed to fetch driver manifest:', err.message)
    return {}
  }
}

// ─── Release parsing ─────────────────────────────────────────────────────────

function parseReleases(rawReleases, isGitea = false) {
  if (!Array.isArray(rawReleases)) return []
  return rawReleases.map(r => {
    const assets = (r.assets ?? []).map(a => ({
      name:      isGitea ? a.name : a.name,
      size:      a.size ?? 0,
      downloads: isGitea ? (a.download_count ?? 0) : (a.download_count ?? 0),
      url:       isGitea ? a.browser_download_url : a.browser_download_url,
    }))
    const downloads = assets.reduce((sum, a) => sum + (a.downloads ?? 0), 0)
    return {
      name:       r.name ?? r.tag_name ?? '',
      tag:        r.tag_name ?? '',
      date:       r.published_at ?? r.created_at ?? new Date().toISOString(),
      downloads,
      body:       r.body ?? r.body_html ?? '',
      prerelease: r.prerelease ?? false,
      htmlUrl:    r.html_url ?? '',
      assets,
    }
  })
}

// ─── Concurrency helper ───────────────────────────────────────────────────────

async function runWithConcurrency(tasks, limit) {
  const results = []
  const executing = new Set()
  for (const task of tasks) {
    const p = task().then(r => { executing.delete(p); return r })
    executing.add(p)
    results.push(p)
    if (executing.size >= limit) await Promise.race(executing)
  }
  return Promise.all(results)
}

// ─── Per-project fetcher ──────────────────────────────────────────────────────

async function fetchProject(project) {
  const repoUrl = (project.apiType === 'gitea' || project.apiType === 'forgejo')
    ? `${project.apiHost}/${project.repo}`
    : `https://github.com/${project.repo}`

  if (project.skipFetch) {
    console.log(`  [skip] ${project.name}`)
    return {
      name:       project.name,
      repo:       project.repo,
      category:   project.category,
      logo:       project.logo,
      downloads:  0,
      releases:   [],
      repoUrl,
      extensions: project.extensions,
      upstream:   project.upstream,
    }
  }

  try {
    let rawReleases
    if (project.apiType === 'gitea') {
      rawReleases = await fetchGiteaReleases(project.apiHost, project.repo)
    } else if (project.apiType === 'forgejo') {
      rawReleases = await fetchForgejoReleases(project.apiHost, project.repo)
    } else {
      rawReleases = await fetchGithubReleases(project.repo)
    }

    const releases  = parseReleases(rawReleases, project.apiType === 'gitea' || project.apiType === 'forgejo')
    if (project.apiType === 'forgejo' || project.apiType === 'gitea') {
      for (const release of releases) {
        release.assets = await resolveAssetSizes(release.assets, giteaHeaders())
      }
    }
    const capped    = releases.slice(0, 20).map((r, i) => ({ ...r, body: i < 5 ? r.body : '' }))
    const downloads = capped.reduce((sum, r) => sum + r.downloads, 0)

    console.log(`  [ok]   ${project.name} — ${downloads.toLocaleString()} downloads, ${releases.length} releases`)
    return {
      name:       project.name,
      repo:       project.repo,
      category:   project.category,
      logo:       project.logo,
      downloads,
      releases:   capped,
      repoUrl,
      extensions: project.extensions,
      upstream:   project.upstream,
    }
  } catch (err) {
    console.error(`  [err]  ${project.name} — ${err.message}`)
    return {
      name:       project.name,
      repo:       project.repo,
      category:   project.category,
      logo:       project.logo,
      downloads:  0,
      releases:   [],
      repoUrl,
      extensions: project.extensions,
      upstream:   project.upstream,
      fetchError: err.message,
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nFetching ${PROJECTS.length} projects (${HAS_TOKEN ? 'authenticated, concurrent' : 'unauthenticated, sequential'})…\n`)
  const startTime = Date.now()

  let results

  if (HAS_TOKEN) {
    const tasks = PROJECTS.map(p => () => fetchProject(p))
    results = await runWithConcurrency(tasks, CONCURRENCY)
  } else {
    results = []
    for (const project of PROJECTS) {
      results.push(await fetchProject(project))
      if (results.length < PROJECTS.length) await sleep(DELAY_MS)
    }
  }

  // Fetch manifest drivers in parallel with main fetch (already done after)
  const manifestDrivers = await fetchManifestDrivers()

  // Sort by downloads descending
  results.sort((a, b) => b.downloads - a.downloads)

  const projectsWithReleases = results.filter(r => r.releases.length > 0 && !r.fetchError).length
  const projectsWithoutReleases = results.length - projectsWithReleases

  const updatedAt = new Date().toISOString()
  const output = {
    updatedAt,
    nextUpdateAt:            new Date(Date.now() + (Number(process.env.FETCH_INTERVAL_MINUTES) || 60) * 60_000).toISOString(),
    totalProjects:           results.length,
    projectsWithReleases,
    projectsWithoutReleases,
    results,
    manifestDrivers,
  }

  mkdirSync('public/data', { recursive: true })
  writeFileSync('public/data/rankings.json', JSON.stringify(output, null, 2), 'utf-8')

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\nDone in ${elapsed}s — ${projectsWithReleases}/${results.length} projects with releases`)
  console.log(`Output: public/data/rankings.json`)

  const failed = results.filter(r => r.fetchError)
  if (failed.length > 0) {
    console.warn(`\nFailed (${failed.length}):`)
    for (const f of failed) console.warn(`  - ${f.name}: ${f.fetchError}`)
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
