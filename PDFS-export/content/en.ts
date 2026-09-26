/**
 * English PDF wording, condensed from src/data/resume.data.ts.
 * Only wording lives here: project names, stacks, links, phone, email, profile URLs and dates are read from the site data
 * by template.ts. Ids must match the site's project / timeline entry ids.
 */
import type { PdfCopy } from '../template.ts';

export const en: PdfCopy = {
    lang: 'en',
    dir: 'ltr',
    documentTitle: 'Tomer Sherman – Resume',
    name: 'Tomer Sherman',
    headline: 'Full Stack Developer',
    location: 'Rehovot, Israel',
    present: 'Present',
    monthStyle: 'short',

    headings: {
        summary: 'Summary',
        skills: 'Skills',
        projects: 'Projects',
        education: 'Education',
        military: 'Military Service',
    },

    summary:
        'Full-stack developer (React, TypeScript, Node.js, MySQL, MongoDB) who builds from the architecture down: maps the data flow first, then builds in layers – client, API, DB – and wires AI into systems as tools and agents. Focus areas: RAG, MCP servers, AI agents.',

    skills: [
        { label: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Redux', 'React Hook Form', 'Vite', 'HTML/CSS'] },
        { label: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'Zod', 'JWT', 'Firebase Auth'] },
        { label: 'Databases', items: ['MySQL', 'MongoDB', 'Mongoose'] },
        { label: 'AI & Tooling', items: ['RAG', 'MCP servers', 'AI agents', 'OpenAI API', 'Prompt engineering'] },
        { label: 'DevOps & Tools', items: ['Docker', 'Git', 'GitHub', 'GitHub Pages', 'Firebase', 'ngrok', 'Postman'] },
    ],

    languages: { label: 'Languages', items: ['Hebrew (fluent)', 'English (high level)', 'Russian (basic)'] },

    linkLabels: { Live: 'Live', Code: 'GitHub', npm: 'npm' },

    projects: [
        {
            id: 'crypto-tracker',
            description: 'Live crypto price tracker with smart caching and global state management',
            bullets: [
                'Built a smart caching system: 2 API calls at boot, 1 poll/min, zero calls on user interaction',
                'Designed global state management with Redux: every read comes from the store, not the API',
            ],
        },
        {
            id: 'simple-url-scraper',
            description: 'URL scraper library, published as an npm package',
            bullets: [
                'Built a simple interface: give it a URL, get back its metadata, headers and links',
                'Designed it as a tool for AI agents to call',
            ],
        },
        {
            id: 'vacation-tracker',
            description: 'Express app with admin CRUD and AI recommendations per destination',
            bullets: [
                'Built role-based auth (user/admin) with chained middlewares that gate admin-only CRUD',
                'Exposed DB queries as MCP tools via express-mcp-handler; AI layer returns structured JSON per destination',
            ],
        },
        {
            id: 'freelance-price-proposal',
            description: "Claude skill that turns a freelancer's raw notes into a price proposal",
            bullets: [
                'Designed it to output a client-ready proposal plus a private list of details the freelancer forgot',
                'Built it from real proposals gathered from working freelancers; works in any language and profession',
            ],
        },
    ],

    education: [
        {
            id: 'john-bryce',
            title: 'Full Stack & AI Development Track',
            org: 'John Bryce Academy',
            bullets: [
                'Intensive full-stack program integrated with AI: RAG pipelines, MCP servers, AI agents, OpenAI API',
                'Emphasis on clean architecture, layered backends and state management',
            ],
        },
    ],

    military: [
        {
            id: 'idf-officer',
            title: 'Field Intelligence Combat Officer & Operations Officer',
            org: 'Israel Defense Forces (IDF)',
            text: 'Led a platoon of combat soldiers under extreme pressure, making critical calls on the fly. Ran the operations room with clear multi-channel communication and full accountability for task management.',
        },
    ],
};
