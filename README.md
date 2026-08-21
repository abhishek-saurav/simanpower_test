# Sagar International Manpower — website

A seven-page static marketing site for **simanpower.in**. Dark editorial design,
GSAP motion, no build step required to deploy, and **zero third-party requests** —
fonts and JavaScript libraries are all served from this folder.

---

## 1. Deploying

Upload the contents of this folder to your web root (`public_html/`, `www/`, or
whatever your host calls it). That is the whole deployment. There is no Node, no
npm, no compile step.

```
index.html          Home
about.html          About / story / leadership / credentials
services.html       Six services in detail
sectors.html        Eight sectors, ~200 trades
employers.html      Employer pitch + manpower request form
candidates.html     Candidate journey, openings, registration form
contact.html        Contact details + general enquiry form

assets/css/         main.css (design system), fonts.css (self-hosted @font-face)
assets/js/          main.js (interaction), vendor/ (GSAP, ScrollTrigger, Lenis)
assets/fonts/       Instrument Serif, Inter, JetBrains Mono — latin subsets
assets/img/         Photo drop folder — see assets/img/README.md
favicon.svg, robots.txt, sitemap.xml

_src/               Optional page sources (see §6)
build.py            Optional page assembler (see §6)
```

To preview locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Open the `.html` files directly from Finder if you prefer — everything works from
`file://` too, except that the browser will block nothing since there are no
cross-origin requests to block.

---

## 2. Before you go live — READ THIS

Content now comes from `updated_company_info.json`, which you supplied. Every value
in that file is on the site — legal name, tagline, mission text, licence and expiry,
all three offices, every phone and email, both directors, the six services, the
twelve industries, the seventeen named countries, and all forty-eight clients.

What still needs your attention:

### Blocking — the site cannot take a lead without these
- **The two Google Form links.** Both still read `forms.gle/REPLACE_WITH_...`, which
  goes nowhere. Every enquiry route on the site runs through them. See §3.

### Confirm before publishing
| Where | Claim | Why check |
|---|---|---|
| Home, About | **35 years** / founded 1990 in Dubai | Carried over from your old site, not in the JSON |
| Home, Employers | Stage timings (48h, 7–10 days, **30–55 days** total) | Written to a plausible pipeline — confirm against reality |
| Candidates | Sample openings table | **Sample data**, marked with an HTML comment. Salary bands were removed and replaced with "Ask for band" so nothing false is published. Replace with live vacancies or delete the table |
| Employers, Services | Trade testing at a Jalandhar centre, per-worker status sheets, 30/90-day check-ins, replacement cover | These read as promises to a client. Do not publish any you cannot keep |
| Candidates | Fee policy and its FAQ | Written conservatively and lawfully, but it must match what you actually charge |
| Sectors | Trade lists under each of the twelve industries | The industries are yours; the specific trades under them are plausible, not audited |
| About | Timeline entries for the 1990s, 2000s and 2020–22 | Narrative. The 1990 founding, both directors and the 2019 licence are real |

### The routes video has misspelled country names
`assets/video/hero.mp4` shows a routes map whose labels are garbled — visible at
full-bleed on the home page. Reading them off the frame:

| On screen | Should be |
|---|---|
| `DURAINE` | Ukraine |
| `CORRΩIA` | Croatia |
| `GOENIA` | Bosnia |
| `MONTENEORG` | Montenegro |
| `MONTH MASEDONIA` | North Macedonia |
| `SLOVANIA` | Slovakia |
| `ALGARIA` *and* `ALGERIA` | one of these is presumably Albania |

Publishing a coverage map with misspelled destination countries on a recruitment
site undermines exactly the credibility it is meant to build. **Regenerate the
video with correct spellings before launch**, then re-run the two ffmpeg commands
in §9 to replace the files.

The hub is also labelled **NEW DELHI**, while your head office is Jalandhar with a
branch in Lucknow — worth correcting in the same pass.

### Data quality in your own client list
Rendered verbatim, so several entries need a look:
- **"Abu Dhabi"** is a city, not a company — likely a truncated entry
- Probable typos: **Westren** Bainoona Group, Bnaa Alghad **Carpenty**, HRE **Constrction**
- Very short entries that may be incomplete: *Rose Wooden*, *Equipment & Machinery*,
  *Al.Qabdah*, *AUCC*, *Cerealcom*

