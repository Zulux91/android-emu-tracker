import { useEffect, useRef, useState, useCallback } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { ProjectResult, Release, ReleaseAsset } from '../types/rankings'
import type { TranslationKeys } from '../i18n/en'
import { formatBytes, formatNumber, formatDate, isWithinDays } from '../utils/formatters'
import { getCategoryPillClass, getValidAssets } from '../utils/assetFilters'

interface Props {
  project: ProjectResult
  onClose: () => void
  t: (section: keyof TranslationKeys, key: string) => string
}

function ReleaseBody({ body }: { body: string }) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    if (!body) { setHtml(''); return }
    Promise.resolve(marked.parse(body))
      .then(raw => setHtml(DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['p','br','strong','em','a','ul','ol','li','h1','h2','h3','h4','code','pre','blockquote'], ALLOWED_ATTR: ['href','target','rel'] })))
      .catch(() => setHtml(''))
  }, [body])
  if (!html) return null
  return <div className="release-body" dangerouslySetInnerHTML={{ __html: html }} />
}

function CopyButton({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard may be unavailable */ }
  }
  return (
    <button className="btn btn-copy" onClick={handleCopy} aria-label={label} title={label}>
      {copied ? '✓' : '⎘'}
    </button>
  )
}

function AssetRow({ asset, t }: { asset: ReleaseAsset; t: Props['t'] }) {
  return (
    <div className="asset-row">
      <div className="asset-info">
        <span className="asset-name">{asset.name}</span>
        <span className="asset-meta text-muted">
          {formatBytes(asset.size)} · {formatNumber(asset.downloads)} {t('modal', 'totalDownloads')}
        </span>
      </div>
      <div className="asset-actions">
        <a
          className="btn btn-download"
          href={asset.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t('modal', 'download')} ${asset.name}`}
        >
          {t('modal', 'download')} ↓
        </a>
        <CopyButton url={asset.url} label={`${t('modal', 'copy')} ${asset.name}`} />
      </div>
    </div>
  )
}

function ReleaseCard({ release, project, t }: { release: Release; project: ProjectResult; t: Props['t'] }) {
  const validAssets = getValidAssets(release.assets, project.extensions)
  const isNew = isWithinDays(release.date, 7)

  return (
    <div className="release-card">
      <div className="release-header">
        <div className="release-title-row">
          <span className="release-tag">{release.tag}</span>
          {release.name && release.name !== release.tag && (
            <span className="release-name text-muted">{release.name}</span>
          )}
          {isNew && <span className="badge-new">{t('modal', 'new')}</span>}
          {release.prerelease && <span className="badge-pre">{t('modal', 'prerelease')}</span>}
        </div>
        <div className="release-meta">
          <span className="text-muted">{formatDate(release.date)}</span>
          <span className="text-cyan">{formatNumber(release.downloads)} ↓</span>
        </div>
      </div>

      {release.body && <ReleaseBody body={release.body} />}

      {validAssets.length > 0 ? (
        <div className="asset-list">
          <p className="asset-list-title">{t('modal', 'assets')}</p>
          {validAssets.map(asset => (
            <AssetRow key={asset.name} asset={asset} t={t} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function ProjectModal({ project, onClose, t }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Focus close button on open
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // Escape closes, focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key !== 'Tab') return
    const modal = modalRef.current
    if (!modal) return
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last?.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first?.focus() }
    }
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const releases = project.releases.slice(0, 20) // cap for performance

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
    >
      <div
        className="modal-panel glass-modal"
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="modal-head">
          <div className="modal-title-area">
            <h2 className="modal-title">{project.name}</h2>
            <span className={`category-pill ${getCategoryPillClass(project.category)}`}>
              {project.category}
            </span>
          </div>
          <div className="modal-head-meta">
            <span className="text-cyan modal-total-dl">
              {formatNumber(project.downloads)} {t('modal', 'totalDownloads')}
            </span>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              aria-label={t('modal', 'viewOnGitHub')}
            >
              {t('modal', 'viewOnGitHub')} ↗
            </a>
          </div>
          <button
            ref={closeRef}
            className="modal-close btn"
            onClick={onClose}
            aria-label={t('modal', 'close')}
          >
            ✕
          </button>
        </div>

        {/* Releases */}
        <div className="modal-body">
          {releases.length === 0 ? (
            <div className="empty-state">
              <p>{t('modal', 'noReleases')}</p>
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn">
                {t('modal', 'viewOnGitHub')} ↗
              </a>
            </div>
          ) : (
            <div className="releases-list">
              {releases.map((r, i) => (
                <ReleaseCard key={`${r.tag}-${i}`} release={r} project={project} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
