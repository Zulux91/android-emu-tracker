import type { ReleaseAsset } from '../types/rankings'

const DEFAULT_EXTENSIONS = ['.apk']

// GitHub auto-generates these; they are not real release assets
const SOURCE_ARCHIVE_NAMES = ['source code.zip', 'source code.tar.gz']

export function getExtension(filename: string): string {
  const lower = filename.toLowerCase()
  // Handle double extensions like .wcp.xz, .tar.gz
  if (lower.endsWith('.tar.gz')) return '.tar.gz'
  if (lower.endsWith('.wcp.xz')) return '.wcp.xz'
  const dot = lower.lastIndexOf('.')
  return dot >= 0 ? lower.slice(dot) : ''
}

export function isValidAsset(asset: ReleaseAsset, projectExtensions?: string[]): boolean {
  const lower = asset.name.toLowerCase()
  if (SOURCE_ARCHIVE_NAMES.includes(lower)) return false

  const ext = getExtension(asset.name)
  const valid = projectExtensions?.length
    ? [...DEFAULT_EXTENSIONS, ...projectExtensions]
    : DEFAULT_EXTENSIONS

  return valid.includes(ext)
}

export function getValidAssets(assets: ReleaseAsset[], projectExtensions?: string[]): ReleaseAsset[] {
  return assets
    .filter(a => isValidAsset(a, projectExtensions))
    .sort((a, b) => b.downloads - a.downloads)
}

export function hasValidAsset(assets: ReleaseAsset[], projectExtensions?: string[]): boolean {
  return assets.some(a => isValidAsset(a, projectExtensions))
}

export function getLatestValidAsset(assets: ReleaseAsset[], projectExtensions?: string[]): ReleaseAsset | null {
  const valid = getValidAssets(assets, projectExtensions)
  return valid[0] ?? null
}

export function getCategoryPillClass(category: string): string {
  const map: Record<string, string> = {
    'GameHub': 'pill-gamehub',
    'Winlator': 'pill-winlator',
    'Drivers': 'pill-drivers',
    'Nintendo Switch Emulator': 'pill-switch',
    'Nintendo 3DS': 'pill-3ds',
    'Emulator PS3': 'pill-ps3',
    'Emulator PS2': 'pill-ps2',
    'PSVITA': 'pill-psvita',
    'PC Emulator': 'pill-pc',
    'Wii U Emulator': 'pill-wiiu',
    'Xbox': 'pill-xbox',
    'GameNative': 'pill-gamenative',
    'Nintendo GameCube / Wii': 'pill-gamecube',
    'Sega Dreamcast': 'pill-dreamcast',
    'All In One': 'pill-allinone',
  }
  return map[category] ?? 'pill-default'
}
