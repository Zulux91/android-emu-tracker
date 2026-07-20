# Arcade Aurora Glass — Emulator Download Rankings

![Auto-updated](https://img.shields.io/badge/auto--updated-hourly-26f7ff?style=flat-square)
![Projects](https://img.shields.io/badge/projects-60-9b5cff?style=flat-square)
![Last update](https://img.shields.io/badge/updated-2026-07-20-9dff57?style=flat-square)

> Download statistics auto-fetched hourly from GitHub and Gitea release assets.
> Deploy the static dashboard at `docs/` on GitHub Pages, Netlify, or Vercel.

## Global Ranking

| Rank | Project | Downloads | Latest | Category |
|------|---------|-----------|--------|----------|
| 🥇 | Winlator BrunoDev | 14.2M | `v11.1.0` | Winlator |
| 🥈 | Vita3K Android | 4.3M | `v12` | PSVITA |
| 🥉 | Adreno Tools Drivers | 3.5M | `v840` | Drivers |
| 4 | Cemu | 2.6M | `0.5` | Wii U Emulator |
| 5 | Winlator Ludashi | 1.1M | `v3.1.h` | Winlator |
| 6 | Winlator Coffincolors | 781.8K | `winlator_cmod_update_december_2025` | Winlator |
| 7 | Flycast | 733.4K | `v2.6` | Sega Dreamcast |
| 8 | GameNative | 694.2K | `v1.1.1-prerelease` | GameNative |
| 9 | Freedreno Turnip CI (Weab-chan) | 648.6K | `25.3.0-devel_bbdd688` | Drivers |
| 10 | APS3e | 519.9K | `2.40` | Emulator PS3 |
| 11 | Freedreno Turnip CI (whitebelyash) | 445.8K | `tu_v29` | Drivers |
| 12 | NetherSX2-Turnip | 127.6K | `v0.7` | Emulator PS2 |
| 13 | Winlator Bionic Stredohiri | 112.4K | `26f65e9` | Winlator |
| 14 | Winlator Ajay | 81.9K | `v11.1-hotfix2` | Winlator |
| 15 | hakuX | 78.0K | `v0.3.1` | Xbox |
| 16 | Winlator Bionic jhinzuo | 60.0K | `dev8` | Winlator |
| 17 | Steamlator | 57.8K | `1.7` | Winlator |
| 18 | X1 BOX | 44.1K | `1.2.5` | Xbox |
| 19 | Winlator Brasil | 22.1K | `Winlator_Brasil_10.1` | Winlator |
| 20 | Winlator XR | 4.4K | `winlatorxr_cats27` | Winlator |
| 21 | Upload Grave | 3.6K | `xclipse` | Drivers |
| 22 | StevenMXZ Contents Cmod | 1.8K | `1.2.0` | Drivers |
| 23 | Winlator Bionic duckyduckG | 1.3K | `8de79b1` | Winlator |
| 24 | Winlator Xmod | 515 | `Winlator_xmox_1.1.0` | Winlator |
| 25 | GameHub Lite (Producdevity) | 0 | `—` | GameHub |
| 26 | GameHub Lite (ItzDFPlayer) | 0 | `—` | GameHub |
| 27 | GameHub Lite (J4MCU-builds) | 0 | `—` | GameHub |
| 28 | BannerHub (The412Banner) | 0 | `—` | GameHub |
| 29 | Adrenotools Drivers (StevenMXZ) | 0 | `—` | Drivers |
| 30 | Freedreno Turnip CI (StevenMXZ) | 0 | `—` | Drivers |
| 31 | Winlator Ref4ik (Drivers/Wine) | 0 | `—` | Drivers |
| 32 | GameNative Performance | 0 | `—` | GameNative |
| 33 | Winlator Afei | 0 | `—` | Winlator |
| 34 | Winlator Ref4ik | 0 | `—` | Winlator |
| 35 | Winlator X | 0 | `—` | Winlator |
| 36 | Winlator Bionic cjxyz | 0 | `—` | Winlator |
| 37 | Winlator Bionic Alexoqool | 0 | `—` | Winlator |
| 38 | Winlator Honkon | 0 | `—` | Winlator |
| 39 | Winlator Glibc | 0 | `—` | Winlator |
| 40 | Wb64dev | 0 | `—` | Winlator |
| 41 | Winlator Mali | 0 | `—` | Winlator |
| 42 | Star (fork) | 0 | `—` | Winlator |
| 43 | WinNative (fork) | 0 | `—` | Winlator |
| 44 | MiceWine | 0 | `—` | PC Emulator |
| 45 | Horizon Emu | 0 | `—` | PC Emulator |
| 46 | ExaGear 302 | 0 | `—` | PC Emulator |
| 47 | XoDos | 0 | `—` | PC Emulator |
| 48 | Mobox Patched | 0 | `—` | PC Emulator |
| 49 | Pluvia | 0 | `—` | PC Emulator |
| 50 | X360 Mobile | 0 | `—` | Xbox 360 |
| 51 | Eden Emulator | 0 | `v0.2.1` | Nintendo Switch Emulator |
| 52 | Eden Emulator Nightly | 0 | `v1784487248.89004124a5` | Nintendo Switch Emulator |
| 53 | Azahar | 0 | `—` | Nintendo 3DS |
| 54 | Citra (weihuoya) | 0 | `—` | Nintendo 3DS |
| 55 | RPCSX Android | 0 | `—` | Emulator PS3 |
| 56 | ARMSX2 | 0 | `—` | Emulator PS2 |
| 57 | NetherSX2 Patch | 0 | `—` | Emulator PS2 |
| 58 | NetherSX2 Classic | 0 | `—` | Emulator PS2 |
| 59 | Dolphin MMJR2 VBI | 0 | `—` | Nintendo GameCube / Wii |
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

_Last auto-generated: 2026-07-20T01:04:54.465Z_
