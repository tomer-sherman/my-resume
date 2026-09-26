# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Tomer Sherman's personal resume site: Vite + React 19 + TypeScript, deployed to GitHub Pages at
`https://tomer-sherman.github.io/my-resume/`. The same content also ships as machine-readable files
(`public/resume.json`, `public/resume.md`, JSON-LD in `index.html`) that Tomer feeds to AI tools while job hunting,
so the site and those files must never drift.

Resume PDFs (EN + HE, `npm run export:pdf`) live in `PDFS-export/`; read `PDFS-export/CLAUDE.md` before touching them.

## Commands

```bash
npm run dev        # Vite dev server. The site lives under the base path: http://localhost:5173/my-resume/
npm run build      # prebuild -> npm run generate, then tsc -b && vite build
npm run generate   # node scripts/generate-resume.ts (rewrites resume.json, resume.md, index.html blocks)
npm run lint       # eslint .
npm run preview    # serves dist/ at http://localhost:4173/my-resume/
```

- There is no test suite. Verify with `npm run build` and `npm run lint`, and use `npm run preview` when a change
  touches `index.html`, `public/`, or asset paths (the `/my-resume/` base bites in preview, not in dev).
- `npm run dev` does NOT run the generator. After editing content, run `npm run generate` or `npm run build` so the
  generated files and the `index.html` blocks catch up.
- `npm run deploy` (gh-pages) is run by Tomer only. Never run it; he reviews and deploys himself.
- The generator runs as plain `node` on a `.ts` file (Node 22.18+/24 type stripping, no tsx/ts-node installed).
  Anything imported by it must use erasable-only syntax, `import type` for types, and explicit `.ts` extensions
  inside `scripts/`. `erasableSyntaxOnly` is on in both tsconfigs to enforce this.

## Architecture: content in, four outputs out

`src/data/resume.data.ts` (typed by `src/models/resume.model.ts`) is the single source of truth for every word on
the site. Four consumers read it:

1. **React components** (`src/components/{header,main,aside,layout}/`) only render. They import `resume` directly
   (no props drilling) and contain no resume text, not even section titles or ids. Adding a project = adding one
   object to `projects.items`.
2. **`public/resume.json`** in JSON Resume format, built by `toJsonResume` in `scripts/formats.ts`.
3. **`public/resume.md`**, built by `toMarkdown` in the same file.
4. **`index.html`**: `scripts/generate-resume.ts` rewrites the JSON-LD `<script>` and the `<noscript>` summary in
   place between `<!-- generated:jsonld:start/end -->` and `<!-- generated:noscript:start/end -->` markers. Never
   hand-edit inside the markers; edit the data or `formats.ts` instead. Everything else in `index.html` (meta,
   Open Graph, favicon, `rel="alternate"` links) is hand-maintained.

Because `index.html`, `resume.json` and `resume.md` are tracked, a build can dirty the working tree. That is
expected: commit the regenerated files with the content change.

Things that only make sense once you see the whole pipeline:

- The data file must stay runnable under Node: no `import.meta.env`, no image/CSS imports, no browser globals.
  Asset references are plain strings (`image: 'pic.jpeg'`, `icon: 'icons/npm.svg'`) that components prefix with
  `import.meta.env.BASE_URL` and the generator prefixes with `basics.siteUrl`.
- `TimelineSection.kind` (`'education' | 'work'`) decides which JSON Resume list a section maps to. Today the
  on-site "Experience" section (John Bryce track) is `education` and "Life Experience" (IDF) is `work`.
- Dates are ISO months (`'2026-03'`) in data. `src/utils/format.ts` turns them into `Mar 2026 – Present` for both
  the components (`<time dateTime>`) and the markdown; CSS uppercases them on the site. Section titles are stored in
  Title Case for the same reason.
- `Resume.contact` is rendered in the header (not the aside) and also drives the `## Contact` section in markdown.
- Line endings: `core.autocrlf=true`, so the working tree is CRLF. The generator detects and preserves the EOL of
  `index.html`.

## Layout and styling

- `Layout` owns the semantic shell (`<header>`, `<main>`, `<aside>` as CSS grid areas: `head / main+side`,
  collapsing to one column at 1024px, with further padding steps at 768px and 480px in `layout.css`). The three
  section components return plain `<div>`s to avoid nested landmarks.
- One folder per component with its own `.tsx` + `.css`. No UI libraries, no Tailwind, no CSS-in-JS. Use `type`,
  never `interface`.
- Design tokens live in `src/index.css`: navy/white palette vars, `--font-hud` (Orbitron, headings) and
  `--font-terminal` (JetBrains Mono, body), both self-hosted from `src/assets/fonts/`. Shared pieces also live there:
  `.Section-title` (uppercase Orbitron with the accent underline bar) and the `rise-in` keyframes plus the
  `prefers-reduced-motion` override; each component applies its own fade-in stagger.
- Every `<section>` has `aria-labelledby` pointing at a real `<h2>` (ids are `${section.id}-title`), projects are
  `<article>`s inside a `<ul>`, skill chips are `<li class="Chip">` inside `<ul class="Chips">`.
- Every link opens in a new tab with `target="_blank" rel="noopener noreferrer"`, including `mailto:`.

## Content rules from the owner

- Never invent resume facts (dates, links, languages, employers). If a detail is missing, leave a `TODO:` comment
  in `resume.data.ts` and list it in your report.- Keep the existing visual identity; enhance, don't redesign.
- Reports back should be short: what changed, what's left, any TODOs.