I did not correct these — company names are legal entities and guessing at them is
worse than showing what you sent. Fix them in the JSON's spirit and re-edit the two
places they appear (`index.html` client marquee, `employers.html#clients` grid).

### Two taglines were supplied
The site uses **"Connecting Talent, Building Global Careers."** (hero, footer). The
alternative, *"Your Dreams, Our Direction, Global Opportunities."*, is unused. The
closing line of your about text — *"Your Talent. Your Future. The World Awaits."* —
appears on the About page.

### Gulf countries are unspecified in your data
Your JSON lists 17 named countries plus `"Gulf countries (unspecified list)"`. The
site therefore shows a single **"Gulf region"** chip alongside the 17 names rather
than inventing a country list. Your client roster is heavily UAE and Saudi Arabia —
if you want those named explicitly, add them to the JSON and tell me.

### No longer an issue
The licence expiry in your data is **19-11-2028**, so the lapsed-registration warning
from the earlier build is resolved. The validity date is now shown on the About page,
the contact page and in the footer.

## 3. The enquiry forms (Google Forms)

All three enquiry points send visitors to a Google Form. On the page they are
presented as a panel that says how long the form takes, what will be asked, and
offers email / phone / WhatsApp as alternatives — so the jump off-site does not
feel like a dead end.

**Both placeholder links need replacing before launch.** Right now they point at
`forms.gle/REPLACE_WITH_..._ID`, which goes nowhere.

Your data defines **two** forms — `recruiter_contact_form` and `resume_form` — so the
site uses two, not three. The contact page offers both rather than inventing a third.

| Placeholder | Used on | Your JSON key |
|---|---|---|
| `REPLACE_WITH_RECRUITER_CONTACT_FORM_ID` | `employers.html`, `contact.html` | `recruiter_contact_form` |
| `REPLACE_WITH_RESUME_FORM_ID` | `candidates.html`, `contact.html` | `resume_form` |

Each is marked with a large comment block in the HTML, so search for
`GOOGLE FORM LINK` to find them.

**To get each link:** open the form in Google Forms → **Send** → the link (chain)
icon → tick *Shorten URL* → **Copy**. You get something like
`https://forms.gle/aB3xY9pQ7`. Paste that in place of the whole placeholder URL:

```html
<a class="btn btn--primary btn--lg" href="https://forms.gle/aB3xY9pQ7" target="_blank" rel="noopener">
```

If you use `_src/` + `build.py`, edit `_src/pages/*.html` and rebuild instead.

**Build the Google Forms to match the panels.** Each panel lists the fields the
visitor is told to expect. If your form asks for different things, update the
checklist in the panel too, or the page will be promising one thing and the form
delivering another. The field lists that were on the old built-in forms are a
good starting point — see below.

**Also set, in each Google Form:** *Responses → link to Sheets* so enquiries land
somewhere you can sort them, and *Settings → Responses → Collect email addresses*
plus an email notification, so nobody has to remember to check the sheet.

### If you ever want the forms back on the site

The original built-in forms are preserved in `_src/optional-forms/`. Each file is
a complete drop-in replacement for the corresponding `.formlink` panel — paste it
back, rebuild, and add `data-endpoint="https://…"` on the `<form>` to point at
Formspree, Web3Forms, Basin or your own script. The CSS and JavaScript that drive
them (`.form`/`.field` styles, validation, ARIA wiring, mailto fallback) are still
in `assets/`, so nothing else needs changing.

## 4. Photos

Every image slot now has a real photo — the placeholder-gradient system in the
CSS is still there as a safety net (if a file ever goes missing, the panel falls
back to a designed gradient instead of a broken image) but nothing on the live
site is currently relying on it.

### The brand mark

`assets/simanpower_brand_logo.png`, the file you supplied, is used everywhere the
site shows a logo — header, footer, the loading-screen mark, and every favicon
size. It replaced a generic diamond icon that was never real. The master file
was cropped to its content, padded to a square, and rendered down into:

| File | Used for |
|---|---|
| `assets/img/brand/logo-mark-68.png` / `-136.png` | Header and footer mark (1x/2x) |
| `assets/img/brand/favicon-16/32/192/512.png` | Browser tab icon, various sizes |
| `assets/img/brand/apple-touch-icon.png` | iOS home-screen icon (opaque background — iOS renders transparency oddly) |
| `assets/img/og-cover.jpg` | Social share preview (WhatsApp/LinkedIn link cards) |
| `favicon.svg` | Fallback for browsers/readers that request an SVG icon directly (the PNG is embedded inside it) |

