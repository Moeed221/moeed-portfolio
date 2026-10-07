# Moeed Naik Portfolio

React, TypeScript, GSAP, Three.js and WebGL portfolio. This fork contains a performance pass on the [original project](https://github.com/muhammadmudasirawan/moeed-portfolio).

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

For production:

```sh
npm run build
npm run preview
```

The prebuild and predev scripts generate lossless WebP project screenshots from the committed PNG originals. Generated WebP files, build output and installed dependencies are ignored by Git. `npm ci` restores the locked dependencies on the current platform.

## Performance changes

- Load the design toolkit's physics and postprocessing code near its section.
- Suspend offscreen WebGL canvases and toolkit physics; resume them when visible.
- Stop WebGL work while the browser tab is hidden.
- Reuse cursor tweens and physics vectors; stop idle cursor/icon updates.
- Clean up animation loops, event listeners, timers and GPU resources.
- Remove the accumulating text-refresh listeners and debounce resize work.
- Lazy-load project screenshots, with lossless image conversion at build time.
- Cache Vite's versioned assets with Netlify immutable cache headers.

The original layout, HTML, project content, materials, lighting and antialiasing are retained. Desktop keeps its native pixel ratio. Touch phones use a 3D pixel ratio capped at 1.5, which can fall to 1 under sustained slow frames; text and project images keep their original resolution. Native mobile scrolling avoids transforming the full page, and the hero's text and lighting loops pause when offscreen. Two animated glow elements receive compositor hints without changing their appearance. See [PERFORMANCE.md](PERFORMANCE.md) for verification results.

The optimized portfolio is hosted at https://moeed-portfolio-optimized.onrender.com with automatic deployments from `main`.

## Netlify

Import this repository, choose `main`, use `npm run build` and publish `dist`. The settings and hashed-asset cache headers are included in `netlify.toml`. To update an existing Netlify site, connect that site's repository setting to this fork and trigger a new deployment.

## License

[MIT](LICENSE). The original license and source history are preserved.
