# Armin’s Developer Room

A bilingual, interactive developer portfolio built from **Armin Nataj’s supplied résumé**, with a cool blue palette and amber accents. The room contains original lightweight GLB models, with full HTML content available through object interactions or a classic portfolio view.

## Run locally

```sh
npm install
npm run dev
```

Open **http://localhost:3000**. On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.

English is available at **`/en`** and Persian at **`/fa`**. The language switcher stores the visitor’s preference in a cookie; the root URL redirects to that language, defaulting to English. Persian uses right-to-left layouts and locally bundled Vazirmatn fonts. Both languages include server-rendered content, localized metadata, and language alternate links. The downloadable résumé remains the original supplied PDF.

```sh
npm run build        # Production build, including Next.js type checking
npm run start        # Serve the production build
npm run typecheck    # Latest native TypeScript compiler
npm run lint
npm run format:check
npm run test:e2e     # Desktop and mobile Chromium tests
npm run test:timer   # Timer compatibility regression test
npm run test:contact # Contact route tests with mocked Resend responses
```

Install a browser once for tests if needed: `npx playwright install chromium`. The test configuration starts the dev server automatically or uses an existing server on port 3000.

If browser downloads are unavailable, set `PLAYWRIGHT_BROWSER_EXECUTABLE` to the absolute path of an installed Chrome or Edge executable. This also works with `scripts/capture-preview.mjs`. On machines that intercept browser PDF requests with an empty HTTP 204 response, set `PLAYWRIGHT_FETCH_PDF_VIA_API=1` for the PDF tests: Playwright then retrieves the actual PDF from the local app through its request API.

## Stack and versions

Next.js App Router, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei, GSAP, and Zustand were installed using their `latest` registry tags. `package-lock.json` records the resolved versions for repeatable installs. Tailwind supplies the CSS foundation and utilities; component styles and responsive rules live in `app/globals.css`.

The latest TypeScript 7 compiler runs through the `@typescript/native` npm alias. Next.js tooling and typescript-eslint still require the TypeScript 6 programmatic API, provided through Microsoft’s compatibility package aliased as `typescript`. This follows [Microsoft’s side-by-side guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0). ESLint uses the latest 9.x release compatible with Next.js’s React, import, and accessibility plugins.

Fonts are bundled locally; building does not require Google Fonts or a remote asset service.

Stable React Three Fiber 9.8.1 still constructs the deprecated `THREE.Clock`. The checked-in `patches/@react-three+fiber+9.8.1.patch` replaces that internal clock with a `THREE.Timer` adapter, preserving frame deltas, pause/resume, and manual frame advancement. `npm install` applies it automatically through `patch-package`; installation fails if the patch cannot apply. Review and remove the patch when upgrading to a stable Fiber release with native Timer support. Shadows explicitly use the supported `PCFShadowMap` setting.

## Architecture

```text
app/[lang]/                  Localized server page, root layout, metadata, OG image
app/                         Contact API, sitemap, robots, global styles
components/
  portfolio-shell.tsx        Page layout, view switch, navigation, shortcuts
  classic-portfolio.tsx      Server-rendered accessible portfolio
  locale-provider.tsx        Shared locale, translations, and localized content
  room/
    room-canvas.tsx          WebGL boundary, lighting, loading, lifecycle
    room-geometry.tsx        Layout and placeholder geometry
    room-asset.tsx           Replaceable GLB loader with per-asset fallbacks
    interactive-object.tsx   Object hover/click behavior
    room-hotspots.tsx        HTML markers projected from 3D anchors
    camera-rig.tsx           GSAP transitions and constrained orbit controls
  ui/                        Reusable content, project cards, icons, dialog
content/portfolio.ts         Résumé, project, skill, experience, and contact data
content/translations.ts      Persian translations of English display copy
lib/i18n.ts                  Locale validation and content translation
lib/room-config.ts           Model URLs, sections, camera targets
lib/types.ts                 Shared content and scene types
store/room-store.ts          Navigation, theme, motion, and view state
public/models/              Original optimized room models
public/projects/            Supplied project banners
public/resume/              The original supplied résumé PDF
patches/                    Stable React Three Fiber Timer compatibility
scripts/                    Asset generation, preview capture, accessibility audit
tests/                      Playwright interaction and fallback tests
```

## Edit the portfolio

Update **`content/portfolio.ts`**. The 3D scene does not contain résumé copy or project details.

When changing display text, update the matching English key and Persian value in **`content/translations.ts`**. Technical product names, URLs, machine IDs, and asset paths remain unchanged. The blue, amber, and neutral UI colors live in `app/globals.css`; room material colors are defined in `scripts/generate-room-assets.mjs` and the geometry fallbacks in `components/room/room-geometry.tsx`.

- Add project screenshots to `public/projects/`, then set the project’s optional `image` field to `/projects/filename.webp`.
- Set `liveUrl` when a live project URL is available; links only render when supplied.
- Update `sourceUrl`, GitHub, LinkedIn, email, and phone in the content file.
- Replace `public/resume/Armin_Nataj_Full_Stack_Resume.pdf` when the résumé changes.
- Work and education dates reflect the supplied résumé and should be updated as the career progresses.

