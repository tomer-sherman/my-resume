/**
 * Pure transformations from the resume data into the machine-readable outputs.
 * No I/O here; `generate-resume.ts` writes the files.
 */
import type { Project, Resume, TimelineEntry, TimelineSection } from '../src/models/resume.model.ts';
import { formatPeriod, formatStack } from '../src/utils/format.ts';

const JSON_RESUME_SCHEMA = 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json';

/** Files written into `public/`, keyed by the label used when linking to them. */
export const OUTPUT_FILES = {
    JSON: 'resume.json',
    Markdown: 'resume.md',
} as const;

/** Absolute URL of a file served from `public/`. */
function publicUrl(resume: Resume, file: string): string {
    return new URL(file, resume.basics.siteUrl).href;
}

function stripMailto(href: string): string {
    return href.replace(/^mailto:/, '');
}

/** Socials that are real profile pages (GitHub, LinkedIn), not mailto: links. */
function profiles(resume: Resume) {
    return resume.socials.filter((social) => social.username);
}

function timelineEntries(resume: Resume, kind: TimelineSection['kind']): TimelineEntry[] {
    return [resume.experience, resume.life]
        .filter((section) => section.kind === kind)
        .flatMap((section) => section.entries);
}

function entryHighlights(entry: TimelineEntry): string[] {
    return [
        ...(entry.bullets ?? []),
        ...(entry.roles ?? []).map((role) => `${role.title}: ${role.description}`),
    ];
}

/* ---------- JSON Resume (https://jsonresume.org/schema) ---------- */

function toWork(entry: TimelineEntry) {
    return {
        name: entry.org ?? entry.title,
        position: entry.title,
        url: entry.url,
        startDate: entry.period.start,
        endDate: entry.period.end,
        summary: entry.summary,
        highlights: entryHighlights(entry),
    };
}

function toEducation(entry: TimelineEntry) {
    return {
        institution: entry.org ?? entry.title,
        url: entry.url,
        area: entry.area,
        studyType: entry.title,
        startDate: entry.period.start,
        endDate: entry.period.end,
        // Not in the schema, but nested objects accept extra properties.
        summary: entry.summary,
        courses: entry.bullets ?? [],
    };
}

function toProject(project: Project) {
    const [description, ...highlights] = project.bullets;
    return {
        name: project.name,
        type: project.kind,
        description,
        highlights,
        keywords: project.stack,
        url: project.links[0]?.href,
        // Extra property: keeps every link (Live / Code / npm), not just the first.
        links: project.links.map((link) => ({ label: link.label, url: link.href })),
    };
}

export function toJsonResume(resume: Resume) {
    const { basics } = resume;
    return {
        $schema: JSON_RESUME_SCHEMA,
        basics: {
            name: basics.name,
            label: basics.title,
            headline: basics.tagline,
            image: publicUrl(resume, basics.image),
            email: basics.email,
            phone: basics.phone,
            url: basics.siteUrl,
            summary: basics.intro,
            location: {
                city: basics.location.city,
                countryCode: basics.location.countryCode,
            },
            profiles: profiles(resume).map((social) => ({
                network: social.network,
                username: social.username,
                url: social.href,
            })),
        },
        work: timelineEntries(resume, 'work').map(toWork),
        education: timelineEntries(resume, 'education').map(toEducation),
        skills: resume.skills.map((group) => ({ name: group.title, keywords: group.items })),
        projects: resume.projects.items.map(toProject),
        languages: resume.languages,
        meta: { canonical: publicUrl(resume, 'resume.json') },
    };
}

/* ---------- JSON-LD (schema.org Person) ---------- */

export function toJsonLd(resume: Resume) {
    const { basics } = resume;
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: basics.name,
        jobTitle: basics.title,
        description: basics.intro,
        url: basics.siteUrl,
        image: publicUrl(resume, basics.image),
        email: `mailto:${basics.email}`,
        telephone: basics.phone,
        address: {
            '@type': 'PostalAddress',
            addressLocality: basics.location.city,
            addressCountry: basics.location.countryCode,
        },
        sameAs: profiles(resume).map((social) => social.href),
        knowsAbout: resume.skills.flatMap((group) => group.items),
    };
}

/* ---------- <noscript> fallback ---------- */

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function htmlLink(label: string, href: string, text = href): string {
    return `${escapeHtml(label)}: <a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
}

export function toNoscriptHtml(resume: Resume): string {
    const { basics, socials } = resume;
    const links = [
        ...socials.map((social) => htmlLink(social.label, social.href, stripMailto(social.href))),
        ...Object.entries(OUTPUT_FILES).map(([label, file]) => htmlLink(`Resume (${label})`, publicUrl(resume, file))),
    ];
    return [
        '<noscript>',
        '  <p>',
        `    <strong>${escapeHtml(basics.name)}</strong> — ${escapeHtml(basics.title)}.`,
        `    ${escapeHtml(basics.tagline)}.`,
        `    ${escapeHtml(basics.intro)}`,
        `    ${links.join(' · ')}`,
        '  </p>',
        '</noscript>',
    ].join('\n');
}

/* ---------- Markdown ---------- */

function entryHeading(entry: TimelineEntry): string {
    return entry.org ? `${entry.title} — ${entry.org}` : entry.title;
}

function timelineMarkdown(section: TimelineSection): string[] {
    const lines = [`## ${section.title}`, ''];
    for (const entry of section.entries) {
        lines.push(`### ${entryHeading(entry)}`, '', formatPeriod(entry.period), '');
        if (entry.summary) lines.push(entry.summary, '');
        if (entry.bullets?.length) lines.push(...entry.bullets.map((bullet) => `- ${bullet}`), '');
        for (const role of entry.roles ?? []) lines.push(`#### ${role.title}`, '', role.description, '');
    }
    return lines;
}

function projectMarkdown(project: Project): string[] {
    const heading = project.kind ? `${project.name} (${project.kind})` : project.name;
    const links = project.links.map((link) => `[${link.label}](${link.href})`).join(' · ');
    return [
        `### ${heading}`, '',
        formatStack(project.stack), '',
        ...project.bullets.map((bullet) => `- ${bullet}`), '',
        `Links: ${links}`, '',
    ];
}

export function toMarkdown(resume: Resume): string {
    const { basics, socials } = resume;
    const lines: string[] = [
        `# ${basics.name}`, '',
        basics.title, '',
        basics.tagline, '',
        basics.intro, '',
        `## ${resume.contact.title}`, '',
        ...socials.map((social) => `- ${social.label}: ${stripMailto(social.href)}`),
        `- Phone: ${basics.phone}`,
        `- Location: ${basics.location.country} – ${basics.location.city}`,
        `- Website: ${basics.siteUrl}`,
        '',
        ...timelineMarkdown(resume.experience),
        `## ${resume.projects.title}`, '',
        ...resume.projects.items.flatMap(projectMarkdown),
        ...timelineMarkdown(resume.life),
        '## Skills', '',
        ...resume.skills.map((group) => {
            const note = group.note ? ` (${group.note})` : '';
            return `- ${group.title}: ${group.items.join(', ')}${note}`;
        }),
        '',
        `## ${resume.principles.title}`, '',
        ...resume.principles.items.map((item) => `- ${item}`),
        '',
    ];
    if (resume.languages.length) {
        lines.push('## Languages', '', ...resume.languages.map((l) => `- ${l.language}: ${l.fluency}`), '');
    }
    return lines.join('\n');
}