The original geometric diamond mark rotated 90° on hover — clean, because it was
symmetric. This mark is two running figures forming an S/M, which is not
symmetric, so a full rotation looked broken. Hover now does a small tilt and lift
instead (`assets/css/main.css`, `.logo:hover .logo__mark img`).

**To replace the logo:** drop the new file at
`assets/simanpower_brand_logo.png` (transparent PNG, reasonably high‑res) and
re-run the resize script in `_src/` — see `_src/logo-mark-master.png` and
`_src/simanpower_brand_logo-master.png`, the originals kept for exactly this.

### The nine site photos

Sourced from Unsplash (free license, commercial use permitted, no attribution
required) and matched to each slot's theme, then cropped to the exact ratio the
CSS renders at, graded to sit comfortably on a dark page (slight desaturation,
darkened, a warm shadow tint toward the brand palette), and compressed to
60–171 KB each — 1.06 MB total for all nine.

| File | Subject | Used on |
|---|---|---|
| `track-employers.jpg` | Two workers in PPE at a site | Home — dual track |
| `track-candidates.jpg` | Travelers with luggage, airport terminal | Home — dual track |
| `about-office.jpg` | Open-plan office, desks and screens | Home — about preview |
| `coverage-site.jpg` | Tower cranes against a clear sky | Home — coverage |
| `about-heritage.jpg` | B&W, workers on a building under construction | About — origin story |
| `svc-recruitment.jpg` | Two people shaking hands over a signed contract | Services — consultant |
| `svc-contract.jpg` | Welder, sparks, close-up | Services — contract staffing |
| `employers-site.jpg` | Crane and building against the sky | Employers page |
| `candidates-briefing.jpg` | Small group at a table, casual meeting | Candidates page |

None of these are Sagar International's own premises, staff, or clients —
they are stock photography chosen to match each section's subject, standing in
until real photography exists. Nothing on the page claims otherwise (no
captions assert these are "our office" as fact beyond a generic location tag),
but if that distinction matters to you, treat this list as what to replace
first. Same process as the logo: drop a new file at the same filename and
rebuild — the crop ratio for each slot is documented above if you supply a
different-shaped replacement.

### The two leadership portraits

`person-ram-awadh.jpg` and `person-pardeep-singh.jpg` are **not stock photos of
people** — they are generated monogram cards (initials in the site's own
display serif, a thin route-line flourish, the brand accent) at the same 4:5
ratio a real portrait would use. This was a deliberate choice: putting a stock
photo of an uninvolved person under a named real executive's name and title is
a step toward misrepresentation regardless of intent, in a way that a generic
site photo of a crane or an office is not. Swap these for real headshots
whenever they exist — same filenames, same 4:5 ratio, drop and rebuild.

### A real bug this surfaced

Every `.media` and `.track__bg` element used to take its photo through a CSS
custom property set as an inline style — `style="--media-src:url('assets/img/x.jpg')"`,
consumed via `background-image: var(--media-src, none)` in the stylesheet. That
pattern has a real, spec-correct gotcha: a relative `url()` inside a custom
property's value resolves against the *stylesheet* that consumes it, not the
HTML document that declared it — so every one of those paths was actually
resolving to `assets/css/assets/img/…`, a location that never existed. It was
invisible for months because no file was ever there to expose it; the CSS
fallback silently took over every time. Fixed by setting `background-image`
directly as the inline style instead (which resolves against the document,
correctly, and still works from `file://`), and by discovering — while
verifying that fix — a second, independent bug: `.media`'s own fallback
gradient (`.media::before`) is fully opaque, and a box's own background always
paints *behind* its own pseudo-elements regardless of z-index. So even with
the URL fixed, a real photo would have been permanently hidden behind the
placeholder. Both are fixed now (`assets/css/main.css` §"Late overrides" and
the `.media[style*="background-image"]::before` rule) and verified: all 11
image slots resolve to 200 responses and render with zero broken backgrounds
across all 7 pages.

## 5. Editing text

Every page is plain HTML. Open it, find the sentence, change it. The classes
control appearance; the text between the tags is yours.

