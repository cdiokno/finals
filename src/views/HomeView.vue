<script setup>
import { inject, computed } from 'vue'
import Icon from '../components/Icon.vue'
import ProgramIntro from '../components/ProgramIntro.vue'
import ProgramHero from '../components/ProgramHero.vue'
import ProgramDetail from '../components/ProgramDetail.vue'
import AboutView from './AboutView.vue'
import FacultyView from './FacultyView.vue'
import NewsView from './NewsView.vue'
import ContactView from './ContactView.vue'
import CreditsView from './CreditsView.vue'
import ScrollExpand from '../components/vue-bits/ScrollExpand.vue'
import TextLoop from '../components/vue-bits/TextLoop.vue'
import LogoLoop from '../components/vue-bits/LogoLoop.vue'
import ScrollReveal from '../components/vue-bits/ScrollReveal.vue'
import { programs, imagePath } from '../data/college'
const motionPaused = inject('motionPaused')
const orderedPrograms = ['bscs', 'bsit', 'bsdmia', 'blis'].map(id => programs.find(p => p.id === id))
const logos = computed(() =>
  orderedPrograms.map((p) => ({ src: imagePath(p.logo), alt: p.org, title: p.org, code: p.code })),
)
</script>
<template>
  <ProgramIntro :programs="orderedPrograms" />

  <section id="programs" data-scroll-section class="program-journey" aria-label="Our four degree programs">
    <nav class="container program-chapter-nav" aria-label="Explore degree programs">
      <span>Four paths. Find yours.</span>
      <RouterLink v-for="p in orderedPrograms" :key="p.id" :to="`/programs/${p.id}`">{{ p.code }} <Icon name="arrow-up-right" :size="14" /></RouterLink>
    </nav>
    <article v-for="p in orderedPrograms" :id="`program-${p.id}`" :key="p.id" class="program-chapter" :aria-label="p.name">
      <ProgramHero :program="p" />
      <div :id="`program-${p.id}-details`" class="container chapter-info"><ProgramDetail :id="p.id" /></div>
    </article>
    <div class="container program-helper">
      <Icon name="sparkles" :size="18" /><span>Still exploring? That’s a great place to start.</span>
      <RouterLink to="/contact">Let’s find your fit <Icon name="arrow-right" :size="16" /></RouterLink>
    </div>
  </section>

  <div id="about" data-scroll-section class="home-about-section">
    <section class="college-story-section">
      <div class="container college-story">
        <span class="story-asterisk" aria-hidden="true">✳</span>
        <div>
          <span class="section-kicker">More than a classroom</span
          ><ScrollReveal
            v-if="!motionPaused"
            :enable-blur="false"
            :base-opacity="0.3"
            :base-rotation="0"
            text-class-name="story-reveal"
            word-animation-end="bottom center"
            >We’re a community of people who see what could be, and learn how to make it
            happen.</ScrollReveal
          >
          <h2 v-else class="story-reveal">
            We’re a community of people who see what could be, and learn how to make it happen.
          </h2>
          <div class="story-bottom">
            <p>
              Rooted in science and faith. Connected by a shared purpose. Discover a college that
              grows with you.
            </p>
            <RouterLink to="/about" class="button button-outline"
              >This is CCS <Icon name="arrow-up-right" :size="18"
            /></RouterLink>
          </div>
        </div>
      </div>
    </section>

    <AboutView />

    <section class="campus-expand-section" aria-label="Discover our campus">
      <ScrollExpand
        :key="String(motionPaused)"
        :src="imagePath('campus.jpg')"
        alt="Mary Thomas Hall and its tree-lined courtyard at CPU"
        title="A little closer to your future."
        :start-width="88"
        :start-height="76"
        :start-radius="24"
        :end-radius="0"
        :scroll-distance="0.45"
        :hold-distance="0.08"
        :overlay-scrim="0.9"
        :use-window-scroll="true"
        :enabled="!motionPaused"
        ><div class="campus-overlay">
          <span>Welcome to Mary Thomas Hall</span>
          <h2>Room to learn.<br />Space to become.</h2>
          <RouterLink to="/contact" class="button button-yellow"
            >Find us on campus <Icon name="arrow-up-right" :size="19"
          /></RouterLink></div
      ></ScrollExpand>
    </section>

    <section class="community-section container">
      <div class="community-heading">
        <h2>Find your people.</h2>
        <p>Four programs. Shared curiosity. A community to grow with.</p>
      </div>
      <LogoLoop
        :key="String(motionPaused)"
        :logos="logos"
        :speed="motionPaused ? 0 : 28"
        :gap="80"
        :logo-height="56"
        :fade-out="true"
        fade-out-color="#ffffff"
        aria-label="CCS program communities"
        ><template #renderItem="{ item }"
          ><div class="community-logo-item">
            <img :src="item.src" :alt="item.alt" width="56" height="56" /><span>{{
              item.code
            }}</span>
          </div></template
        ></LogoLoop
      >
    </section>
  </div>
  <div id="faculty" data-scroll-section class="home-faculty-section"><FacultyView /></div>
  <div id="news" data-scroll-section class="news-section"><NewsView /></div>
  <div id="contact" data-scroll-section class="home-contact-section"><ContactView /></div>
  <details id="credits" class="home-credits container">
    <summary><span>Sources & credits</span><Icon name="plus" :size="20" /></summary>
    <CreditsView />
  </details>
  <div class="text-ribbon" aria-label="Remember, connect, engage, build, share">
    <TextLoop
      text="Remember · Connect · Engage · Build · Share"
      shape="line"
      :speed="motionPaused ? 0 : 32"
      :font-size="36"
      :font-weight="600"
      :uppercase="false"
      :letter-spacing="-1"
      :ribbon="true"
      ribbon-color="#f6cf51"
      color="#182850"
      :ribbon-width="85"
    />
  </div>
</template>
