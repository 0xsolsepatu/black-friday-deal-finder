# BUILD.md — Bargain Beacon (black-friday-deal-finder-01)

## What it is
A static deal-finder site ("Bargain Beacon") for make.fun's
"Build the best real Black Friday deal finder" bounty ($250, top 20 share).
50 real deals, searchable and filterable by category, store, discount and
verdict, with a deal-detail page and a cross-store price comparison for
the same product at 2–3 stores. No network loads at all: system fonts only,
all data in local files.

## Deals — count, sources, method
- **50 deals** across 10 categories (Audio 6, Computing 8, Gaming 7, TVs 5,
  Smart home 7, Home 3, Kitchen 5, Beauty 1, Toys 4, Fitness 4) at 4 stores
  (Amazon 36, Best Buy 6, Walmart 6, Target 4 — counts overlap where a
  product is listed at several stores).
- **Verdicts:** 14 NEW LOW, 33 STRONG DEAL, 3 ROUTINE CUT. No INFLATED
  verdict appears: every anchor price was corroborated by a named source,
  so no invented inflated anchor was listed.
- **Researched live in this session, 27 Nov 2026** (checked timestamp
  `2026-11-27T06:45:00Z` on every deal) via web search. Named sources per
  deal, e.g. 9to5Mac / 9to5Toys Black Friday live blogs, DealNews,
  Product Bible, Popular Science, BuzzFeed, The Verge, SammyGuru,
  AppleInsider, 2nd Shift, FlashDealFeed, Koupon, BestReviews, PriceDrop.
- **Store links are store search URLs** for the product
  (`amazon.com/s?k=…`, `bestbuy.com/site/searchpage.jsp?st=…`,
  `walmart.com/search?q=…`, `target.com/s?searchTerm=…`) — the same pattern
  the kit starter uses. Product-detail URLs were not verifiable from the
  search results, so search URLs were used instead of inventing one.
- **No starter deals kept:** the kit starter's 8 deals (pre-opening roundup
  data) were excluded entirely; all 50 were researched in this session.
- Discount % and savings are computed in code from price/was, never typed.
- Sale end dates per store: Amazon 30 Nov, Best Buy 28 Nov, Walmart and
  Target 29 Nov 2026.

## Design
Original design, own text and names. Warm paper background, deep ink text,
amber "beacon" accent; verdict badges green (NEW LOW) / amber (STRONG) /
grey (ROUTINE). Header stats bar (50 deals, 14 new lows, 39% average
discount, $12,946.97 total savings). Filter bar with search box, category
chips, store / discount / verdict / sort selects. Filter state is reflected
in the URL query string, so a filtered view is shareable
(`?min=50&sort=discount`). Responsive: 3-column grid on desktop,
2-column under 900px, 1-column under 600px.

## Files
- `main.ts` — hand-in program (written in this session; copies app/ +
  screenshots/ to /output, writes dossier.json via buildDossier).
- `vendor/makefun-frontend.ts` — kit copy, unchanged (verified identical
  by diff).
- `serve.ts` — kit starter static server (dev convenience).
- `app/index.html`, `app/style.css`, `app/main.js` (routing/rendering +
  shareable filter links), `app/filters.js` (filter/sort/stats),
  `app/views.js` (HTML builders), `app/data.js` (50 deals).
