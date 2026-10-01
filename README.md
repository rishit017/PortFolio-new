# Rishit Rajput — Portfolio

A minimal, editorial single-page portfolio. Plain HTML + CSS + vanilla JS.
No build step, no dependencies, no framework.

```
portfolio/
├── index.html   ← markup
├── style.css    ← all styles
├── script.js    ← all behaviour
└── README.md
```

Keep the three files together in the same folder. No build step, no
dependencies — open `index.html` from disk or drop the folder on any static
host.

All content in the page is real: two projects (Krishi Setu, TrackXpress),
GitHub `rishit017`, email `rishitrajput2006@gmail.com`, Vadodara (India).
Nothing is fabricated.

---

## Run it locally

Open `index.html` in a browser (the CSS and JS load from the same folder), or
serve the folder:

```bash
cd portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

Any static host works — GitHub Pages, Netlify, Vercel, Cloudflare Pages.
Upload the folder and point at `index.html`.

## Development activity (removed)

The former `04.1 Development activity` section (live GitHub API stats and
repo list) was removed at the user's request — Education now flows directly
into Certificates. Profile links (GitHub, LeetCode, LinkedIn) live on in the
footer's "Elsewhere" column.

## Design system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Page |
| `--bg-alt` | `#FAFAF8` | Contact band, subtle hovers |
| `--ink` | `#111111` | Headings, primary text |
| `--ink-2` | `#33332F` | Body text |
| `--muted` | `#77776F` | Secondary text |
| `--line` | `#E9E8E3` | Hairline rules |
| `--accent` | `#B23A1E` | One restrained accent: status dot, section numbers, focus ring |

Type: **Inter Tight** (display) / **Inter** (body) / **JetBrains Mono** (labels,
numbers, meta). Loaded from Google Fonts with a system fallback stack, so the
page still renders correctly offline.

Motion is deliberately minimal: scroll reveals, underline growth, small arrow
shifts, a 1px scroll progress line. Everything is disabled under
`prefers-reduced-motion`.

## Dark mode

The icon button at the right of the nav (moon in light, sun in dark) flips
`data-theme` on `<html>`, swapping one token block (`:root[data-theme="dark"]`)
— the whole site is painted from those tokens, so both themes stay identical in
structure. The default is always the light theme; an explicit choice persists in
`localStorage` (`rr-theme`), and an inline script in `<head>` applies the theme
before first paint so there is no flash. `theme-color` and the favicon follow
the theme. The footer is an inverted surface (`background:var(--ink);
color:var(--bg)`), so it is black on the light theme and white on the dark one. Switching runs a blink-free circular veil wipe: a solid disc of the new
theme's background grows from the toggle, the swap happens hidden beneath it,
then the disc fades so content eases in. Pure CSS/DOM — identical in every
browser; `prefers-reduced-motion` switches instantly.

---

## Adding things later

**Krishi Setu live demo** — the old Vercel deployment
(`krishi-setu-2hyn.vercel.app`) now returns 404, so the Live row was removed to
keep every link on the page working. If you redeploy it, add back inside the
Krishi Setu `.kv`:

```html
<div>
  <dt>Live</dt>
  <dd><a class="ulink" href="https://YOUR-NEW-DEPLOYMENT.vercel.app"
     target="_blank" rel="noopener noreferrer">YOUR-NEW-DEPLOYMENT.vercel.app <span aria-hidden="true">↗</span></a></dd>
</div>
```

**Contact icons** — the centred contact band shows mail / GitHub / LinkedIn as
icon buttons in `.contact__icons`. To add or change one, copy an existing
`<a class="contact__icon" …>` (inline SVG + `aria-label`), point `href` at the
real profile, and keep `target="_blank" rel="noopener noreferrer"` for external
links.

…and a matching `<li><a class="ulink" …>LinkedIn</a></li>` in `.footer__links`.

**Certificates** — six cards in `#certificates`, each a base64-embedded JPEG (grayscale at rest via CSS, original colours on hover). To swap one: render page 1 of the new PDF to a ~1100px-wide JPEG (`pdftoppm -jpeg -jpegopt quality=70 -scale-to-x 1100 -scale-to-y -1`), base64-encode it, and replace that card's `src`; update the caption lines under it. Verify links must stay real. Each card's small ↓ button downloads the original PDF (embedded as a base64 data URI, so it works from any host); keep `download` filenames and payloads in sync when swapping.

**Replacing the CV** — the `CV ↓` button (top right) and the mobile menu's `Download CV` link carry your PDF embedded as a base64 data URI, so the download works from any host with zero extra files. To swap in a newer CV, encode it (`base64 -w0 NEW.pdf`) and replace the data URI in both `href`s in `index.html`.

**Project screenshot** — inside any `.project__main` or after `.project__grid`:

```html
<figure class="project__fig">
  <img src="img/krishi-setu.png" alt="Krishi Setu mandi price list" loading="lazy">
</figure>
```

Images render grayscale and gently regain colour on hover. Keep them to one
per project so the page stays quiet.

**New project** — copy one `<article class="project">` block, bump the number,
add `project--rev` to alternate the column order.
