# MISSION: Update & enhance my resume site (my-resume)

Repo: this folder (Vite + React 19 + TypeScript, deployed to GitHub Pages via `npm run deploy`).
Live: https://tomer-sherman.github.io/my-resume/

The content is outdated and has typos. You are updating the CONTENT and lightly ENHANCING the existing design. You are NOT redesigning it.

## Rules (read first)

1. Keep my architecture: one folder per component (`components/header`, `components/main`, `components/aside`, `components/layout`), each with its own `.tsx` + `.css`. No new UI libraries, no Tailwind, no CSS-in-JS.
2. Move all resume text out of JSX into `src/models/resume.model.ts` (types) + `src/data/resume.data.ts` (content). Components only render. Use `type`, never `interface`.
3. Keep the design language: navy/white palette (existing CSS vars), Orbitron for headings (`--font-hud`), JetBrains Mono for body (`--font-terminal`), header gradient with glow, grid layout `head / main+side`. Enhance it, don't replace it.
4. Do NOT invent facts. Every line of content below is approved. If you need a detail I didn't give (a date, a repo link), leave a `TODO:` comment and tell me at the end.
5. Work section by section: header → aside → main → index.html/meta → polish. After each section, `npm run build` must pass.
6. Report back short and punchy: what changed, what's left, any TODOs. No walls of text.

## Content

### Header
- Name: TOMER SHERMAN
- Title: FULL STACK DEVELOPER
- Tagline (match my LinkedIn headline exactly):
  `React, TypeScript, Node.js, MySQL, MongoDB | RAG · MCP servers · AI agents | Architecture-first thinking`
- Short intro (replace current paragraph):
  "Full-stack developer who builds from the architecture down. I map the data flow first, then build in layers — client, API, DB — and wire AI into systems as tools and agents, not gimmicks."
- Social links (row of links, same style as the current GitHub link):
  - GitHub → https://github.com/tomer-sherman
  - LinkedIn → https://www.linkedin.com/in/tomer-sherman-a90181429/
  - Email → mailto:tomer.sherman11@gmail.com

### Aside (replace "FRONTEND TOOLSET" with a grouped stack)
Render each group as a heading + tag chips (small bordered pills, JetBrains Mono, hover → accent-blue). Order matters — most relevant first.

- **FRONTEND**: React, TypeScript, Redux, react-hook-form, Vite
- **BACKEND**: Node.js, Express, REST APIs, Socket.IO, Zod validation, JWT / Firebase Auth
- **DATABASES**: MySQL, MongoDB (Mongoose)
- **AI & AGENTS**: RAG, MCP servers, AI agents, OpenAI API, prompt engineering
- **DEVOPS & TOOLS**: Docker, Git/GitHub, GitHub Pages, Firebase, ngrok, Postman

(Drop HTML/CSS/JavaScript as standalone items — implied. If you want, one muted line under FRONTEND: "+ HTML · CSS · JavaScript".)

- **HOW I WORK** (replace "GENERAL TRAITS"):
  - Architecture-first — map the flow before writing code
  - Separation of concerns, layered design (route → controller → service → DAL)
  - Understanding over memorizing
  - AI-assisted development: scope it, generate it, verify it
  - Composure and decision-making under pressure

- **CONTACT** — keep as is: 📍 Israel – Rehovot · 📞 +972 52-691-0602 · ✉️ tomer.sherman11@gmail.com

### Main — section 1: EXPERIENCE (fix typos: "PROGRAMING", "SOFTWERE", "PROGRAMER")

**MAR 2026 – PRESENT · Full Stack & AI Development Track · John Bryce Academy**
Intensive full-stack program integrated with AI. Keep the existing "curiosity to understand the underlying architecture" spirit, rewrite tighter:
- React, TypeScript, Node.js/Express, MySQL, MongoDB, Socket.IO, Docker
- AI engineering: RAG pipelines, MCP servers, building AI agents, OpenAI API integration
- Emphasis on clean architecture, layered backends, and state management

### Main — section 2: PROJECTS (new section, card grid, 2 columns on desktop, 1 on mobile)
Each card: title, one-line stack, 2–3 bullets, links row. Same card style as the rest of the site (white card, thin border, navy heading, hover lift). Only these four for now — I'll add more later, so make adding a card = adding one object to `resume.data.ts`.

1. **CryptoTracker** — React · Redux · TypeScript · CoinGecko API · MCP
   - Live crypto price tracker with optimized fetching: 2 calls at boot, 1 poll/min, zero calls on user interaction (all reads from global state)
   - MCP server exposing crypto data as tools to an AI, powering an in-app chatbot
   - Links: Live → https://sherman-crypto-tracker.firebaseapp.com/home · Code → https://github.com/tomer-sherman/Crypto-Tracker

