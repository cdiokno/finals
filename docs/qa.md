# Verification notes

The current target is the single scrolling homepage with a pinned, reversible program-card introduction and four open degree chapters, in CS, IT, DMIA, BLIS order.

## Running the checks

Start Vite with `npm run dev`, then use the installed Playwright CLI skill wrapper:

```sh
"$HOME/.codex/skills/playwright/scripts/playwright_cli.sh" --session ccs-qa open http://localhost:5173
"$HOME/.codex/skills/playwright/scripts/playwright_cli.sh" --session ccs-qa run-code --filename scripts/browser-check.js
"$HOME/.codex/skills/playwright/scripts/playwright_cli.sh" --session ccs-qa run-code --filename scripts/program-media-check.js
"$HOME/.codex/skills/playwright/scripts/playwright_cli.sh" --session ccs-qa run-code --filename scripts/motion-check.js
```

Each check uses the open page’s origin by default. These are runnable browser functions for Playwright CLI, not a new test framework.

## Motion preferences

The site starts with the browser's `prefers-reduced-motion` preference. The footer's Enable motion / Pause motion button overrides that default and saves the visitor's choice in `localStorage` (`ccs-motion-paused`). Clear that key to follow the system preference again. If storage is blocked, the button still works for the current page.

The active effect components share the provided motion state. They must not independently block animations using the system preference after a visitor enables motion. The motion regression check exercises system preference changes, the manual override under reduced motion, reload persistence, desktop/mobile effects, and pausing again.

The faculty spotlight requires a hover-capable device; touchscreens display the photos without the spotlight. The intro uses ordinary scrolling when its content is taller than the viewport, so a short window or phone may show a static card stack. Neither condition should stop the other program or scrolling effects.

## Results

On October 18, 2026, the production build and both browser checks passed. The homepage check reported six sections, four open program chapters, no failed assertions, and no browser errors. The media check produced 20 screenshots and passed short-viewport, failed-model, unavailable-WebGL, and reduced-motion scenarios.

The motion preference fix was also checked in headless Microsoft Edge on Windows with reduced motion emulated. The new motion check and existing homepage/media assertions passed, including the explicit enable override at desktop and phone viewport sizes, reload persistence, and scroll effects after removing the desktop intro pin. The pin now schedules a global ScrollTrigger refresh when added or removed. Existing screenshots were not regenerated during this regression run. The 3D library emitted Vue lifecycle warnings; no uncaught page errors occurred, and model loading plus failure fallbacks passed.

## Coverage

- Four-card dismissal at each stage, the zero state, reverse scrolling, and release of the pinned intro.
- Short viewport fallback and accessible direct links to every program.
- Six primary sections, four complete open program chapters, all faculty groups, inline stories, and the contact form.
- Existing floating header, desktop/mobile navigation, current-section tracking, viewport fit, and Escape dismissal.
- Program anchors, legacy program URLs, inquiry preselection, form validation, and preservation of the local inquiry review.
- Faculty filtering, search and dialogs; story filtering and inline expansion.
- Letter Glitch, animated Cubes, loaded Model Viewer, and the CPU library Drift Wall.
- Document scrolling over the model, offscreen effect teardown, OS reduced motion, failed GLB loading, and unavailable WebGL.
- Screenshots of the intro and all four program heroes at widths 1440, 768, 390 and 320 pixels; screenshots use `output/playwright/journey-*.png`.
- Production compilation with `npm run build`, JavaScript syntax checks, and `git diff --check`.

The model and all four CPU library photographs are served locally. Photo and model credits are recorded in `docs/asset-sources.json`, `public/third-party-licenses.txt`, and the homepage’s Sources & credits panel.

No inquiry was sent and no publishing action was performed. Checks use Chromium viewport emulation, not physical-device or every-browser certification. The 3D viewer is a separate lazy-loaded production chunk; Vite reports its size warning. Earlier screenshots prefixed `island-` belong to the previous homepage revision.
