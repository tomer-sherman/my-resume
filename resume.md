# Tomer Sherman

Full Stack Developer

React, TypeScript, Node.js, MySQL, MongoDB | RAG · MCP servers · AI agents | Architecture-first thinking

Full-stack developer who builds from the architecture down. I map the data flow first, then build in layers — client, API, DB — and wire AI into systems as tools and agents.

## Contact

- GitHub: https://github.com/tomer-sherman
- LinkedIn: https://www.linkedin.com/in/tomer-sherman-a90181429/
- Email: tomer.sherman11@gmail.com
- Phone: +972 52-691-0602
- Location: Israel – Rehovot
- Website: https://tomer-sherman.github.io/my-resume/

## Experience

### Full Stack & AI Development Track — John Bryce Academy

Mar 2026 – Present

Intensive full-stack program integrated with AI. Driven by a curiosity to understand the underlying architecture of software rather than memorizing syntax.

- React, TypeScript, Node.js/Express, MySQL, MongoDB, Socket.IO, Docker
- AI engineering: RAG pipelines, MCP servers, building AI agents, OpenAI API integration
- Emphasis on clean architecture, layered backends, and state management

## My Projects

### CryptoTracker

React · Redux · TypeScript · CoinGecko API · MCP

- Live crypto price tracker with a smart caching system: 2 calls at boot, 1 poll/min, zero calls on user interaction
- Global state management with Redux: every read comes from the store, not the API

Links: [Live](https://sherman-crypto-tracker.firebaseapp.com/home) · [Code](https://github.com/tomer-sherman/Crypto-Tracker)

### simple-url-scraper (npm package)

Node · TypeScript

- Published npm library: give it a URL, get back metadata, headers and links — built as a tool for AI agents

Links: [npm](https://www.npmjs.com/package/simple-url-scraper)

### VacationTracker

Node · Express 5 · TypeScript · MongoDB (Mongoose) · MCP · OpenAI

- Role-based auth (user/admin) with chained middlewares, admin-gated CRUD
- MCP server (express-mcp-handler) exposing DB queries as tools; AI recommendation layer returning structured JSON per destination

Links: [Code](https://github.com/tomer-sherman/vacation-tracker)

### freelance-price-proposal (Claude skill)

Markdown skill · prompt engineering

- A Claude skill that turns a freelancer's raw project notes into a finished, client-ready price proposal, plus a private list of details they forgot to specify
- Works in any language and profession; built from real proposals gathered from working freelancers

Links: [Code](https://github.com/tomer-sherman/freelance-price-proposal)

### Bax (Chrome extension)

Plasmo · TypeScript · Cheerio · LangChain · OpenAI

- Browser AI eXtension: reads the page you're on and answers questions about it. A Cheerio scraper strips scripts, nav, ads and cookie banners, then turns the page into numbered markdown lines
- Hand-written agent loop (not LangChain's createAgent) with two tools, skim_page and read_lines: the model skims the page like a table of contents, then reads only the lines it needs; capped at 8 steps

Links: [Code](https://github.com/tomer-sherman/bax)

## Life Experience

### IDF Officer — Israel Defense Forces

Feb 2023 – Feb 2025

#### Field Intelligence Combat Officer

Led a platoon of combat soldiers under extreme pressure, keeping composure and making clear decisions under stress. Maintained situational awareness to make critical calls on the fly, and planned before executing. Gathered intelligence and produced accurate, data-driven operational reports.

#### Operations Officer

Ran the operations room, keeping communication clear and efficient across multiple channels. Filed accurate reports, maintained strong interpersonal communication, and took full accountability for task management and high-quality execution.

## Skills

- Frontend: React, TypeScript, Redux, react-hook-form, Vite (+ HTML · CSS · JavaScript)
- Backend: Node.js, Express, REST APIs, Zod validation, JWT / Firebase Auth
- Databases: MySQL, MongoDB (Mongoose)
- AI & Agents: RAG, MCP servers, AI agents, OpenAI API, n8n, prompt engineering
- DevOps & Tools: Docker, Git/GitHub, GitHub Pages, Firebase, ngrok, Postman

## How I Work

- Architecture-first — map the flow before writing code
- Separation of concerns, layered design (route → controller → service → DAL)
- Understanding over memorizing
- AI-assisted development: scope it, generate it, verify it
- Composure and decision-making under pressure

## Languages

- Hebrew: Fluent
- English: High level
- Russian: Basic
