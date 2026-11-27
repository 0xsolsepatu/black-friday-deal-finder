# SUBMISSION — Bargain Beacon (black-friday-deal-finder-01)

## Competition
- Slug: black-friday-deal-finder-01
- Title: Build the best real Black Friday deal finder
- Prize: $250 shared by top 20 (1st $50, 2nd $35, 3rd $25)
- Opened: 2026-11-27T00:42:00Z (07:42 WIB 27 Nov)
- Entries close: 2026-11-29T00:42:00Z (07:42 WIB 29 Nov)
- Result due: 2026-12-14T00:42:00Z (07:42 WIB 14 Dec)
- Blind rounds: 4 rounds; next cutoff 2026-11-27T12:42:00Z (19:42 WIB 27 Nov)
- Escrow: HyPjn9QT1GSbvVNtCDJtUNP5aARSSzt17h8rZKqDcKDR (mainnet, USDC)

## Entry
- Site name: Bargain Beacon
- Repo: https://github.com/0xsolsepatu/black-friday-deal-finder (planned; created after opening)
- Deals: 50, all researched live 27 Nov 2026 (checked 2026-11-27T06:45:00Z)
  - Verdicts: 14 NEW LOW, 33 STRONG, 3 ROUTINE, 0 INFLATED (every anchor corroborated)
  - Stores: Amazon 36, Best Buy 6, Walmart 6, Target 4
  - Header stats: 50 deals, 14 new lows, 39% avg discount, $12,946.97 total savings
- Features: search, category chips, store/discount/verdict/sort filters (URL-shareable state), deal-detail pages, cross-store compare (AirPods Pro 3 × 3 stores, KitchenAid Artisan × 2, Switch 2 bundle × 2)
- Zero network loads — only refs are the 50 store `<a href>` links
- Dossier: dossier.json 507,257 bytes (cap 1.5 MiB); first load 6 files, 13,956 gzip-9 bytes; main.ts run twice → byte-identical

## Screenshots (real headless-Chromium renders, visually checked)
- screenshots/1-list.jpg — 104,512 B, 1280×800, sha256 f0fc59cb81dcc38809ddfefd3dbf22a0ff83a352d853d869d7c65cec82e7b8b1
- screenshots/2-deal.jpg — 70,636 B, 1280×800, sha256 bf350c12e97d55ece4aeafc4b923b0f535cdc7ce29ce833e82a1fd9298a755a3
- screenshots/3-filtered.jpg — 107,051 B, 1280×800, sha256 a6b6d9c82cca78431a61823eb432a5a6a671aa6ba50a4ad4465a78d0cdf29541
- screenshots/4-phone.jpg — 53,597 B, 390×844, sha256 2d24839ad919e8c63a364eebcef6aed7ab8fc1ca74106eb7a56bb6d84b8d04
- Note: Meta Chromium refuses headless startup here ("Hatch WebGL domain policy is required"); screenshots taken with Playwright-bundled Chromium 159.

## Build
- Builder session: 0847e279-c176-487c-872d-2649da8f3b06 (completed 27 Nov 14:02 WIB)
- Coordinator session: ea016c8d-3164-415d-ac6d-d480862537f1 (owner.json + SUBMISSION.md)
- Local commits: 266eed4 (build), e6c5b36 (BUILD.md), 6111f17 (.makefun/owner.json)
- Gemini: spec review pre-build PASS on all items; post-build review positive, no defects. One Gemini factual error caught: it claimed opening 04:42:00Z; real opening 00:42:00Z — build in-window either way.
- Store links are store search URLs, not product-detail URLs (not verifiable from search results); Gemini agreed acceptable.

## Bundle + check
- Bundle: black-friday-bundle/transcripts-black-friday.tar.gz — 303,858 B, sha256 88eb198309222538e001fc9498f37c70ce017f4661f1bc88349764e3107bc7f1
  - 2 sessions verified in tar (builder 0847e279 + coordinator ea016c8d), 2 usage rows attached
- Local check (kit CLI): 14 passed / 0 failed / 6 skipped / 5 at submission
  - thinking_reproduces 99.4% (765/769 authored, 0 unwritten); thinking_in_window all 138 timestamps in-window; thinking_priced 2 records

## Submission — PENDING (blocked on browser steps: repo creation + screenshot upload)
- Submission ID: —
- Claim code: — (sheet row 32 when submitted; never in chat)
- Submitted commit (GitHub SHA): —
- Server status: —
