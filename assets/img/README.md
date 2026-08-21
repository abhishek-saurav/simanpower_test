# Photo slots

Every image on the site is a **background slot with a designed fallback**. If a file
below ever goes missing, the page still looks finished — you see a dark gradient
panel in the brand accent instead of a broken image. Drop a replacement in with the
exact filename and it appears automatically. No code changes needed.

All eleven slots are currently filled. Nine are stock photography (Unsplash, free
license) standing in for real photography; two are generated monogram cards, not
photos of people — see the note below. **None of this is Sagar International's own
premises, staff, or clients.** Full sourcing, licensing and grading details are in
the main `README.md`, §4.

| Filename                     | Used on                | Ratio          | Currently showing |
|------------------------------|------------------------|----------------|--------------------|
| `track-employers.jpg`        | Home — dual track      | 4:5            | Workers in PPE at a site |
| `track-candidates.jpg`       | Home — dual track      | 3:2            | Travelers with luggage, airport terminal |
| `about-office.jpg`           | Home — about preview   | 3:4            | Open-plan office |
| `coverage-site.jpg`          | Home — coverage        | 16:9           | Tower cranes against clear sky |
| `about-heritage.jpg`         | About                  | 3:4            | B&W archive-style construction photo |
| `person-ram-awadh.jpg`       | About — leadership     | 4:5            | **Not a photo** — generated "RA" monogram card |
| `person-pardeep-singh.jpg`   | About — leadership     | 4:5            | **Not a photo** — generated "PS" monogram card |
| `svc-recruitment.jpg`        | Services 01            | 16:9           | Handshake over a signed contract |
| `svc-contract.jpg`           | Services 04            | 16:9           | Welder, close-up with sparks |
| `employers-site.jpg`         | Employers              | 16:9           | Crane and building against the sky |
| `candidates-briefing.jpg`    | Candidates             | 16:9           | Small group at a table |

## Replacing any of these

Drop a file at the same filename and rebuild (`python3 build.py` if you're using
`_src/`, otherwise just overwrite it — the root `.html` files reference the path
directly). Match the ratio in the table above, or the browser will letterbox/crop it
via `background-size: cover` — not broken, just not art-directed the way the current
crop is.

**Before you upload:**
1. **Resize.** Nothing wider than 1600px for landscape, 1000px for portrait — the
   current set averages ~120 KB each at those sizes.
2. **Compress.** [squoosh.app](https://squoosh.app), quality ~75–80 for JPEG.
3. **Consent.** Get written permission before publishing a photo of any identifiable
   worker or candidate.
4. **Keep the filenames exactly as above** — that is what the markup looks for.

## The two leadership portraits are not photos

`person-ram-awadh.jpg` and `person-pardeep-singh.jpg` are generated cards — initials
set in the site's own display serif, a thin route-line flourish, the brand accent —
not a stock photo of an uninvolved person standing in for a named real executive.
That distinction was deliberate: a stock office or crane photo illustrating a theme
is normal placeholder practice; a stock human face under a real person's name and
title reads as that specific person, which is a different and worse kind of wrong to
ship even temporarily. Replace with real headshots whenever they exist.
