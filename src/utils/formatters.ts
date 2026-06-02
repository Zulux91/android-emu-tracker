export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en', { notation: n >= 1_000_000 ? 'compact' : 'standard' }).format(n)
}

export function formatNumberFull(n: number): string {
  return new Intl.NumberFormat('en').format(n)
}

export function timeAgo(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime()
  const s  = Math.floor(ms / 1000)
  const m  = Math.floor(s / 60)
  const h  = Math.floor(m / 60)
  const d  = Math.floor(h / 24)
  const w  = Math.floor(d / 7)
  const mo = Math.floor(d / 30)
  const yr = Math.floor(d / 365)
  if (s < 60)  return 'just now'
  if (m < 60)  return `${m}m ago`
  if (h < 24)  return `${h}h ago`
  if (d < 7)   return `${d}d ago`
  if (w < 5)   return `${w}w ago`
  if (mo < 12) return `${mo}mo ago`
  return `${yr}y ago`
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(isoDate))
}

export function isWithinDays(isoDate: string, days: number): boolean {
  return Date.now() - new Date(isoDate).getTime() < days * 86_400_000
}
