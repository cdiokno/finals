<script setup>
import { inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'
import ProgramCard from '../components/ProgramCard.vue'
import ProgramDetail from '../components/ProgramDetail.vue'
import AboutView from './AboutView.vue'
import FacultyView from './FacultyView.vue'
import NewsView from './NewsView.vue'
import ContactView from './ContactView.vue'
import CreditsView from './CreditsView.vue'
import FolderFloat from '../components/vue-bits/FolderFloat.vue'
import ScrollExpand from '../components/vue-bits/ScrollExpand.vue'
import TextLoop from '../components/vue-bits/TextLoop.vue'
import LogoLoop from '../components/vue-bits/LogoLoop.vue'
import ScrollReveal from '../components/vue-bits/ScrollReveal.vue'
import StickerPeel from '../components/vue-bits/StickerPeel.vue'
import { programs, imagePath } from '../data/college'
const router = useRouter()
const motionPaused = inject('motionPaused')
const folderItems = programs.map((p) => ({ label: p.code, value: `/programs/${p.id}` }))
const logos = computed(() =>
  programs.map((p) => ({ src: imagePath(p.logo), alt: p.org, title: p.org, code: p.code })),
)
</script>
<template>
  <section id="home" data-scroll-section class="hero-section">
    <div class="container hero-grid">
      <div class="hero-copy">
        <div class="location-label">
          <span class="live-dot"></span> Iloilo roots. Limitless possibilities.
        </div>
        <h1>
          Think big.<br />Build
          <span class="hero-word"
            >what’s next.<svg viewBox="0 0 550 30" aria-hidden="true">
              <path d="M4 19Q260-7 541 10M27 28Q300 9 519 19" /></svg
          ></span>
        </h1>
        <p>
          A home for curious minds, creative thinkers, and future builders. Find your place at CPU’s
          College of Computer Studies.
        </p>
        <div class="hero-actions">
          <RouterLink to="/programs" class="button button-navy"
            >Find your program <Icon name="arrow-up-right" /></RouterLink
          ><RouterLink to="/about" class="text-link"
            >Get to know CCS <Icon name="arrow-right" :size="18"
          /></RouterLink>
        </div>
        <div class="hero-community">
          <div class="community-logos">
            <img
              v-for="p in programs"
              :key="p.id"
              :src="imagePath(p.logo)"
              alt=""
              width="39"
              height="39"
            />
          </div>
          <span>Different passions.<br /><strong>One Centralian community.</strong></span>
        </div>
      </div>
      <div class="hero-collage">
        <div class="collage-grid" aria-hidden="true"></div>
        <div class="hero-code" aria-label="A playful code illustration: your future starts here">
          <div class="code-bar">
            <span><i></i><i></i><i></i></span><span>your_future.js</span
            ><Icon name="code" :size="14" />
          </div>
          <div class="code-body">
            <span class="line-number">01</span><span><em>const</em> future = {</span
            ><span class="line-number">02</span><span>&nbsp; curiosity: <b>"unlimited"</b>,</span
            ><span class="line-number">03</span><span>&nbsp; possibilities: <b>Infinity</b></span
            ><span class="line-number">04</span><span>};<i class="terminal-caret"></i></span>
          </div>
        </div>
        <div class="campus-postcard">
          <img
            :src="imagePath('campus.jpg')"
            alt="The green courtyard of Mary Thomas Hall, home of CPU’s College of Computer Studies"
            fetchpriority="high"
          />
          <div class="postcard-caption">
            <span><Icon name="pin" :size="15" /> Your ideas have a home here.</span
            ><span>CPU, Iloilo</span>
          </div>
        </div>
        <div class="hero-sticker" aria-hidden="true">
          <StickerPeel
            v-if="!motionPaused"
            :image-src="imagePath('hello-sticker.svg')"
            :width="145"
            :rotate="12"
            :peel-back-hover-pct="22"
            :initial-position="{ x: 0, y: 0 }"
          /><img v-else :src="imagePath('hello-sticker.svg')" alt="" width="145" />
        </div>
        <div class="hero-folder">
          <FolderFloat
            :items="folderItems"
            label="Your next chapter"
            sublabel="4 paths to explore"
            folder-color="#5763a8"
            front-color="#a8b5ed"
            label-color="#182850"
            paper-color="#fffdf6"
            item-color="#fffdf6"
            item-text-color="#182850"
            :width="184"
            :height="128"
            :spread="125"
            :lift="25"
            :physics="!motionPaused"
            @select="router.push"
          /><span class="folder-hint"
            >open a little possibility
            <svg width="47" height="29" viewBox="0 0 47 29" aria-hidden="true">
              <path d="M2 25Q38 29 38 4m-7 5 8-7 6 9" /></svg
          ></span>
        </div>
        <div class="floating-tag"><span>✳</span> Made of curiosity.</div>
      </div>
    </div>
    <div class="container hero-bottom">
      <span>Technology. Creativity. A little courage.</span
      ><RouterLink :to="{ path: '/', hash: '#programs' }"
        >Your next chapter, this way <Icon name="arrow-down" :size="15"
      /></RouterLink>
    </div>
  </section>

  <section id="programs" data-scroll-section class="section container">
    <div class="section-heading">
      <div>
        <span class="section-kicker"><span></span> Find your direction</span>
        <h2>Four paths.<br />A world of possibilities.</h2>
      </div>
      <div class="section-heading-aside">
        <p>Whether you think in code, color, systems, or stories, there’s a place for you here.</p>
        <RouterLink to="/programs" class="text-link"
          >Explore all programs <Icon name="arrow-up-right" :size="18"
        /></RouterLink>
      </div>
    </div>
    <div class="program-grid"><ProgramCard v-for="p in programs" :key="p.id" :program="p" /></div>
    <div class="program-accordions">
      <details v-for="p in programs" :id="`program-${p.id}`" :key="p.id" class="program-accordion">
        <summary>
          <span class="program-accordion-icon" :class="p.theme"
            ><Icon :name="p.icon" :size="22" /></span
          ><span class="program-accordion-heading"
            ><span>{{ p.code }}</span>
            <h3>{{ p.name }}</h3></span
          ><span class="program-accordion-hint">A closer look</span
          ><span class="program-accordion-toggle"><Icon name="plus" :size="20" /></span>
        </summary>
        <ProgramDetail :id="p.id" />
      </details>
    </div>
    <div class="program-helper">
      <Icon name="sparkles" :size="18" /><span>Still exploring? That’s a great place to start.</span
      ><RouterLink to="/contact"
        >Let’s find your fit <Icon name="arrow-right" :size="16"
      /></RouterLink>
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
