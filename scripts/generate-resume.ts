/**
 * Regenerates the machine-readable resume outputs from src/data/resume.data.ts:
 *   - public/resume.json  (JSON Resume format)
 *   - public/resume.md    (plain Markdown)
 *   - index.html          (JSON-LD + <noscript> blocks between the "generated:" markers)
 *
 * Runs automatically before `npm run build` (see "prebuild" in package.json).
 * Node 22.18+ / 24 runs this file directly via its built-in TypeScript type stripping.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resume } from '../src/data/resume.data.ts';
import { OUTPUT_FILES, toJsonLd, toJsonResume, toMarkdown, toNoscriptHtml } from './formats.ts';

const root = fileURLToPath(new URL('..', import.meta.url));

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replaces everything between `<!-- generated:<name>:start -->` and
 * `<!-- generated:<name>:end -->`, re-indenting the body to match the markers.
 */
function replaceGeneratedBlock(html: string, name: string, body: string, eol: string): string {
    const start = `<!-- generated:${name}:start -->`;
    const end = `<!-- generated:${name}:end -->`;
    const block = new RegExp(`^([ \\t]*)${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`, 'm');
    if (!block.test(html)) {
        throw new Error(`index.html is missing the "${start}" … "${end}" markers`);
    }
    return html.replace(block, (_match: string, indent: string) =>
        [start, ...body.split('\n'), end].map((line) => indent + line).join(eol),
    );
}

function jsonLdScript(data: unknown): string {
    // "<" is escaped so the JSON can never terminate the <script> element early.
    const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
    return `<script type="application/ld+json">\n${json}\n</script>`;
}

writeFileSync(join(root, 'public', OUTPUT_FILES.JSON), `${JSON.stringify(toJsonResume(resume), null, 2)}\n`);
writeFileSync(join(root, 'public', OUTPUT_FILES.Markdown), toMarkdown(resume));

const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const eol = html.includes('\r\n') ? '\r\n' : '\n';
let nextHtml = replaceGeneratedBlock(html, 'jsonld', jsonLdScript(toJsonLd(resume)), eol);
nextHtml = replaceGeneratedBlock(nextHtml, 'noscript', toNoscriptHtml(resume), eol);
if (nextHtml !== html) {
    writeFileSync(htmlPath, nextHtml);
}

console.log('resume: wrote public/resume.json, public/resume.md and refreshed the index.html blocks');
