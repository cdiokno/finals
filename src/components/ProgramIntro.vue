<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CardSwap from './vue-bits/CardSwap.vue'
import ProgramArt from './ProgramArt.vue'
import Icon from './Icon.vue'
import { imagePath } from '../data/college'

gsap.registerPlugin(ScrollTrigger)
defineProps({ programs: { type: Array, required: true } })
const motionPaused = inject('motionPaused')
const hero = ref(null)
const progress = ref(0)
const pinned = ref(false)
const remaining = computed(() => Math.max(0, 4 - Math.floor(progress.value * 4 + 0.00001)))
let trigger
let observer
let frame
let disposed = false

function setup() {
  if (!hero.value) return
  const [grid, bottom] = hero.value.children
  const gridStyle = getComputedStyle(grid)
  const heights = [...grid.children].map(child => child.offsetHeight)
  const stacked = gridStyle.gridTemplateColumns.trim().split(/\s+/).length === 1
  // Measure layout boxes: transformed cards can extend scrollHeight while leaving the stack.
  const gridContent = stacked ? heights.reduce((sum, height) => sum + height, 0) + (parseFloat(gridStyle.rowGap) || 0) : Math.max(...heights)
  const contentsHeight = gridContent + parseFloat(gridStyle.paddingTop) + parseFloat(gridStyle.paddingBottom) + bottom.offsetHeight + parseFloat(getComputedStyle(hero.value).paddingTop)
  const canPin = !motionPaused.value && contentsHeight <= window.innerHeight + 2
  if (trigger && canPin) { trigger.refresh(); return }
  if (!canPin) {
    trigger?.kill(true)
    trigger = null
    pinned.value = false
    progress.value = 0
    return
  }
  // Short viewports use ordinary page scrolling so the headline and links stay reachable.
  trigger = ScrollTrigger.create({
    trigger: hero.value,
    start: 'top top',
    end: () => `+=${window.innerHeight * 2}`,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => { progress.value = self.progress },
  })
  pinned.value = true
}

function scheduleSetup() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(setup)
}

onMounted(() => {
  setup()
  observer = new ResizeObserver(scheduleSetup)
  // Observe the contents, not the pinned element whose dimensions ScrollTrigger temporarily owns.
  for (const child of hero.value.children) observer.observe(child)
  window.addEventListener('resize', scheduleSetup)
  document.fonts.ready.then(() => { if (!disposed) scheduleSetup() })
})
watch(motionPaused, () => { if (!disposed) setup() }, { flush: 'post' })
onUnmounted(() => {
  disposed = true
  cancelAnimationFrame(frame)
  observer?.disconnect()
  window.removeEventListener('resize', scheduleSetup)
  trigger?.kill(true)
})
</script>

<template>
  <section id="home" ref="hero" data-scroll-section class="hero-section journey-intro" :data-pinned="pinned">
    <div class="container hero-grid">
      <div class="hero-copy">
        <div class="location-label"><span class="live-dot"></span> Iloilo roots. Limitless possibilities.</div>
        <h1>Think big.<br />Build <span class="hero-word">what’s next.<svg viewBox="0 0 550 30" aria-hidden="true"><path d="M4 19Q260-7 541 10M27 28Q300 9 519 19" /></svg></span></h1>
        <p>A home for curious minds, creative thinkers, and future builders. Find your place at CPU’s College of Computer Studies.</p>
        <div class="hero-actions">
          <RouterLink to="/programs" class="button button-navy">Find your program <Icon name="arrow-up-right" /></RouterLink>
          <RouterLink to="/about" class="text-link">Get to know CCS <Icon name="arrow-right" :size="18" /></RouterLink>
        </div>
        <div class="hero-community">
          <div class="community-logos"><img v-for="p in programs" :key="p.id" :src="imagePath(p.logo)" alt="" width="39" height="39" /></div>
          <span>Different passions.<br /><strong>One Centralian community.</strong></span>
        </div>
      </div>
      <div class="program-deck">
        <div class="deck-caption"><span>Find your direction</span><span aria-live="polite" aria-atomic="true"><strong data-card-count>{{ remaining }}</strong> paths to explore</span></div>
        <div class="deck-stage">
          <div v-if="remaining === 0" class="deck-finish"><Icon name="arrow-down" :size="36" /><p>Your next chapter<br />starts here.</p></div>
          <CardSwap :progress="progress">
            <div v-for="p in programs" :key="p.id" class="deck-card" :class="p.theme">
              <div class="deck-card-top"><span>{{ p.code }}</span><img :src="imagePath(p.logo)" :alt="p.org" width="38" height="38" /></div>
              <ProgramArt :program="p" />
              <div class="deck-card-copy"><h2>{{ p.name }}</h2><p>{{ p.short }}</p><RouterLink :to="`/programs/${p.id}`" class="text-link">Meet {{ p.code }} <Icon name="arrow-up-right" :size="18" /></RouterLink></div>
            </div>
          </CardSwap>
        </div>
        <nav class="deck-jumpnav" aria-label="Jump to a program"><RouterLink v-for="p in programs" :key="p.id" :to="`/programs/${p.id}`">{{ p.code }}<Icon name="arrow-up-right" :size="12" /></RouterLink></nav>
      </div>
    </div>
    <div class="container hero-bottom"><span>{{ pinned ? 'Scroll to explore the four possibilities.' : 'Four paths. One Centralian community.' }}</span><RouterLink to="/programs">Your next chapter, this way <Icon name="arrow-down" :size="15" /></RouterLink></div>
  </section>
</template>
