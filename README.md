# Arcade Aurora Glass — Emulator Download Rankings

![Auto-updated](https://img.shields.io/badge/auto--updated-hourly-26f7ff?style=flat-square)
![Projects](https://img.shields.io/badge/projects-60-9b5cff?style=flat-square)
![Last update](https://img.shields.io/badge/updated-2026-08-17-9dff57?style=flat-square)

> Download statistics auto-fetched hourly from GitHub and Gitea release assets.
> Deploy the static dashboard at `docs/` on GitHub Pages, Netlify, or Vercel.

## Global Ranking

| Rank | Project | Downloads | Latest | Category |
|------|---------|-----------|--------|----------|
| 🥇 | GameHub Lite (Producdevity) | 0 | `—` | GameHub |
| 🥈 | GameHub Lite (ItzDFPlayer) | 0 | `—` | GameHub |
| 🥉 | GameHub Lite (J4MCU-builds) | 0 | `—` | GameHub |
| 4 | BannerHub (The412Banner) | 0 | `—` | GameHub |
| 5 | Adreno Tools Drivers | 0 | `—` | Drivers |
| 6 | Adrenotools Drivers (StevenMXZ) | 0 | `—` | Drivers |
| 7 | Freedreno Turnip CI (Weab-chan) | 0 | `—` | Drivers |
| 8 | Freedreno Turnip CI (StevenMXZ) | 0 | `—` | Drivers |
| 9 | Freedreno Turnip CI (whitebelyash) | 0 | `—` | Drivers |
| 10 | Upload Grave | 0 | `—` | Drivers |
| 11 | Winlator Ref4ik (Drivers/Wine) | 0 | `—` | Drivers |
| 12 | StevenMXZ Contents Cmod | 0 | `—` | Drivers |
| 13 | GameNative | 0 | `—` | GameNative |
| 14 | GameNative Performance | 0 | `—` | GameNative |
| 15 | Winlator BrunoDev | 0 | `—` | Winlator |
| 16 | Winlator Ludashi | 0 | `—` | Winlator |
| 17 | Winlator Afei | 0 | `—` | Winlator |
| 18 | Winlator Xmod | 0 | `—` | Winlator |
| 19 | Winlator Ref4ik | 0 | `—` | Winlator |
| 20 | Winlator Ajay | 0 | `—` | Winlator |
| 21 | Winlator Coffincolors | 0 | `—` | Winlator |
| 22 | Winlator X | 0 | `—` | Winlator |
| 23 | Winlator Bionic jhinzuo | 0 | `—` | Winlator |
| 24 | Winlator XR | 0 | `—` | Winlator |
| 25 | Winlator Bionic cjxyz | 0 | `—` | Winlator |
| 26 | Winlator Bionic duckyduckG | 0 | `—` | Winlator |
| 27 | Winlator Bionic Stredohiri | 0 | `—` | Winlator |
| 28 | Winlator Bionic Alexoqool | 0 | `—` | Winlator |
| 29 | Winlator Honkon | 0 | `—` | Winlator |
| 30 | Winlator Glibc | 0 | `—` | Winlator |
| 31 | Wb64dev | 0 | `—` | Winlator |
| 32 | Winlator Mali | 0 | `—` | Winlator |
| 33 | Star (fork) | 0 | `—` | Winlator |
| 34 | Winlator Brasil | 0 | `—` | Winlator |
| 35 | Steamlator | 0 | `—` | Winlator |
| 36 | WinNative (fork) | 0 | `—` | Winlator |
| 37 | MiceWine | 0 | `—` | PC Emulator |
| 38 | Horizon Emu | 0 | `—` | PC Emulator |
| 39 | ExaGear 302 | 0 | `—` | PC Emulator |
| 40 | XoDos | 0 | `—` | PC Emulator |
| 41 | Mobox Patched | 0 | `—` | PC Emulator |
| 42 | Pluvia | 0 | `—` | PC Emulator |
| 43 | Cemu | 0 | `—` | Wii U Emulator |
| 44 | X1 BOX | 0 | `—` | Xbox |
| 45 | hakuX | 0 | `—` | Xbox |
| 46 | X360 Mobile | 0 | `—` | Xbox 360 |
| 47 | Eden Emulator | 0 | `v0.2.1` | Nintendo Switch Emulator |
| 48 | Eden Emulator Nightly | 0 | `v1786904188.dc95cd09ee` | Nintendo Switch Emulator |
| 49 | Azahar | 0 | `—` | Nintendo 3DS |
| 50 | Citra (weihuoya) | 0 | `—` | Nintendo 3DS |
| 51 | APS3e | 0 | `—` | Emulator PS3 |
| 52 | RPCSX Android | 0 | `—` | Emulator PS3 |
| 53 | ARMSX2 | 0 | `—` | Emulator PS2 |
| 54 | NetherSX2 Patch | 0 | `—` | Emulator PS2 |
| 55 | NetherSX2 Classic | 0 | `—` | Emulator PS2 |
| 56 | NetherSX2-Turnip | 0 | `—` | Emulator PS2 |
| 57 | Vita3K Android | 0 | `—` | PSVITA |
| 58 | Dolphin MMJR2 VBI | 0 | `—` | Nintendo GameCube / Wii |
| 59 | Flycast | 0 | `—` | Sega Dreamcast |
| 60 | Lemuroid | 0 | `—` | All In One |

## Setup

```bash
npm install
npm run fetch    # fetch rankings.json from GitHub/Gitea APIs  (~75s without token)
npm run build    # build static site to docs/
npm run dev      # local dev server at localhost:5173
```

## Managing Projects

All tracked projects live in one file: **`config/projects.json`**

Open it, find the `"projects"` array, and add or remove entries.
The `"_instructions"` key at the top of that file documents every available field.

### Add a project

```json
{ "name": "My Emulator", "repo": "owner/repo", "category": "PC Emulator" }
```

Then run:

```bash
npm run fetch   # pulls fresh data from GitHub/Gitea
npm run build   # rebuilds the static site into docs/
```

Push the result — GitHub Actions will keep it updated hourly from then on.

### Common optional fields

| Field | Purpose | Example |
|-------|---------|---------|
| `logo` | Image shown in the ranking | `"gamehub.png"` — file goes in `public/logos/` |
| `extensions` | Extra valid download types beyond `.apk` | `[".zip"]`, `[".wcp"]`, `[".tar.gz"]` |
| `apiType` + `apiHost` | For Gitea repos instead of GitHub | `"gitea"`, `"https://git.citron-emu.org"` |
| `skipFetch` | Show the project without fetching releases | `true` |
| `upstream` | Group related forks together | `"winlator"` |

### Remove a project

Delete its line from the `"projects"` array in `config/projects.json`, then run `npm run fetch && npm run build`.

### Known categories

`GameHub` · `Winlator` · `Drivers` · `PC Emulator` · `GameNative`
`Nintendo Switch Emulator` · `Nintendo 3DS` · `Emulator PS3` · `Emulator PS2`
`PSVITA` · `Wii U Emulator` · `Xbox` · `Nintendo GameCube / Wii`
`Sega Dreamcast` · `All In One`

Inventing a new category string is fine — it automatically appears as a filter option in the dashboard.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | Authenticated GitHub API (5,000 req/hr vs 60). Set in repo secrets for CI. |
| `VITE_ENABLE_COUNTERS` | Enable visitor counters (default: false) |

## Methodology

- Downloads are calculated by summing `download_count` from every release asset.
- Only assets matching a project's valid extensions are counted (default: `.apk`; drivers add `.zip`, `.wcp`, etc.)
- Data updates automatically every hour via GitHub Actions.
- Projects showing 0 downloads have no public releases or the API was unavailable at last fetch.

_Last auto-generated: 2026-08-17T14:22:19.742Z_