- `screenshots/` — 4 real headless-Chromium renders (see below).
- `LICENSE` — starter MIT license. `README.md` — requirements template.
- `shots.json` — not included (starter file describing the starter's
  screenshots; this entry's screenshots are documented here instead).

## Screenshots (all ≤256 KiB, long side ≤1280, short side ≥360)
| File | Size | View |
|---|---|---|
| `screenshots/1-list.jpg` | 104,512 B | 1280×800 desktop board, all 50 deals |
| `screenshots/2-deal.jpg` | 70,636 B | 1280×800 desktop deal detail (AirPods Pro 3) + compare table header |
| `screenshots/3-filtered.jpg` | 107,051 B | 1280×800 desktop, discount filter "50% off or more" + "Biggest discount" sort — "Showing 19 of 50 deals" |
| `screenshots/4-phone.jpg` | 53,597 B | 390×844 phone board |
Rendered with Playwright-bundled Chromium 159 (`~/.cache/ms-playwright/
chromium-1255/chrome-linux64/chrome`, `--headless=new --screenshot`).
The Meta Chromium at /opt/meta-chromium/chrome refuses headless startup
here ("Hatch WebGL domain policy is required for browser startup"), so it
was not used. All four screenshots were read back and visually checked:
legible, no overlap, filters visibly applied in shot 3, phone layout
single-column in shot 4. A taller 1280×1400 render of the deal page was
also checked to confirm the full compare table renders (Amazon $149 /
Walmart $149 / Best Buy $149.99).

## Test results
- `node serve.ts --port 8123` + curl: HTTP 200, index.html served.
- `MAKEFUN_OUTPUT_DIR=/tmp/out1 node main.ts` and again to `/tmp/out2`:
  both runs succeeded; `diff -r` clean — **dossier.json byte-identical
  across runs**.
- `dossier.json`: **507,257 bytes** (cap 1.5 MiB). Load block: first load
  6 files, 13,956 bytes gzip-9 (51,052 raw); later by import() 0 files.
  Whole app 6 files, 51,052 bytes.
- `makefun check` (kit CLI, run after git init, commit
  266eed439c25220ee3051abcd8b298050d40b645): **4 passed, 1 failed, 15
  skipped, 5 checked at submission**. Passed: competition_open,
  snapshot (16 files, 485,096 bytes), license_osi (MIT), entrypoint
  (main.ts, node22). Failed: transcripts_present — no transcripts
  bundle was supplied (the coordinator bundles this session; expected
  at this stage). Skipped: all transcript-gate checks (no sessions to
  read) plus prerequisites/committed_secret/strategy_note. Checked at
  submission: repo_public, repo_owner (.makefun/owner.json needed),
  repo_created_after_open, commit_in_repo, duplicate_snapshot — all
  coordinator-side (repo creation + push + claim file).
- No-network check: the only `http` references in app/ are the 50 store
  links in `data.js` (all `<a href>`, allowed); no script/stylesheet/
  font/image loads over the network; no `data:` scripts.

## Gemini review
- **Spec review (before building), gemini-3.5-flash-lite:** PASS on all
  items (in-window build, fresh files, no external loads, screenshots +
  dossier planned). Open questions answered: store search URLs acceptable;
  absence of an INFLATED verdict fine/honest; single checked timestamp
  acceptable.
- **Code/content review (after building), gemini-3.5-flash-lite:**
  Positive verdict — "exceptionally well-structured, thoroughly
  documented, strictly follows the kit requirements." No code or content
  defects flagged. Action items it named are coordinator-side: submit
  with explicit `--keypair`, post-verify with
  `makefun status --submission <id>`. (Its item "run makefun check"
  was already done — see above; verified against the check output
  before accepting it.)
- Note on Gemini spec-review accuracy: Gemini wrote the competition
  opened at `2026-11-27T04:42:00Z`; the real opening is
  `2026-11-27T00:42:00Z` (task brief + competition.yaml). Caught by
  verification against the source; build is in-window either way.

## Coordinator notes
- Build only: **do NOT push/submit from this workdir** — the coordinator
  handles repo creation, push and submit.
- Planned repo name: `black-friday-deal-finder`, owner `0xsolsepatu`.
  The repo must be created after the competition opened
  (2026-11-27T00:42:00Z). `.makefun/owner.json` is the coordinator's job
  (needs the account wallet).
- Transcripts: this builder session's transcript must be bundled by the
  coordinator; `makefun check` needs the transcripts bundle, so the
  transcript-gate portion of the check could not be run here.
- Round cutoff: next blind round ends 2026-11-27T12:42:00Z (19:42 WIB).
  Entries close 2026-11-29T00:42:00Z (07:42 WIB 29 Nov).
