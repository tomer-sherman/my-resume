# PDFS-export — agent guide

Print-ready resume PDFs (English + Hebrew) for job applications. The site data in `src/data/resume.data.ts` is
the source of truth; this folder holds a condensed 1-page wording of it plus the generator. Nothing here is part
of the Vite build or the gh-pages deploy (Vite only bundles `src/` + `public/`; `tsc -b` doesn't reference this folder).

## File map

- `content/en.ts`, `content/he.ts`: all PDF wording, one file per language (typed `PdfCopy`).
- `template.ts`: `PdfCopy` type + `renderHtml()`. Pulls project names, stacks, links, phone, email, profile URLs
  and dates from `resume.data.ts` by id, so those can't drift.
- `template.css`: all styling (A4, single column, one accent `--accent`).
- `generate.ts`: renders both languages, prints them with Puppeteer and checks the output.
- `fonts/`: static Heebo TTFs (400/500/600/700) + `OFL.txt`. Inlined into the HTML as base64 at print time.
- Photo: the site avatar `public/<basics.image>` (`pic.jpeg`), inlined the same way; `.Photo` in `template.css`.
- `tsconfig.json`: type-check only: `npx tsc -p PDFS-export`.
- `Tomer-Sherman-Resume-EN.pdf`, `Tomer-Sherman-Resume-HE.pdf`: output (committed).

## Regenerate

```bash
npm run export:pdf          # writes both PDFs into PDFS-export/, prints page count / fill % / fonts / links
npm run export:pdf -- --html  # also dumps the HTML to the OS temp dir for debugging in a browser
```

Exits non-zero if: >2 pages, a 2nd page that's mostly empty, any non-Heebo font embedded (glyph fallback), a
font failed to load, or an expected link annotation is missing. It also warns when the site has a project the PDF
copy doesn't include.

Browser: `puppeteer.launch({ channel: 'chrome' })` (the installed Chrome), falling back to Puppeteer's own Chrome.
npm 12 blocks Puppeteer's postinstall download, so on a machine without Chrome run `npx puppeteer browsers install chrome`.

## Updating content

- Wording was condensed from `src/data/resume.data.ts` (`basics`, `skills`, `projects`, `experience` = John Bryce,
  `life` = IDF). Components under `src/components/` hold no text.
- Change a fact (phone, email, URL, stack, date) in `resume.data.ts` → just rerun; the template reads it.
- Name, headline, location, skills rows and education/military titles are wording in the content files (Hebrew
  needs its own text), so mirror any site change to those by hand in both files.
- Change wording → edit `content/en.ts` and mirror it in `content/he.ts`. Keys `projects[].id`, `education[].id`,
  `military[].id` must match ids in `resume.data.ts` (a missing id throws).
- New site project → add `{ id, description, bullets }` to both content files, then re-check it still fits one page.
- Languages row: `languages.items` in each content file, worded per language; mirror `languages` in `resume.data.ts`.

## Rules

- 1 page (2 max, only if cutting would remove real substance). The script reports "content ≈ N% of one page".
- ATS-friendly: single column, real text, standard section headings, visible URLs for contact links, no icons/emoji.
- Never invent content: every claim must trace to `resume.data.ts`. Missing facts → placeholder + tell the owner.
- Hebrew: natural Israeli CV Hebrew (not a literal translation), masculine forms (owner's choice), full RTL
  (`dir="rtl"`, `lang="he"`), tech/project names and URLs stay in English.
- Fonts are local (`fonts/`), never fetched from the network.

## Verify (after any change)

1. `npm run export:pdf`: no ✗ lines, both PDFs 1 page.
2. Render each page to PNG and look at it (no Python/poppler on this machine; use mupdf WASM from a scratch dir):
   `npm i mupdf` in a temp folder, then `Document.openDocument(buf, 'application/pdf')` →
   `page.toPixmap(Matrix.scale(1.5, 1.5), ColorSpace.DeviceRGB, false, true).asPNG()`.
   Check: nothing cut off, no tofu boxes, EN and HE layouts mirror each other.
3. Bidi (HE): phone, email, URLs, dates and tech names read in the right order; punctuation sits on the correct side.
4. Links: `page.getLinks()` in mupdf (or hover in a PDF viewer). Every contact + project link is clickable.
5. `npx tsc -p PDFS-export` and `npm run lint`.

## Gotchas

- **Static fonts only.** google/fonts ships Heebo only as a variable font, and Chrome embeds a variable font as
  Type 3 glyph paths with no font name (tested), which is worse for text extraction. Static TTFs embed as normal
  CIDFontType2 fonts. They come from `github.com/OdedEzer/heebo` (`fonts/ttf/`). The script fails on any Type 3 font.
- **Fonts are base64 `data:` URLs.** `page.setContent()` runs on `about:blank`, which can't load `file://` fonts.
  The script waits for `document.fonts.ready`, then fails if the PDF embeds any non-Heebo font. That catches a
  glyph Heebo lacks silently falling back to a system font. Keep content free of emoji and arrows (→).
- **RTL phone number.** In RTL, `+972 52-691-0602` renders as `52-691-0602 972+`. Phone, email, URLs and
  project names are wrapped in `<span dir="ltr">` (HTML gives `[dir]` `unicode-bidi: isolate`).
- **RTL "Title | Org" rows.** A Hebrew title ending in English (`… ו-AI`) plus an English org merge across the
  `|` into one LTR run and swap places. Title and project description are `<bdi dir="{page dir}">` (not auto: a
  Hebrew line starting with "Claude skill…" would otherwise flip to LTR); org and link labels are `<bdi>` (auto).
- **RTL lists.** Commas between English items land on odd sides in RTL. Items are joined with ` · ` and each one is
  a `<bdi>` (auto), so a Hebrew item like the languages value stays RTL. `:Frontend` (colon on the left) is
  correct RTL, not a bug.
- **RTL paint order vs. ATS text.** Chrome writes no space glyphs; extractors (pdf.js, pdf-parse) only infer a
  word break from a forward gap. Painting the right-hand cell first glued `:FrontendHTML/CSS` and
  `CryptoTrackerGitHub`. `template.css` paints the left cell first in Hebrew (`order: -1` on `dd`, `.Links`,
  `.Date`); layout and DOM order are unchanged. Keep this if you restructure rows.
- **No `letter-spacing` on Hebrew headings** (`:lang(he) h2`); it breaks up the letters.
- **URLs wrapping mid-string.** Contact items are `white-space: nowrap` and split into three deliberate lines
  (the photo narrows the column; a wrapped line left a dangling `|`).
- **Hebrew text extraction.** pdf.js and mupdf return mixed Hebrew/English lines in visual run order. Pure Hebrew
  and pure English runs are intact. PDFs store glyph runs by position, not in logical order, so this can't be
  fixed from HTML. For an ATS portal, send the EN PDF.
- **Page count** is a regex over Chrome's uncompressed `/Type /Page` dicts. "Content ≈ N%" is measured from the
  HTML at the printable width, so treat it as an estimate. The PDF page count is the authority.
