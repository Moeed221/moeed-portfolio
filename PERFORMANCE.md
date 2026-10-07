# Performance verification

The measurements below describe the first optimization pass. The subsequent mobile pass is documented at the end of this file.

Verified against upstream commit `e3df33afa816d4b8bc3e2866d9bc2d8ebc969ea7`.

## Measured resource reductions

Cold initial desktop visit, before scrolling to the design toolkit. Values are uncompressed file bytes for the JavaScript and image requests observed by the browser, not total transfer size or all project files.

| Metric | Original | Optimized | Change |
| --- | ---: | ---: | ---: |
| Initial desktop JavaScript | 3,544,287 bytes | 1,069,286 bytes | 69.8% less |
| Initial requested images | 8,777,484 bytes | 5,157,469 bytes | 41.2% less |
| Nine converted PNG source assets | 6,487,321 bytes | 2,846,322 bytes | 56.1% less |
| WebGL canvases mounted during the desktop hero | 2 | 1 | Toolkit deferred |

The toolkit's approximately 2.48 MB JavaScript chunk is fetched near its section. Mobile already excluded that section; mobile JavaScript remains approximately 1.07 MB. Converted images retain the same dimensions and identical decoded RGBA pixels. JPG and SVG content is unchanged.

## Rendering and interaction checks

Production builds were tested in headless Chromium 153 at desktop 1365 x 768 (DPR 1) and mobile 390 x 844 (DPR 2).

- No browser JavaScript errors or console errors in either optimized viewport.
- Hero, work and contact views visually inspected; project carousel next, previous and direct selection verified.
- Profile popup opening and closing verified.
- Original and optimized heading text, links and displayed image widths matched in both viewports.
- All original CSS and HTML files remained byte-identical.
- Offscreen character and toolkit issued zero WebGL draw calls during the work-section sample.
- Returning to the hero resumed the character while the offscreen toolkit remained idle.
- A simulated hidden-document visibility event stopped both WebGL canvases (zero draw calls).
- Four repeated desktop resize cycles did not accumulate text wrappers (14-15 split lines, final count 14).
- Crossing the desktop/mobile breakpoint left exactly one character canvas in each layout.

The headless environment uses software graphics. Its frame rate is not representative of a user's GPU, so no FPS improvement or universal zero-lag guarantee is claimed. Full device pixel ratio, antialiasing, original geometry and lighting are retained.

## Build validation

- `npm run build`: passed, including automatic lossless image generation and TypeScript checking.
- `npm run lint`: passed with zero errors; four existing React Fast Refresh export warnings remain.
- `git diff --check`: passed.

Installed dependencies and generated build files were removed from Git tracking. Use `npm ci` and `npm run build` for a fresh checkout. Netlify build and hashed-asset caching settings are in `netlify.toml`.

## Deployment status

The optimized source is committed to this fork. Updating the existing `moeed-khalid.netlify.app` site requires connecting it to this repository and deploying the new build. The GitHub fork does not automatically replace the existing upstream deployment.

## Mobile rendering pass (2026-10-07)

Reported issue: remaining lag on Android devices including Redmi 13.

- Touch layouts up to 1024 CSS pixels use native document scrolling instead of ScrollSmoother's full-page transform. Desktop smoothing remains enabled.
- The character's 3D drawing buffer starts at a maximum pixel ratio of 1.5. Sustained average frame intervals above 24 ms lower it by 0.25, to a floor of 1. Desktop retains native density, and phones below density 1 are not upscaled. Model geometry, materials, lighting, antialiasing, CSS dimensions, text and project image pixels are unchanged.
- At an example native density of 2.75, a 1.5-density buffer processes approximately 70% fewer pixels. This is a buffer-area calculation, not an FPS measurement.
- Height-only mobile resize events do not reallocate the 3D canvas or trigger a full scroll refresh. Width/orientation changes retain the current render budget.
- Hero text loops and screen-light flicker pause offscreen or in hidden tabs and resume when visible.
- Animated background glows receive compositor hints; no color, size or motion changes are introduced.

Validation: production TypeScript/Vite build, ESLint (zero errors; four existing Fast Refresh warnings), whitespace checks, and three render-budget tests covering slow frames, startup/tab restoration, desktop and low-density screens. Run the tests with `node --test tests/renderBudget.test.mjs`.

No physical Redmi 13 FPS measurements are available. The mobile 3D image may be less sharp than native density; layout, content and animations are preserved.

Render deployment: https://moeed-portfolio-optimized.onrender.com, automatic deployments from the fork's `main` branch, `npm ci && npm run build`, publish directory `dist`, Node 22, immutable caching for hashed `/assets/*` files.
