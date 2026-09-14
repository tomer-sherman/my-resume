/**
 * Shape of the resume content. The single source of truth for the content
 * itself is `src/data/resume.data.ts`; the site, `public/resume.json`,
 * `public/resume.md` and the JSON-LD / noscript blocks in `index.html` are all
 * rendered from that one object.
 */

/** Calendar month in ISO form, e.g. "2026-03". Used verbatim in `<time dateTime>` and JSON Resume dates. */
export type IsoMonth = string;

export type Period = {
    start: IsoMonth;
    /** Omitted while the entry is ongoing (rendered as "Present"). */
    end?: IsoMonth;
};

export type ExternalLink = {
    label: string;
    href: string;
};

export type SocialLink = ExternalLink & {
    /** Network name, used for JSON Resume `profiles`. */
    network: string;
    /** Only profile pages have one; links without it (e.g. mailto:) are kept out of `profiles` / `sameAs`. */
    username?: string;
};

export type Basics = {
    name: string;
    title: string;
    tagline: string;
    intro: string;
    email: string;
    phone: string;
    location: {
        city: string;
        country: string;
        /** ISO 3166-1 alpha-2, for JSON Resume / JSON-LD. */
        countryCode: string;
    };
    /** Canonical URL of the deployed site, with a trailing slash. */
    siteUrl: string;
    /** Profile picture file in `public/`. */
    image: string;
};

export type Section = {
    /** Used for element ids (`aria-labelledby`) and React keys. */
    id: string;
    title: string;
};

export type SkillGroup = Section & {
    items: string[];
    /** Muted footnote rendered under the chips. */
    note?: string;
};

export type Role = {
    title: string;
    description: string;
};

export type TimelineEntry = {
    id: string;
    period: Period;
    title: string;
    org?: string;
    url?: string;
    /** JSON Resume `education.area`; not rendered on the site. */
    area?: string;
    summary?: string;
    bullets?: string[];
    /** Sub-roles with their own bold heading and paragraph. */
    roles?: Role[];
};

export type TimelineSection = Section & {
    /** Which JSON Resume list the entries belong to. */
    kind: 'education' | 'work';
    entries: TimelineEntry[];
};

export type Project = {
    id: string;
    name: string;
    /** Short qualifier shown next to the name, e.g. "npm package". */
    kind?: string;
    /** Small logo shown inside the `kind` badge; a file under `public/`, e.g. "icons/npm.svg". */
    icon?: string;
    stack: string[];
    bullets: string[];
    links: ExternalLink[];
};

export type ProjectsSection = Section & { items: Project[] };

export type ListSection = Section & { items: string[] };

export type ContactLine = {
    icon: string;
    text: string;
};

export type ContactSection = Section & { lines: ContactLine[] };

export type Language = {
    language: string;
    fluency: string;
};

export type Resume = {
    basics: Basics;
    socials: SocialLink[];
    skills: SkillGroup[];
    principles: ListSection;
    contact: ContactSection;
    experience: TimelineSection;
    projects: ProjectsSection;
    life: TimelineSection;
    languages: Language[];
};