Common edits:

- **Phone / email:** they appear in the header CTA, footer, mobile menu, contact
  page and the three form panels. Search all files for `9936396396`.
- **Adding a job to the openings table:** copy one `<tr>` row in `candidates.html`
  and edit the cells. `<span class="chip chip--copper">Open</span>` is the copper
  badge; `<span class="chip">Waitlist</span>` is the plain one.
- **Adding a trade to a sector:** add an `<li>` inside the relevant `<ul class="trades">`.
- **Adding a sector:** copy a whole `.acc__item` block and give the new panel a
  unique `id` / `aria-controls` pair (e.g. `sec-9`).

---

## 6. The optional build script

The header, mobile menu, footer and icon sprite are identical on all seven pages.
Editing them by hand means seven identical edits and eventually seven different
versions of your phone number.

`build.py` solves that. Sources live in `_src/`:

```
_src/layout.html        the page shell (<head>, script tags, structured data)
_src/partials/          header.html, menu.html, footer.html, loader.html, sprite.html
_src/pages/             one file per page: front matter + body
_src/optional-forms/    the original built-in forms, kept for reference (§3)
```

```bash
python3 build.py     # regenerates all seven .html files in the root
```

**You do not have to use it.** The generated HTML in the root is the real site and
is perfectly editable on its own. But if you edit the root files directly and then
run `build.py`, your changes are overwritten. Pick one workflow:

- *Simple:* edit the root `.html` files, delete `_src/` and `build.py`.
- *Maintainable:* edit `_src/`, run `build.py`, never touch the root files.

`_src/` and `build.py` do not need to be uploaded to the server either way.

---

## 7. What is already handled

**Accessibility**
- Skip link, visible focus rings, full keyboard path including the mobile menu
  (focus trap, Escape to close, focus returned to the burger)
- Colour contrast measured on every text node of all seven pages: **zero failures**
  against WCAG AA (body 7.5:1, small mono labels 5.6:1, copper 5.2:1, headings 14:1)
- Interactive borders — inputs, checkboxes, ghost buttons, the burger — all clear
  the 3:1 non-text contrast rule (WCAG 1.4.11)
- All touch targets ≥ 44×44px; the form panels state up front what will be asked
  and that the link opens a new tab, and always offer a phone / email / WhatsApp
  route for anyone who cannot or will not use the form
- Horizontally scrolling regions (the process track, the openings table) are
  keyboard-reachable and labelled, not mouse-and-finger only
- Icons are inline SVG with `aria-hidden`; no emoji used as iconography
- `prefers-reduced-motion: reduce` is fully respected — no parallax, no scroll
  scrub, no pinning, no marquee. Every section renders in its final readable state,
  and the horizontal process track becomes a normal swipeable/keyboard-scrollable
  list instead of a pinned animation
- Works with JavaScript disabled: content is visible, nothing is hidden behind an
  animation that never runs, the process track stays scrollable, and every enquiry
  route is a plain link, so nothing depends on scripting to convert

**Performance**
- No external requests at all — no Google Fonts CDN, no analytics, no library CDN.
  Nothing to be slow, blocked, or a GDPR problem
- Fonts are latin-subset WOFF2, ~272 KB total, with the two critical faces preloaded
- Animation is transform/opacity only; marquees pause when scrolled out of view
- Images use `background-image` with a CSS fallback, so a missing or slow photo
  never shifts the layout (CLS stays at zero)

**SEO**
- Per-page `<title>`, meta description, canonical and Open Graph tags
- `EmploymentAgency` structured data with address, phones and service areas
- `sitemap.xml` and `robots.txt` included — update the sitemap if you add pages

**Browsers:** current Chrome, Edge, Firefox, Safari, plus iOS and Android. Older
browsers get a plain, readable, unanimated version rather than a broken one.

---

## 8. Design system quick reference

| Token | Value | Use |
|---|---|---|
| `--surface` | `#12100E` | Page background (warm charcoal, never pure black) |
| `--surface-2` | `#191613` | Cards, alternating sections |
| `--cream` | `#E8E3DA` | Body and heading text |
| `--muted` | `#A8A199` | Secondary text |
| `--accent` | `#FC7B05` | Brand orange — primary accent, buttons |
| `--accent-lit` | `#FF9433` | Accent text, links, hover |
| `--brand-blue` | `#022C84` | Brand navy — decorative only, see note |
| `--faint` | `#918A82` | Mono labels, captions, hints |
| `--line-3` | `rgba(232,227,218,.42)` | Borders on anything interactive |

