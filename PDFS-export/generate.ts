/**
 * Prints the English and Hebrew resume PDFs into this folder:
 *   PDFS-export/Tomer-Sherman-Resume-EN.pdf
 *   PDFS-export/Tomer-Sherman-Resume-HE.pdf
 *
 * Run with `npm run export:pdf` (Node 22.18+ / 24 runs this .ts file directly).
 * `--html` also writes the rendered HTML to the OS temp dir, for debugging the layout in a browser.
 *
 * After printing it checks each PDF (page count, embedded fonts, link targets) and exits non-zero on a problem.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer, { type Browser } from 'puppeteer';
import { resume } from '../src/data/resume.data.ts';
import { en } from './content/en.ts';
import { he } from './content/he.ts';
import { renderHtml, type PdfCopy } from './template.ts';

const here = fileURLToPath(new URL('.', import.meta.url));

const JOBS: { copy: PdfCopy; file: string }[] = [
    { copy: en, file: 'Tomer-Sherman-Resume-EN.pdf' },
    { copy: he, file: 'Tomer-Sherman-Resume-HE.pdf' },
];

const MAX_PAGES = 2;
const MARGIN_MM = { top: 12, bottom: 12, left: 14, right: 14 };
const A4_MM = { width: 210, height: 297 };
const PX_PER_MM = 96 / 25.4;

/** Static weights only: Chrome's PDF backend does not embed variable fonts as normal text fonts. */
const FONT_FILES: Record<number, string> = {
    400: 'Heebo-Regular.ttf',
    500: 'Heebo-Medium.ttf',
    600: 'Heebo-SemiBold.ttf',
    700: 'Heebo-Bold.ttf',
};

/** Fonts are inlined as data: URLs so the page never needs the network or file:// access. */
function fontFaceCss(): string {
    return Object.entries(FONT_FILES)
        .map(([weight, file]) => {
            const data = readFileSync(join(here, 'fonts', file)).toString('base64');
            return `@font-face { font-family: 'Heebo'; font-weight: ${weight}; font-style: normal; src: url(data:font/ttf;base64,${data}) format('truetype'); }`;
        })
        .join('\n');
}

/** The site's profile picture (`basics.image` in public/), inlined as a data: URL. */
function photoDataUrl(): string {
    const file = resume.basics.image;
    const ext = file.split('.').pop()?.toLowerCase();
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    return `data:${mime};base64,${readFileSync(join(here, '..', 'public', file)).toString('base64')}`;
}

async function launchBrowser(): Promise<Browser> {
    try {
        return await puppeteer.launch({ channel: 'chrome' }); // the locally installed Chrome
    } catch (error) {
        console.warn(`Installed Chrome failed to launch (${(error as Error).message}); trying Puppeteer's own Chrome`);
        return await puppeteer.launch(); // `npx puppeteer browsers install chrome`
    }
}

/** Plain-text scan of the PDF. Chrome writes page, font and link dictionaries uncompressed. */
function inspectPdf(pdf: Buffer) {
    const text = pdf.toString('latin1');
    const pages = text.match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
    const fonts = new Set([...text.matchAll(/\/BaseFont\s*\/(?:[A-Z]{6}\+)?([^\s/<>[\]()]+)/g)].map((m) => m[1]));
    // Type 3 = glyphs drawn as unnamed paths (what Chrome does with a variable font); it has no /BaseFont to check.
    const type3 = /\/Subtype\s*\/Type3/.test(text);
    // PDF literal strings escape "(", ")" and "\" with a backslash.
    const links = [...text.matchAll(/\/URI\s*\(((?:\\.|[^\\)])*)\)/g)].map((m) => m[1].replace(/\\(.)/g, '$1'));
    return { pages, fonts: [...fonts], type3, links };
}

const styles = `${fontFaceCss()}\n${readFileSync(join(here, 'template.css'), 'utf8')}`;
const photo = photoDataUrl();
const contentWidthPx = Math.round((A4_MM.width - MARGIN_MM.left - MARGIN_MM.right) * PX_PER_MM);
const contentHeightPx = (A4_MM.height - MARGIN_MM.top - MARGIN_MM.bottom) * PX_PER_MM;
const problems: string[] = [];

const browser = await launchBrowser();
try {
    for (const { copy, file } of JOBS) {
        const html = renderHtml(copy, styles, photo);
        if (process.argv.includes('--html')) {
            const htmlPath = join(tmpdir(), file.replace(/\.pdf$/, '.html'));
            writeFileSync(htmlPath, html);
            console.log(`HTML: ${htmlPath}`);
        }

        const page = await browser.newPage();
        await page.setViewport({ width: contentWidthPx, height: Math.round(contentHeightPx) });
        await page.setContent(html, { waitUntil: 'load' });
        await page.emulateMediaType('print');
        const fontStatus = await page.evaluate(async () => {
            await document.fonts.ready;
            return [...document.fonts].map((face) => `${face.family} ${face.weight}: ${face.status}`);
        });
        const failedFonts = fontStatus.filter((status) => status.endsWith('error'));
        if (failedFonts.length) problems.push(`${file}: fonts failed to load: ${failedFonts.join(', ')}`);

        const contentHeight = await page.evaluate(() => document.body.getBoundingClientRect().height);
        // Resolved by the same URL parser Chrome uses for the PDF link annotations.
        const expectedLinks = await page.$$eval('a[href]', (anchors) => anchors.map((a) => (a as HTMLAnchorElement).href));
        const pdf = Buffer.from(
            await page.pdf({
                format: 'A4',
                printBackground: true,
                tagged: true,
                margin: {
                    top: `${MARGIN_MM.top}mm`,
                    bottom: `${MARGIN_MM.bottom}mm`,
                    left: `${MARGIN_MM.left}mm`,
                    right: `${MARGIN_MM.right}mm`,
                },
            }),
        );
        await page.close();
        writeFileSync(join(here, file), pdf);

        const { pages, fonts, type3, links } = inspectPdf(pdf);
        const fill = Math.round((contentHeight / contentHeightPx) * 100);
        console.log(`${file}: ${pages} page(s), content ≈ ${fill}% of one page, fonts: ${fonts.join(', ')}, ${links.length} links`);

        if (pages < 1 || pages > MAX_PAGES) problems.push(`${file}: ${pages} pages (allowed 1-${MAX_PAGES})`);
        if (pages === 2 && fill < 125) problems.push(`${file}: page 2 is mostly empty (≈${fill - 100}% used); trim content back to one page`);
        const foreignFonts = fonts.filter((font) => !font.startsWith('Heebo'));
        if (foreignFonts.length) problems.push(`${file}: fallback fonts embedded (a glyph Heebo lacks?): ${foreignFonts.join(', ')}`);
        if (type3) problems.push(`${file}: Type 3 fonts embedded (a variable font in fonts/?); use static TTFs`);
        const missingLinks = expectedLinks.filter((href) => !links.includes(href));
        if (missingLinks.length) problems.push(`${file}: missing link annotations: ${missingLinks.join(', ')}`);

        const siteOnly = resume.projects.items.filter((item) => !copy.projects.some((p) => p.id === item.id));
        if (siteOnly.length) console.warn(`  note: site projects not in the ${copy.lang} PDF: ${siteOnly.map((p) => p.id).join(', ')}`);
    }
} finally {
    await browser.close();
}

if (problems.length) {
    console.error(`\n${problems.map((p) => `✗ ${p}`).join('\n')}`);
    process.exitCode = 1;
}
