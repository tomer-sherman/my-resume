/**
 * HTML template for the resume PDFs.
 *
 * The wording comes from `content/<lang>.ts`. The facts that must never drift from the site (name of each
 * project, stack lists, links, phone, email, profile URLs, dates) are read straight from `src/data/resume.data.ts`,
 * so a changed phone number or repo URL reaches the PDFs on the next `npm run export:pdf`.
 */
import { resume } from '../src/data/resume.data.ts';
import type { Period, Project, TimelineEntry } from '../src/models/resume.model.ts';

export type PdfCopy = {
    lang: 'en' | 'he';
    dir: 'ltr' | 'rtl';
    /** `<title>`; Chrome also writes it as the PDF's Title metadata. */
    documentTitle: string;
    name: string;
    headline: string;
    location: string;
    /** Label for an ongoing period, e.g. "Present". */
    present: string;
    /** "Mar 2026" (short) or "מרץ 2026" (long), formatted with Intl for `lang`. */
    monthStyle: 'short' | 'long';
    headings: { summary: string; skills: string; projects: string; education: string; military: string };
    summary: string;
    skills: { label: string; items: string[] }[];
    /** Rendered as the last Skills row; mirrors `languages` in resume.data.ts, worded per language. */
    languages: { label: string; items: string[] };
    /** Display text for the site's link labels ("Live", "Code", "npm"); unmapped labels are shown as-is. */
    linkLabels: Record<string, string>;
    /** Keyed by the site's project id. Name, stack and links come from the site. */
    projects: { id: string; description: string; bullets: string[] }[];
    /** Keyed by the site's timeline entry id. Dates come from the site. */
    education: { id: string; title: string; org: string; bullets: string[] }[];
    military: { id: string; title: string; org: string; text: string }[];
};

function esc(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** "https://github.com/tomer-sherman/" -> "github.com/tomer-sherman" */
function shortUrl(href: string): string {
    return href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function siteProject(id: string): Project {
    const project = resume.projects.items.find((item) => item.id === id);
    if (!project) throw new Error(`PDF copy references project "${id}", which is not in resume.data.ts`);
    return project;
}

function siteEntry(id: string): TimelineEntry {
    const entry = [...resume.experience.entries, ...resume.life.entries].find((item) => item.id === id);
    if (!entry) throw new Error(`PDF copy references timeline entry "${id}", which is not in resume.data.ts`);
    return entry;
}

function formatPeriod(period: Period, copy: PdfCopy): string {
    const format = new Intl.DateTimeFormat(copy.lang, { month: copy.monthStyle, year: 'numeric', timeZone: 'UTC' });
    const month = (iso: string) => format.format(new Date(`${iso}-01T00:00:00Z`));
    return `${month(period.start)} – ${period.end ? month(period.end) : copy.present}`;
}

/** LTR tokens (tech names, URLs, phone) are isolated so they keep their order inside RTL text. */
function ltr(html: string): string {
    return `<span dir="ltr">${html}</span>`;
}

function link(href: string, html: string): string {
    return `<a href="${esc(href)}">${html}</a>`;
}

/**
 * Items joined with a middle dot. Each item is an auto-direction isolate: English tech names stay LTR, a Hebrew
 * item (e.g. the languages row) stays RTL, and the dots resolve to the page direction.
 */
function dotList(items: string[]): string {
    return items.map((item) => `<bdi>${esc(item)}</bdi>`).join('<span class="Dot"> · </span>');
}

/**
 * Three deliberate lines (the photo narrows the column, and a wrapped line would leave a dangling "|"):
 * where to reach him, his profiles, then this resume's site.
 */
function contactLines(copy: PdfCopy): string[][] {
    const { phone, email, siteUrl } = resume.basics;
    const profiles = resume.socials.filter((social) => social.username);
    return [
        [
            esc(copy.location),
            link(`tel:${phone.replace(/[^+\d]/g, '')}`, ltr(esc(phone))),
            link(`mailto:${email}`, ltr(esc(email))),
        ],
        profiles.map((social) => link(social.href, ltr(esc(shortUrl(social.href))))),
        [link(siteUrl, ltr(esc(shortUrl(siteUrl))))],
    ];
}

function section(id: string, title: string, body: string): string {
    return `
<section aria-labelledby="${id}">
  <h2 id="${id}">${esc(title)}</h2>
  ${body}
</section>`;
}

function bullets(items: string[]): string {
    return items.length ? `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : '';
}

/**
 * "Title | Org" row. Both halves are isolates: otherwise, in RTL, a title ending in English ("… ו-AI") and an
 * English org ("John Bryce Academy") merge across the "|" into one LTR run and swap places. The title isolate takes
 * the page direction (not auto), so a Hebrew title that happens to start with an English word stays RTL.
 */
function entryHead(title: string, org: string, period: string, dir: PdfCopy['dir']): string {
    return `
  <div class="Row">
    <h3><strong><bdi dir="${dir}">${esc(title)}</bdi></strong><span class="Org"> | <bdi>${esc(org)}</bdi></span></h3>
    <span class="Date">${esc(period)}</span>
  </div>`;
}

/** `styles` and `photo` (a data: URL) are inlined, so the page needs no network or file:// access. */
export function renderHtml(copy: PdfCopy, styles: string, photo: string): string {
    const skills = [...copy.skills, copy.languages]
        .map((row) => `<div class="Skill"><dt>${esc(row.label)}:</dt><dd>${dotList(row.items)}</dd></div>`)
        .join('');

    const projects = copy.projects
        .map((item) => {
            const site = siteProject(item.id);
            const links = site.links
                .map((l) => link(l.href, `<bdi>${esc(copy.linkLabels[l.label] ?? l.label)}</bdi>`))
                .join('<span class="Dot"> | </span>');
            return `
<article>
  <div class="Row">
    <h3><strong>${ltr(esc(site.name))}</strong><span class="Desc"> | <bdi dir="${copy.dir}">${esc(item.description)}</bdi></span></h3>
    <span class="Links">${links}</span>
  </div>
  <p class="Stack">${dotList(site.stack)}</p>
  ${bullets(item.bullets)}
</article>`;
        })
        .join('');

    const education = copy.education
        .map((item) => `<article>${entryHead(item.title, item.org, formatPeriod(siteEntry(item.id).period, copy), copy.dir)}${bullets(item.bullets)}</article>`)
        .join('');

    const military = copy.military
        .map((item) => `<article>${entryHead(item.title, item.org, formatPeriod(siteEntry(item.id).period, copy), copy.dir)}<p>${esc(item.text)}</p></article>`)
        .join('');

    return `<!doctype html>
<html lang="${copy.lang}" dir="${copy.dir}">
<head>
<meta charset="utf-8">
<title>${esc(copy.documentTitle)}</title>
<style>
${styles}
</style>
</head>
<body>
<header>
  <div class="Intro">
    <h1>${esc(copy.name)}</h1>
    <p class="Headline">${esc(copy.headline)}</p>
    ${contactLines(copy)
        .map((items) => `<p class="Contact">${items.map((item) => `<span class="Item">${item}</span>`).join('<span class="Dot"> | </span>')}</p>`)
        .join('\n    ')}
  </div>
  <img class="Photo" src="${photo}" alt="${esc(copy.name)}">
</header>
<main>
${section('summary', copy.headings.summary, `<p>${esc(copy.summary)}</p>`)}
${section('skills', copy.headings.skills, `<dl>${skills}</dl>`)}
${section('projects', copy.headings.projects, projects)}
${section('education', copy.headings.education, education)}
${section('military', copy.headings.military, military)}
</main>
</body>
</html>
`;
}