Type: **Instrument Serif** for display, **Inter** for body and UI, **JetBrains
Mono** for labels, numbers and eyebrows. All three are SIL Open Font License and
self-hosted, so there is no licensing action for you to take.

All spacing, type sizes, colours and easings are CSS custom properties at the top
of `assets/css/main.css`. Change a token there and it propagates everywhere.

**About the brand navy.** `#022C84` measures **1.54:1** against the charcoal
background — far below the 4.5:1 needed for text and the 3:1 needed for UI edges. On
this dark ground it is effectively invisible, so it cannot be an accent here. It is
used decoratively only: the hero route arcs fade from navy into the brand orange.
Keep the navy for print, stationery and any future light-mode collateral.

The brand orange `#FC7B05` measures 7.26:1 on the page background and 7.51:1 as a
button fill with near-black text, so it carries the accent role everywhere the old
copper did.

---

## 9. The routes video

The video is the **hero background** — it plays slowly and continuously behind the
headline, at `playbackRate 0.4`, with a 56-second scale drift over the top. There is
no scroll-scrubbing; the motion is ambient. It replaced the hand-drawn SVG route
arcs that used to sit there, which said the same thing less well.

**Files** (master kept out of the deploy set in `_src/hero_section-master.mp4`):

| File | Size | Purpose |
|---|---|---|
| `assets/video/hero.webm` | 672 KB | preferred source |
| `assets/video/hero.mp4` | 731 KB | fallback source |
| `assets/img/hero-poster.jpg` | 60 KB | poster; also what shows when motion is off |

**The loop is a ping-pong.** The source clip's first and last frames differ by 13/255
in average luminance, so a plain loop visibly jumped every 4 seconds behind the
headline. The deployed files are the clip followed by itself reversed, which always
loops seamlessly. That is why the duration is 8s, not 4s.

**To replace the video**, drop a new master in and re-run:

```bash
SRC=your-new-master.mp4
PP="[0:v]setpts=PTS-STARTPTS,split[a][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1[v]"
ffmpeg -y -i "$SRC" -filter_complex "$PP" -map "[v]" -an -c:v libx264 -crf 28 -preset slow \
  -pix_fmt yuv420p -movflags +faststart assets/video/hero.mp4
ffmpeg -y -i "$SRC" -filter_complex "$PP" -map "[v]" -an -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 \
  assets/video/hero.webm
ffmpeg -y -ss 1.2 -i "$SRC" -frames:v 1 -q:v 4 assets/img/hero-poster.jpg
```

`-an` strips audio — it is a background video and the track was dead weight.
`+faststart` lets playback begin before the file finishes downloading.

**Legibility.** The headline sits over live video, so the scrim was not eyeballed:
each frame was composited against the exact CSS gradients in a canvas and sampled
for the brightest pixel under every text block. Worst case across the loop —
headline 11.2:1, lead 7.3:1, eyebrow 8.6:1, scroll hint 5.1:1 — all above the
4.5:1 AA threshold. **If you swap the video, re-check this**; a brighter clip will
eat that headroom.

**Behaviour built in**
- **Plays on load for everyone, no interaction needed.** The `autoplay` attribute is
  in the markup, so it starts even before JavaScript runs. If a browser blocks the
  start, it retries when the tab becomes visible, when the hero scrolls into view,
  and on the visitor's first interaction — it never strands them on a button.
- Pauses while the hero is scrolled out of view, so it is not decoding frames behind
  the rest of the page.
- A **pause/play control** sits bottom-right of the hero. Looping motion that starts
  on its own needs one to meet WCAG 2.2.2, and this loop repeats indefinitely. It is
  also the way out for anyone who wants stillness.
- `prefers-reduced-motion: reduce` no longer stops the video — that was a deliberate
  owner decision. It still removes the extra 56s drift layered on top.
- With JavaScript off, the `autoplay` attribute still plays it.

To tune it: `playbackRate` is the `RATE` constant in `initHeroVideo()` in
`assets/js/main.js`; the darkening is `.hero__scrim` and `.hero__video { opacity }`
in `assets/css/main.css` §25.
# simanpower_test
