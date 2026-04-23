# TrackMe

Interactive two-page React app for a package-tracking product.

- **`/`** — hero. A 3D cardboard box sits in the center. Click it, the tape rips, the four flaps fold outward, and four tracking cards spring out of the interior. Click any card to see a deep-dive modal (timeline, ETA, origin). Use the "View full tracking" link to deep-link into the list view.
- **`/tracking`** — parcel inbox. Full list of all orders as expandable cards. Filter by status (All / Processing / In-transit / Out-for-delivery / Delivered), sort by ETA / newest / status. Click any card to reveal the full scan-event timeline inline. Deep links like `/tracking?id=TM-0523` auto-expand that card on load.

Built with **React 19 + Vite + TypeScript + Tailwind CSS + React Router v7**.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173/>.

## Build

```bash
npm run build
npm run preview
```

## Features

- **Live data with graceful fallback.** On mount, `src/lib/tracking.ts` calls the Mockaroo endpoint with a 3.5s timeout. If it fails (CORS, rate limit, offline), it falls back to the bundled `public/packagedata.json`. A small chip in each view tells you which source you're looking at: `Live · Mockaroo API` or `Offline · bundled sample`.
- **Dark mode + Svenska.** Both pages carry theme + language toggles in the nav (sun/moon icon, EN/SV pill). Preferences are persisted to `localStorage` and applied to `<html data-theme="…" lang="…">` before React mounts to avoid flash.
- **Tweaks panel.** Hero has a live-tuning panel (layout, accent hue slider, float amplitude, wordmark treatment).
- **Deterministic timelines.** The scan-event timeline for each parcel is generated from a hash of its ID so it stays stable across reloads.
- **CSS-only 3D box.** The box is pure CSS `transform-style: preserve-3d` — the wrap's local plane is the top of the box, side walls hinge at their top edge and extend in `-Z`, flaps sit at `Z = height` and fold outward 105° about their outer edge. No canvas, no WebGL.

## Structure

```
src/
├── main.tsx                # Router setup — /, /tracking, 404
├── routes/
│   ├── Hero.tsx            # Hero. Phase machine: closed → shaking → ripping → opening → revealed.
│   ├── Tracking.tsx        # List page. Filter + sort + inline-expand + deep-link.
│   └── NotFound.tsx
├── components/
│   ├── Box3D.tsx           # CSS 3D cardboard box. All state via class names.
│   ├── TrackingCards.tsx   # Fan/stack/grid layout of 4 hero cards + ExpandedCardDetail modal.
│   ├── SettingsToggles.tsx # Theme + language buttons in nav.
│   ├── TweaksPanel.tsx     # Live design controls.
│   └── Wordmark.tsx        # Three wordmark styles: split / bold / outline.
├── lib/
│   ├── i18n.ts             # Settings store (theme+lang), translation dict EN+SV, `useSettings()` hook.
│   ├── tracking.ts         # Fetch + normalize + fallback + deterministic timeline generator.
│   └── types.ts
└── styles/
    └── globals.css         # Design tokens, 3D box geometry, cards, toggles, tracking page.
```

## The open-box sequence

| Phase      | Class added    | What happens                                                                      |
| ---------- | -------------- | --------------------------------------------------------------------------------- |
| `closed`   | –              | Box floats. Tape handle hovers slightly on mouseover.                             |
| `shaking`  | `is-shaking` + `is-peeling` | Box wobbles; tape lifts 35° off the back edge as it's peeled.        |
| `ripping`  | `is-ripping` + `is-cracking` | Tape flies up and away; flaps barely part (10–14°).                  |
| `opening`  | `is-open`      | Flaps fully fold outward 105° about their outer edges.                            |
| `revealed` | `is-hidden`    | Box fades and shrinks; cards spring in from the interior with staggered delays.   |

Timing: 0 → 550 → 1100 → 2100 ms. Tuned for "mechanical tension then release" rather than a single smooth open.

## Swapping the data source

Edit `API_URL` and `normalize()` in `src/lib/tracking.ts`. `normalize(raw, i) → TrackingCardVM` is the only place where upstream field names leak into the app; change it and the rest follows.
