# Agastya Verma — Portfolio

An experimental 3D portfolio for a self-taught developer from Nepal. Built as a single
page: a real-time mounted sculpture in the hero, three honest project plates, and a live
interactive 3D playground you can actually operate.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Three.js · React Three Fiber ·
Drei · GSAP + ScrollTrigger · Lenis · structured custom CSS (no utility framework).

---

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

No environment variables, no external services, no HDR/texture downloads. Fonts are
self-hosted through `@fontsource`, so the site makes zero third-party requests at runtime.

---

## Publishing

The site is fully static — no database, no API routes, no environment variables — so it
builds and deploys anywhere that can run `npm run build`.

### Vercel (recommended, ~2 minutes)

1. Merge this branch into `main` (or push the code to your default branch).
2. Go to [vercel.com/new](https://vercel.com/new) → import `reger4mv/portfolio`.
3. Vercel detects Next.js. Leave every setting alone — no env vars, no build overrides.
4. Deploy. Every push to `main` then redeploys automatically.

Framework preset `Next.js`, build command `npm run build`, output handled by Vercel.
The build needs no network access at runtime and makes no third-party requests.
`vercel.json` pins the framework and build command, so a project created before the app
existed (when the repo held only a README) still builds correctly.

**If a Vercel deployment 404s or fails**, it is almost always project settings, not the
code. Check Settings → Build & Development Settings:

| Setting | Correct value |
| --- | --- |
| Framework Preset | `Next.js` |
| Root Directory | *(empty)* |
| Build Command | *(default / `npm run build`)* |
| Output Directory | *(empty — never `out`, that is only for `build:static`)* |
| Install Command | *(default)* |

The fastest reset is to delete the Vercel project and re-import the repo; detection then
runs against a repo that actually contains the app.

### GitHub Pages (free, no Vercel account)

`.github/workflows/deploy-pages.yml` is included. It builds a static export and publishes
it:

1. Push the code to `main`.
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push again (or run the workflow from the Actions tab).
4. The site appears at `https://reger4mv.github.io/portfolio/`.

The workflow passes `NEXT_BASE_PATH=/portfolio` because project sites are served from a
sub-path. If you later point a custom domain at Pages, delete that line.

### Anywhere else

```bash
npm ci
npm run build:static   # writes ./out — plain HTML/CSS/JS
```

Upload `out/` to Cloudflare Pages, Netlify (drag-and-drop), S3 + CloudFront, or any static
host. If the host serves from a sub-path, build with `NEXT_BASE_PATH=/that-path`.

For a Node host instead (Docker, Railway, Fly): `npm ci && npm run build && npm start` —
the server listens on `0.0.0.0:3000`.

### Social preview + metadata

`layout.tsx` emits a canonical URL, Open Graph and Twitter card tags, a 1200×630 preview
image (`public/og.png`) and the PNG favicon/apple icon set. Absolute URLs need to know the
origin:

| Variable | Default | Use |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://reger4mv.github.io` | Set this to your custom domain (or your Vercel domain) so shared links point at the right host |
| `NEXT_BASE_PATH` | *(empty)* | `/portfolio` for GitHub Pages project sites; already set in the workflow |

Icon URLs are prefixed with the base path by hand, because Next's `metadata.icons` field
does not apply it automatically. Both export modes were checked: with `NEXT_BASE_PATH=
/portfolio` the head emits `/portfolio/favicon-32.png`; without it, `/favicon-32.png`.

### Before you go live

- Fill in `site.email` and the socials in `src/data/social.ts` (see above).
- Check the hero at your own viewport width; if the sculpture crowds the type, nudge
  `position` in `src/scenes/MainScene.tsx` and `--fs-hero` in `globals.css`.
- Run Lighthouse against the deployed URL (a real browser is the one test this build
  environment could not perform).

---

## Where to edit content

All personal content lives in `src/data/` — presentation never holds copy.

| File | Contents |
| --- | --- |
| `src/data/site.ts` | Name, role, location, hero description, about copy, contact copy, nav items |
| `src/data/projects.ts` | The three projects: description, status, what has actually been built, stack, link |
| `src/data/skills.ts` | Skill groups and honest depth labels (`working` / `learning` / `exploring`) |
| `src/data/social.ts` | Contact channels — add a row only when the profile exists |
| `src/data/philosophy.ts` | The four working principles |
| `src/data/lab.ts` | Scene_001 object names and preset lists |
| `src/data/site.ts` (`siteUrl`, `asset`) | Published origin used by canonical + social preview URLs |
| `public/backdrop.jpg` | The pointer-revealed backdrop. Swap this file for your own image — anything you are happy to have on screen. Its path lives in `backdrop` in `src/data/site.ts`. |

### Contact details

`site.email` is intentionally empty, so the email row renders as "Not published".
`socials` contains GitHub only; LinkedIn and Instagram are listed as rows with an empty
`href`, which the UI shows as "Not published yet" instead of a dead link.

> The GitHub handle `reger4mv` was taken from this repository's namespace. If that is not
> the account you want to surface, change or clear it in `src/data/social.ts` and
> `projects.ts` (REGERA's link).

### Adding real project screenshots

No product screenshots were supplied, so each project renders an **identity study** — an
abstract SVG drawn from that project's own geometry — and says so in the caption. To use a
real screenshot instead:

1. Drop the image in `public/projects/` (e.g. `public/projects/kaminari.png`).
2. Add to the project in `src/data/projects.ts`:

```ts
preview: { src: "/projects/kaminari.png", alt: "Kaminari discovery feed" },
```

The plate swaps the study for the image automatically. Prefer WebP/AVIF under ~300 KB;
plates are 4:5, 21:9 and 1:1 depending on the project layout.

---

## What is and isn't claimed

This site was built to a strict content rule: nothing is invented.

- Projects are labelled **Concept**, **In progress** or **Ongoing**, with a "Built so far"
  line describing what actually exists.
- No users, revenue, awards, clients, testimonials, employment, statistics or completion
  claims appear anywhere.
- Skills carry a depth label instead of a percentage — there are no progress bars and no
  implied proficiency scores.
- No contact form is implemented, because a form without a real backend would either drop
  messages or fake a success state. Channels are plain links instead.
- No portrait is shown, because none was supplied.
- No dates are attached to the projects, because none were confirmed.

If any of that changes, edit the data files and the UI follows.

---

## Interaction layer

Everything below is opt-in per element, respects `prefers-reduced-motion`, and is
disabled entirely on coarse pointers unless noted.

| Piece | Where | Notes |
| --- | --- | --- |
| `Cursor` | global | Four states — default / link / view / drag — with contextual labels from `data-cursor` + `data-cursor-label`. The ring leans toward the centre of the hovered element. |
| `useMagnetic` | nav links, channels, socials, back-to-top | Leans by a fraction of the pointer offset, eases back on leave. Never intercepts clicks. |
| `Plate` (`matte`) | project imagery | Clip-path aperture entry (rise / wipe / scale — one per project), media parallax behind the clipped frame, 2–4° pointer tilt, caption fade. |
| `CursorImageReveal` | work index (closing panel) | Hover or keyboard-focus a project name and its study floats after the pointer with a lag, stepping clear of the label and staying inside the viewport. Layered images crossfade on switch, so nothing blanks or reloads. Portalled out of the horizontal track, never mounted for coarse pointers (rows carry inline thumbnails instead), placed without float under reduced motion. |
| `SplitText` | project titles, footer name | Per-character hover displacement. `aria-hidden`; the accessible name comes from an `sr-only` sibling. |
| `BackdropLens` | global (fine pointers only) | One image held behind the page, visible only inside a soft circle that trails the pointer. Eases behind the real cursor, switches itself off after 2.2 s of stillness so it never parks over copy, and disappears the moment the pointer leaves the document. Not mounted on coarse pointers — the CSS media query keeps the image from downloading there at all. Decorative only: `aria-hidden`, no pointer events, never focusable. |
| `ScrollProgress` | nav bottom edge | Writes one transform from rAF; no re-renders. |
| Nav indicator | nav | A single hairline slides to the active section instead of five underlines flickering. |
| Skills marker | capabilities | One marker slides between rows; the detail panel wipes on change. |
| `Work` sequence | selected work | Vertical scroll drives a horizontal track of five full-height panels (statement → three project spreads → handoff). Travel is measured from `scrollWidth`, the viewport is `position: sticky` rather than pinned, and no wheel/touch listeners are attached. Below 1024 px, under 600 px of viewport height, on coarse pointers or with reduced motion the same markup stacks vertically — the CSS media query and the GSAP `matchMedia` condition are kept identical so the two can never disagree. |
| Creed list | approach | A quiet vertical list of the four principles — the page keeps exactly one horizontal journey. |

### Motion vocabulary

`SiteMotion` owns one GSAP + Lenis instance, but each primitive is a different
gesture, so no two sections arrive the same way:

`data-lines` masked line reveal · `data-roll` number/prose roll · `data-wipe` clip-path
label draw (direction-aware) · `data-mask` copy unclipping from the top · `data-grow`
vertical rules extending · `data-draw` hairlines drawing · `data-shift` opposing
scrub drift · `data-reveal` / `-group` the plain fade, used sparingly.

---

## Architecture

```
src/
  app/
    layout.tsx        metadata, fonts, global styles, skip link
    page.tsx          section composition
    globals.css       design tokens, type scale, section styles, responsive rules
    icon.svg          favicon (the monogram)
  components/
    navigation/       nav, monogram, mobile overlay menu, live Kathmandu clock
    hero/             hero layout, masked type entrance, scroll cue
    projects/         work list + project plates (SVG identity studies)
    playground/       Scene_001 shell, HUD, controls, FPS readout
    sections/         about, skills index, approach, shared section heading
    contact/          channels from data/social.ts
    footer/           footer + back to top
    cursor/           fine-pointer cursor: states + contextual labels
    interaction/      magnetic wrapper, scroll progress
    ui/               Plate (matte image system), SplitText
    system/           motion controller, scene error boundary
  scenes/
    MainScene.tsx          hero canvas: camera, scroll response, framing
    HeroSculpture.tsx      the parametric instrument
    PlaygroundScene.tsx    Scene_001 canvas
    InteractiveObjects.tsx four objects, surfaces, lighting presets, selection
    Lighting.tsx           hand-built studio environment (no HDR files)
  hooks/               webgl probe, in-view, device quality, reduced motion
  lib/                 Lenis access + smooth anchor scrolling
  data/                all editable content
```

### The hero sculpture

"CALIBRATOR" is a mounted instrument, not a floating shape: a plinth with engraved tick
marks, a slim steel column with chrome collars, a three-ring gimbal in the column's cradle,
a faceted dark core, one counterweighted arm, and a single glass lens slab cutting through
it. All geometry is parametric (torus / box / cylinder / icosahedron), so there is nothing
to download and nothing to dispose of beyond what R3F handles.

Motion: slow ring rotation on independent axes, pointer-damped tilt, a gentle breathing
camera on scroll, and a still fallback when the visitor prefers reduced motion.

### Scene_001

Four objects on a stage — a chrome orbit cage, a glass prism, a wire lattice, a particle
field. You can orbit (drag), select (click), and change surface (chrome / glass / wire),
lighting (studio / dusk / mono), camera (orbit / front / top), rotation and a single
"pulse" animation. The HUD reports the current state and a live frame rate. Selection is
also announced in a polite live region for screen readers.

---

## Performance and accessibility

- Three.js + R3F load in async chunks; the route's first-load JS is ~162 kB and the
  initial HTML is fully rendered and readable before any 3D arrives.
- Scenes are mounted client-side and paused (`frameloop="never"`) when they scroll out of
  view; the hero is `frameloop="demand"` under reduced motion.
- Device quality: `useSceneQuality` drops to a lite grade (fewer geometry segments, no
  transmission glass, lower environment resolution, reduced DPR) on narrow viewports and
  low-core devices.
- No post-processing, no shadows, no textures, no external assets.
- WebGL unavailable → the hero falls back to a static line drawing and the playground shows
  an honest "scene unavailable" panel; a scene error boundary catches context failures.
- `prefers-reduced-motion` disables Lenis smoothing, scroll reveals, the custom cursor, the
  hero bloom-in and auto-rotation in Scene_001.
- Semantic landmarks, one `h1`, ordered headings, a skip link, visible focus rings, keyboard
  arrow navigation in the skills index, `inert` on the closed mobile menu, and ARIA-complete
  toggle buttons.

### Known limits

The development environment used to build this had no browser engine available, so the
interface was verified through production builds, type checks, server-rendered markup and
offline rendering of the 3D geometry — not by pixel-inspection in a live browser. Font
metrics, hero framing and mobile breakpoints were checked with rendered mock-ups at 1440 px
and hand-computed clamp() values. Run the site in a real browser and adjust the hero
`--fs-hero` / sculpture `position` in `MainScene.tsx` if the composition needs a nudge at a
specific width.

---

## Design system

| Token | Value |
| --- | --- |
| Paper (default surface) | `#E8E1D3` · `#DED5C3` · `#D2C8B4` |
| Ink (opt-in `reg--ink`) | `#17150F` · `#221E16` · `#2B261C` |
| Oxide — text accent, rules, focus | `#9E3A20` |
| Project pigments | Kaminari `#D9603A` · Totem `#C2A13D` · Regera `#8FA883` |

Type: **Bricolage Grotesque Variable** (display, `wght 200–800`, `wdth 75–100`),
**Archivo Variable** (all reading text), **Azeret Mono Variable** (indices, labels,
section marks). Three faces, all self-hosted, no third-party requests.

There is one display voice. Hierarchy comes from case, weight, width and space rather than
from a second typeface: uppercase is reserved for the hero masthead, panel eyebrows and
monospace marks; everything else is set in sentence case. Display widths run 86–93% so the
headlines read as a deliberate choice, not a default.

Contrast was computed, not eyeballed — every text pair in the table clears WCAG AA
(`#5F5747` muted ink on paper is 5.49:1, oxide on paper 5.24:1, ember on ink 5.44:1).
Default is paper; dark is a section-level opt-in, never the site default.

Motion language: masked line reveals for display type, one clip reveal per long paragraph,
vertical rules that extend, damped camera movement and the cursor image reveal on the work
index. Fades are the exception, not the rule, and `prefers-reduced-motion` removes all of
it — including the cursor follower and the sculpture's idle drift.