2. **simple-url-scraper** (npm package) — Node · TypeScript
   - Published npm library: give it a URL, get back metadata, headers and links — built as a tool for AI agents
   - Links: npm → https://www.npmjs.com/package/simple-url-scraper

3. **Holidayer** — Node · Express 5 · TypeScript · MongoDB (Mongoose) · MCP · OpenAI
   - Role-based auth (user/admin) with chained middlewares, admin-gated CRUD
   - MCP server (express-mcp-handler) exposing DB queries as tools; AI recommendation layer returning structured JSON per destination
   - Links: Code → https://github.com/tomer-sherman/holidayer

4. **freelance-price-proposal** (Claude skill) — Markdown skill · prompt engineering
   - A Claude skill that turns a freelancer's raw project notes into a finished, client-ready price proposal, plus a private list of details they forgot to specify
   - Works in any language and profession; built from real proposals gathered from working freelancers
   - Links: Code → https://github.com/tomer-sherman/freelance-price-proposal

### Main — section 3: LIFE EXPERIENCE (keep content, fix typos, tighten wording)
FEB 2023 – FEB 2025 · IDF Officer — keep both paragraphs (Field Intelligence Combat Officer, Operations Officer). Keep the bold sub-headings.

## Design enhancements (keep it subtle, same identity)

- Skill chips in the aside (as described above).
- Projects card grid with hover lift + accent border.
- Timeline feel for EXPERIENCE: a thin vertical accent line on the left with a dot per entry.
- Socials row in the header: GitHub / LinkedIn / Email as pill links with hover glow (reuse the existing `.Header-social-link` style).
- Section headings: keep Orbitron uppercase, add a short accent-blue underline bar.
- Responsive: there is one `@media (max-width: 1024px)` in `layout.css`. Verify header, aside chips and project grid collapse cleanly at 768px and 480px too.
- Subtle fade-in on sections on load (CSS only, `prefers-reduced-motion` respected).

## Machine-readable layer (important — I'll feed this to AI tools during job hunting)
The site is a client-rendered SPA, so anything that doesn't run JS sees an empty `<div id="root">`. Fix that with three outputs, all generated from the same `resume.data.ts` so they never drift:

1. **`public/resume.json`** — the full resume in [JSON Resume](https://jsonresume.org/schema) format (`basics`, `work`, `education`, `skills`, `projects`, `languages`). Write a small script `scripts/generate-resume.ts` that imports `resume.data.ts` and writes this file; hook it into `"prebuild"` in `package.json` so it's always fresh. Add a `resume.md` next to it, generated by the same script — clean markdown, no styling, headings per section.
2. **JSON-LD in `index.html`** — a `<script type="application/ld+json">` block with `@type: Person` (name, jobTitle, url, sameAs = [GitHub, LinkedIn], knowsAbout = the skill list, email). Hardcoded is fine, but keep it in sync with the data file.
3. **Semantic HTML** — the components already use `<header>/<main>/<aside>`; make sure every section is a `<section aria-labelledby=...>` with a real `<h2>`, projects are `<article>`s, dates use `<time dateTime="2026-03">`, and skill chips are a `<ul>` not divs. Add a `<noscript>` block in `index.html` with a one-paragraph plain-text summary + links so no-JS readers get something.

Also add a small "Download: JSON · Markdown" link pair in the header socials row pointing at `resume.json` / `resume.md` (respect Vite `base`).

## index.html fixes
- `<title>` → `Tomer Sherman | Full Stack Developer`
- Add `<meta name="description" content="Full Stack Developer — React, TypeScript, Node.js, MySQL, MongoDB. RAG, MCP servers, AI agents. Architecture-first thinking.">`
- Add Open Graph tags (og:title, og:description, og:url = https://tomer-sherman.github.io/my-resume/, og:image = the profile picture).
- Favicon href is `/public/favicon.png` — with Vite `base: '/my-resume/'` this is wrong on GitHub Pages. Fix to `favicon.png` (relative, served from `public/`) and confirm it loads in `npm run preview`.

## Definition of done
- `npm run build` and `npm run lint` pass
- Every link opens in a new tab (`target="_blank" rel="noopener noreferrer"`)
- All content comes from `resume.data.ts`; no hardcoded text in components
- `npm run build` regenerates `public/resume.json` + `public/resume.md`; open them and confirm they match the rendered site
- `curl` the built `dist/index.html` and confirm the `<noscript>` summary + JSON-LD are present without JS
- List every `TODO:` you left (there should be none for the four project cards — all links are given)
- Do NOT run `npm run deploy` — I'll review and deploy myself