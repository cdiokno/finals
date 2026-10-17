# Verification notes

The current verification targets the user’s requested **single scrolling homepage**, superseding the original multi-page check.

## Browser checks

Chromium through Playwright CLI exercises:

- All six primary sections at widths 1440, 768, 390 and 320 pixels.
- A single primary heading and the presence of all four complete degree panels, three inline article bodies, grouped faculty and contact form.
- Removal of the original blue utility strip.
- Fixed island placement, viewport fit, current-section tracking through manual scrolling, accessible progress values and 100% at document end.
- Desktop anchor navigation and the mobile section menu, including automatic menu closure and current-section labels.
- Program cards opening the corresponding native details, and degree inquiry links preselecting the contact topic.
- Faculty filtering/search, profile opening and Escape dismissal.
- Inline article expansion and category filters.
- Contact validation, local preview and retention of form state when moving between sections.
- Direct detail anchors, compatibility redirects from old page URLs and reduced motion.
- Horizontal document overflow and clipping of the narrow-mobile hero text.

Run the current check from `scripts/browser-check.js` following the README. Screenshots prefixed `island-` in `output/playwright/` show the latest navigation. Earlier screenshots belong to the initial multi-page iteration.

The mobile menu’s outside-click detection uses the original event propagation path, so replacing its menu icon cannot accidentally close the menu in the same click. Reading progress recalculates with the document height when details, filters or form feedback change the layout.

No inquiry was sent and no external publishing action was performed. Testing uses Chromium viewport emulation rather than physical-device or every-browser certification. The project remains frontend-only and runs locally.