The four key projects and twelve WordPress websites come from the supplied résumé. Cards use decorative concept illustrations because screenshots and repository URLs were not supplied. Personal Portfolio links to the website listed in the résumé. The supplied public/Armin-Nataj.png portrait appears in the introduction and About section; public/armin_logo_simple.svg is used for the brand, loading states, and browser icon.

The contact form posts to `app/api/contact/route.ts`, which sends through Resend. Copy `.env.example` to `.env.local`, set `RESEND_API_KEY`, choose a verified-domain sender in `RESEND_FROM_EMAIL`, and set the receiving inbox in `CONTACT_TO_EMAIL`. Set the same variables on your deployment host and restart the local server after changing them. These values stay on the server. The visitor's email is used only as Reply-To; the recipient is fixed by configuration. The route validates and bounds requests and includes a hidden honeypot field; it does not persist messages in an application database. For public deployments, configure rate limiting through your hosting provider as the honeypot is not a distributed rate limiter. Email, telephone, and social links still work directly.

The résumé content follows `public/resume/Armin_Nataj_Full_Stack_Resume.pdf`: six professional roles, four key projects, WordPress work, Electrical Engineering studies, languages, and skills. Dates are preserved as supplied, including overlapping roles. Local time uses Asia/Tehran. The embedded résumé has one page. The original PDF viewer supports clickable annotations, selectable text, zoom buttons, keyboard +/−/0, Ctrl/⌘-wheel zoom, mobile pinch zoom, and fit-to-width. Its PDF.js worker is bundled locally, and the classic view defers PDF rendering until visible. Direct PDF opening and downloading remain available if the embedded preview fails.

## Room interactions

| Object           | Section                             | Shortcut |
| ---------------- | ----------------------------------- | -------- |
| Monitor          | About                               | 1        |
| Laptop           | Projects                            | 2        |
| Bookshelf        | Skills                              | 3        |
| Wall frames      | Experience, education, achievements | 4        |
| Résumé clipboard | View and download original PDF      | 5        |
| Phone            | Contact                             | 6        |
| Social objects   | GitHub and LinkedIn profiles        | —        |

Drag to orbit within the room’s viewing bounds. Select an object, its HTML marker, or a navigation button to focus it. **Escape** or **Back to the room** closes the panel; **0** resets the camera. The sun button changes lighting. The help button explains the controls.

Information panels are nonmodal: the room stays interactive, clicking its background keeps the information visible, and selecting another object switches the panel directly. The header and footer hide while a section is open to give its content more space, and return when the section closes. The bottom navigation stays visible, including on phones. The camera gently adjusts while keeping the room in view; dragging takes control immediately. On phones, the room and information share the screen vertically.

## Replace or regenerate the models

The functional geometry fallbacks and final GLB models use the same `RoomAsset` component and interaction wrappers. A failed asset therefore preserves navigation and content.

1. Put a model in `public/models/`.
2. Change its URL in **`lib/room-config.ts`**.
3. Match the existing local origin and meter-based scale, or adjust only the placement group in `room-geometry.tsx`.

No changes to the store, panels, camera system, or content are needed. `useGLTF` supports compressed GLB replacements. For a Draco-compressed replacement, configure a self-hosted decoder if avoiding all third-party asset requests is required.

The included assets are generated with Three.js and exported to GLB. Geometry is merged by material to reduce draw calls; materials and surfaces are texture-free. The initial eleven models total approximately 1.0 MiB uncompressed and about 160 KiB transferred with HTTP compression in local testing. To regenerate:

```sh
npm run assets:build
```

For future photographic textures, prefer WebP/AVIF or KTX2, small texture dimensions, compressed geometry, and a similar transfer budget. The existing scene intentionally avoids an HDR environment download and postprocessing.

## Accessibility and performance

- Full HTML content is rendered on the server; the classic view works without WebGL or JavaScript.
- Nonmodal section dialogs preserve room interaction, Escape handling, and focus restoration. The separate room guide uses a modal dialog with focus containment.
- Every section has keyboard-accessible HTML navigation and labeled controls.
- Reduced-motion preferences disable cinematic movement and CSS animations.
- The scene loads in a separate client chunk and renders on demand; GSAP and orbit controls request frames during movement.
- Device pixel ratio is capped at 1.5; directional shadows use a 1024px map and contact shadows are baked once.
- Model failures retain geometry fallbacks; context loss switches to classic content.
- External profile and project links use `noopener noreferrer`.

## Deployment

Deploy as a standard Next.js application. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your real public origin. Vercel’s production domain is detected automatically when available. Metadata includes an Open Graph image, Twitter card, Person structured data, and robots rules. No production domain is assumed in the source.

The generated GLB files and public résumé must be included in deployment. The original `assets/` folder remains ignored as it was in the starter repository.
