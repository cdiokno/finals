# Verification notes

The current target is the single scrolling homepage with a pinned, reversible program-card introduction and four open degree chapters, in CS, IT, DMIA, BLIS order.

## Running the checks

Start Vite with `npm run dev`, then use the installed Playwright CLI skill wrapper:

```sh
"$HOME/.codex/skills/playwright/scripts/playwright_cli.sh" --session ccs-qa open http://localhost:5173
"$HOME/.codex/skills/playwright/scripts/playwright_cli.sh" --session ccs-qa run-code --filename scripts/browser-check.js
"$HOME/.codex/skills/playwright/scripts/playwright_cli.sh" --session ccs-qa run-code --filename scripts/program-media-check.js
```

Each check uses the open page’s origin by default. These are runnable browser functions for Playwright CLI, not a new test framework.

## Results

On October 18, 2026, the production build and both browser checks passed. The homepage check reported six sections, four open program chapters, no failed assertions, and no browser errors. The media check produced 20 screenshots and passed short-viewport, failed-model, unavailable-WebGL, and reduced-motion scenarios.

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
