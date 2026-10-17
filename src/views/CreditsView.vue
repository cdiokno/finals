<script setup>
import { programs, stories } from '../data/college'
</script>
<template>
  <section class="container page-intro">
    <span class="section-kicker">Behind this redesign</span>
    <h2 class="section-title">Sources & credits.</h2>
    <p>
      A student interpretation of the CPU College of Computer Studies website, developed for CCS
      3031. This is not the college’s official website.
    </p>
  </section>
  <section class="container prose-page section-bottom">
    <h2>College information</h2>
    <p>
      Program summaries, study highlights, history, and contact details were checked against the
      official CCS website on October 17, 2026. Published material may describe earlier academic
      years. Contact the college for the current curriculum, staffing, admissions requirements, and
      schedules.
    </p>
    <ul>
      <li>
        <a href="https://ccs.cpu.edu.ph/" target="_blank" rel="noopener noreferrer"
          >Official College of Computer Studies website</a
        >
      </li>
      <li>
        <a href="https://ccs.cpu.edu.ph/history/" target="_blank" rel="noopener noreferrer"
          >College history</a
        >
      </li>
      <li>
        <a
          href="https://ccs.cpu.edu.ph/vision-and-mission/"
          target="_blank"
          rel="noopener noreferrer"
          >Vision, mission, and quality policy</a
        >
      </li>
      <li>
        <a href="https://ccs.cpu.edu.ph/contact-us/" target="_blank" rel="noopener noreferrer"
          >Contact details</a
        >
      </li>
      <li v-for="p in programs" :key="p.id">
        <a :href="p.source" target="_blank" rel="noopener noreferrer">{{ p.degree }}</a>
      </li>
    </ul>
    <p>
      Academic content is summarized, not an official curriculum. Career examples for BSCS and BLIS
      are editorial interpretations of the published program outcomes, not placement promises. No
      current accreditation or partner relationship is inferred from archived material.
    </p>
    <h2>Faculty and staff</h2>
    <p>
      Names, roles, credentials, and program associations follow the project’s supplied
      <code>context/ccs-org chart.md</code>. Faculty photographs were supplied in the context folder
      and resized for the website. Shared BSCS/BSDMIA faculty are shown in both programs. No
      specialization is inferred. The unnamed portrait is unused; Gleason B. Baylon’s profile uses
      initials pending a confirmed photo.
    </p>
    <h2>Images and archived stories</h2>
    <p>
      The Mary Thomas Hall photograph is by
      <a
        href="https://commons.wikimedia.org/wiki/File:Mary_Thomas_Hall_at_Central_Philippine_University.jpg"
        target="_blank"
        rel="noopener noreferrer"
        >Johngaje92, via Wikimedia Commons</a
      >, licensed under
      <a
        href="https://creativecommons.org/licenses/by-sa/4.0/"
        target="_blank"
        rel="noopener noreferrer"
        >CC BY-SA 4.0</a
      >. It was resized, compressed, and cropped in the page layout; the adapted image remains under
      the same license. College and student organization marks and archival announcement images come
      from the official CCS website and remain the property of their respective owners.
    </p>
    <ul>
      <li v-for="story in stories" :key="story.slug">
        <a :href="story.source" target="_blank" rel="noopener noreferrer">{{ story.title }}</a> —
        {{ story.date }}
      </li>
    </ul>
    <h2>Design and development</h2>
    <p>
      Built with Vue 3 and Vue Router. Folder Float, Scroll Expand, Text Loop, Chroma Grid, Logo
      Loop, Scroll Reveal, and Sticker Peel are adapted from
      <a href="https://vue-bits.dev/" target="_blank" rel="noopener noreferrer">Vue Bits</a>. Icons
      are from Lucide. Typography uses Manrope and Space Grotesk, under the SIL Open Font License.
      Custom program illustrations and the hello-future sticker were created for this project.
    </p>
    <p>
      AI assisted with design, coding, content organization, and verification. Group members should
      review, develop, understand, and disclose this assistance according to their instructor’s
      requirements. No individual student contribution is claimed here.
    </p>
    <h2>Frontend demonstration</h2>
    <p>
      This site has no backend, user accounts, or data collection. The contact form validates and
      previews an inquiry locally; only an explicit action opens a draft in the visitor’s email app.
      News content is archival. The site includes a motion toggle and honors reduced-motion
      preferences.
    </p>
  </section>
</template>
