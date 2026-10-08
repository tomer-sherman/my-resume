import type { Basics, Resume } from '../models/resume.model';

/**
 * All resume content lives here. Components only render it, and
 * `npm run build` regenerates `public/resume.json`, `public/resume.md` and the
 * JSON-LD / noscript blocks in `index.html` from this object.
 *
 * Adding a project = adding one object to `projects.items`.
 */

const basics: Basics = {
    name: 'Tomer Sherman',
    title: 'Full Stack Developer',
    tagline: 'React, TypeScript, Node.js, MySQL, MongoDB | RAG · MCP servers · AI agents | Architecture-first thinking',
    intro: 'Full-stack developer who builds from the architecture down. I map the data flow first, then build in layers — client, API, DB — and wire AI into systems as tools and agents.',
    email: 'tomer.sherman11@gmail.com',
    phone: '+972 52-691-0602',
    location: { city: 'Rehovot', country: 'Israel', countryCode: 'IL' },
    siteUrl: 'https://tomer-sherman.github.io/my-resume/',
    image: 'pic.jpeg',
};

export const resume: Resume = {
    basics,

    socials: [
        { network: 'GitHub', label: 'GitHub', username: 'tomer-sherman', href: 'https://github.com/tomer-sherman' },
        { network: 'LinkedIn', label: 'LinkedIn', username: 'tomer-sherman-a90181429', href: 'https://www.linkedin.com/in/tomer-sherman-a90181429/' },
        { network: 'Email', label: 'Email', href: `mailto:${basics.email}` },
    ],

    skills: [
        {
            id: 'frontend',
            title: 'Frontend',
            items: ['React', 'TypeScript', 'Redux', 'react-hook-form', 'Vite'],
            note: '+ HTML · CSS · JavaScript',
        },
        {
            id: 'backend',
            title: 'Backend',
            items: ['Node.js', 'Express', 'REST APIs', 'Zod validation', 'JWT / Firebase Auth'],
        },
        {
            id: 'databases',
            title: 'Databases',
            items: ['MySQL', 'MongoDB (Mongoose)'],
        },
        {
            id: 'ai-agents',
            title: 'AI & Agents',
            items: ['RAG', 'MCP servers', 'AI agents', 'OpenAI API', 'n8n', 'prompt engineering'],
        },
        {
            id: 'devops-tools',
            title: 'DevOps & Tools',
            items: ['Docker', 'Git/GitHub', 'GitHub Pages', 'Firebase', 'ngrok', 'Postman'],
        },
    ],

    principles: {
        id: 'how-i-work',
        title: 'How I Work',
        items: [
            'Architecture-first — map the flow before writing code',
            'Separation of concerns, layered design (route → controller → service → DAL)',
            'Understanding over memorizing',
            'AI-assisted development: scope it, generate it, verify it',
            'Composure and decision-making under pressure',
        ],
    },

    contact: {
        id: 'contact',
        title: 'Contact',
        lines: [
            { icon: '📍', text: `${basics.location.country} – ${basics.location.city}` },
            { icon: '📞', text: basics.phone },
            { icon: '✉️', text: basics.email },
        ],
    },

    experience: {
        id: 'experience',
        title: 'Experience',
        kind: 'education',
        entries: [
            {
                id: 'john-bryce',
                period: { start: '2026-03' },
                title: 'Full Stack & AI Development Track',
                org: 'John Bryce Academy',
                area: 'Full Stack & AI Development',
                summary: 'Intensive full-stack program integrated with AI. Driven by a curiosity to understand the underlying architecture of software rather than memorizing syntax.',
                bullets: [
                    'React, TypeScript, Node.js/Express, MySQL, MongoDB, Socket.IO, Docker',
                    'AI engineering: RAG pipelines, MCP servers, building AI agents, OpenAI API integration',
                    'Emphasis on clean architecture, layered backends, and state management',
                ],
            },
        ],
    },

    projects: {
        id: 'projects',
        title: 'My Projects',
        items: [
            {
                id: 'crypto-tracker',
                name: 'CryptoTracker',
                stack: ['React', 'Redux', 'TypeScript', 'CoinGecko API', 'MCP'],
                bullets: [
                    'Live crypto price tracker with a smart caching system: 2 calls at boot, 1 poll/min, zero calls on user interaction',
                    'Global state management with Redux: every read comes from the store, not the API',
                ],
                links: [
                    { label: 'Live', href: 'https://sherman-crypto-tracker.firebaseapp.com/home' },
                    { label: 'Code', href: 'https://github.com/tomer-sherman/Crypto-Tracker' },
                ],
            },
            {
                id: 'simple-url-scraper',
                name: 'simple-url-scraper',
                kind: 'npm package',
                icon: 'icons/npm.svg', // logo from simpleicons.org (CC0)
                stack: ['Node', 'TypeScript'],
                bullets: [
                    'Published npm library: give it a URL, get back metadata, headers and links — built as a tool for AI agents',
                ],
                links: [
                    { label: 'npm', href: 'https://www.npmjs.com/package/simple-url-scraper' },
                ],
            },
            {
                id: 'vacation-tracker',
                name: 'VacationTracker',
                stack: ['Node', 'Express 5', 'TypeScript', 'MongoDB (Mongoose)', 'MCP', 'OpenAI'],
                bullets: [
                    'Role-based auth (user/admin) with chained middlewares, admin-gated CRUD',
                    'MCP server (express-mcp-handler) exposing DB queries as tools; AI recommendation layer returning structured JSON per destination',
                ],
                links: [
                    { label: 'Code', href: 'https://github.com/tomer-sherman/vacation-tracker' },
                ],
            },
            {
                id: 'freelance-price-proposal',
                name: 'freelance-price-proposal',
                kind: 'Claude skill',
                icon: 'icons/claude.svg', // logo from simpleicons.org (CC0)
                stack: ['Markdown skill', 'prompt engineering'],
                bullets: [
                    "A Claude skill that turns a freelancer's raw project notes into a finished, client-ready price proposal, plus a private list of details they forgot to specify",
                    'Works in any language and profession; built from real proposals gathered from working freelancers',
                ],
                links: [
                    { label: 'Code', href: 'https://github.com/tomer-sherman/freelance-price-proposal' },
                ],
            },
            {
                id: 'bax',
                name: 'Bax',
                kind: 'Chrome extension',
                icon: 'icons/chrome.svg', // logo from simpleicons.org (CC0)
                stack: ['Plasmo', 'TypeScript', 'Cheerio', 'LangChain', 'OpenAI'],
                bullets: [
                    "Browser AI eXtension: reads the page you're on and answers questions about it. A Cheerio scraper strips scripts, nav, ads and cookie banners, then turns the page into numbered markdown lines",
                    "Hand-written agent loop (not LangChain's createAgent) with two tools, skim_page and read_lines: the model skims the page like a table of contents, then reads only the lines it needs; capped at 8 steps",
                ],
                links: [
                    { label: 'Code', href: 'https://github.com/tomer-sherman/bax' },
                ],
            },
        ],
    },

    life: {
        id: 'life-experience',
        title: 'Life Experience',
        kind: 'work',
        entries: [
            {
                id: 'idf-officer',
                period: { start: '2023-02', end: '2025-02' },
                title: 'IDF Officer',
                org: 'Israel Defense Forces',
                roles: [
                    {
                        title: 'Field Intelligence Combat Officer',
                        description: 'Led a platoon of combat soldiers under extreme pressure, keeping composure and making clear decisions under stress. Maintained situational awareness to make critical calls on the fly, and planned before executing. Gathered intelligence and produced accurate, data-driven operational reports.',
                    },
                    {
                        title: 'Operations Officer',
                        description: 'Ran the operations room, keeping communication clear and efficient across multiple channels. Filed accurate reports, maintained strong interpersonal communication, and took full accountability for task management and high-quality execution.',
                    },
                ],
            },
        ],
    },

    languages: [
        { language: 'Hebrew', fluency: 'Fluent' },
        { language: 'English', fluency: 'High level' },
        { language: 'Russian', fluency: 'Basic' },
    ],
};
