# Visual direction

The college is both an academic institution and a place where future makers start. Its visual identity should feel trustworthy and energetic, with a campus desk as the memorable homepage composition.

## Tokens

- University navy: #182850 — typography, navigation and primary actions.
- Sunflower: #F6CF51 — welcoming highlights and the CCS-practice ribbon.
- Paper: #F6F7FB — quiet section separation.
- Mint: #DAF0E5 — Information Technology.
- Lilac: #E6E2F6 — Computer Science.
- Peach: #FFDFCF — Digital Media and Interactive Arts.
- Sky: #DCECF7 — Library and Information Science.

Space Grotesk gives headings a computing character; Manrope keeps body copy clear. Content uses a 1280px maximum width, a deliberate heading scale, and a four-column degree grid that becomes two columns on smaller screens. Long content remains left aligned.

The central visual is an actual Mary Thomas Hall photo, layered with a code note, program folder, and friendly sticker. The rest of the page stays quieter. Program illustrations are built from CSS/SVG, not stock technology imagery. The college’s actual logo and supplied portraits preserve identity.

## Review against the brief

A generic technology landing page would overemphasize abstract effects and product claims. This composition instead centers the real campus and the four required academic paths. Logo Loop shows program communities, not unverified corporate partnerships. News remains historical rather than inventing current events. Each motion component has a purpose; the user can pause motion, and reduced-motion preferences are honored.

## Single-page revision

The user’s updated direction consolidates all content in one continuous homepage. Complete degree details and article bodies expand inline so the page remains easy to scan. The original blue utility strip is removed. A floating navy capsule becomes a quiet reading companion: a moving active-section pill on desktop, a current-section label on mobile, and a circular document-progress indicator at every size. Six primary sections match the page’s actual reading order. Height changes from native details, image loading and directory filtering update the progress calculation automatically.


## Program showcase revision

The opening headline stays on the left; four Vue Bits Card Swap cards replace the right collage. A reversible GSAP ScrollTrigger pins the intro for two viewport heights, dismissing cards in CS, IT, DMIA, BLIS order. Short viewports and paused/reduced motion use normal scrolling with direct program links.

Four open chapters replace the program grid and accordions, keeping all existing academic information visible. Computer Science uses Letter Glitch on navy; IT uses a mint Cubes field; DMIA uses Model Viewer with a CC0 RobotExpressive character; BLIS uses Drift Wall with four actual Henry Luce III Library photographs. Model rendering is loaded asynchronously. Offscreen, hidden-tab, and paused effects unmount, with explicit GSAP and WebGL cleanup. Media dimensions remain fixed and the model has a locally rendered poster.

The floating header remains in its current form without a progress ring. Existing program routes and anchors still lead directly to each chapter. Photographer credits and model provenance appear in Sources & credits, the asset manifest, and public license notices.
