<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CardSwap from './vue-bits/CardSwap.vue'
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
let refreshFrame
let disposed = false

function refreshScrollEffects() {
  cancelAnimationFrame(refreshFrame)
  refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
}

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
  if (trigger && !motionPaused.value && pinned.value === canPin) { trigger.refresh(); return }
  trigger?.kill(true)
  trigger = null
  pinned.value = canPin
  progress.value = 0
  if (motionPaused.value) { refreshScrollEffects(); return }
  // Short viewports use ordinary page scrolling so the headline and links stay reachable.
  trigger = ScrollTrigger.create({
    trigger: canPin ? hero.value : hero.value.querySelector('.deck-stage'),
    start: canPin ? 'top top' : 'top 38%',
    end: canPin ? () => `+=${window.innerHeight * 2}` : 'bottom top',
    pin: canPin,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => { progress.value = self.progress },
  })
  refreshScrollEffects()
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
  cancelAnimationFrame(refreshFrame)
  observer?.disconnect()
  window.removeEventListener('resize', scheduleSetup)
  trigger?.kill(true)
})
</script>

<template>
  <section id="home" ref="hero" data-scroll-section class="hero-section journey-intro" :data-pinned="pinned">
    <div class="container hero-grid">
      <div class="hero-copy">
        <h1>Think big.<br />Build <span class="hero-word">what’s next.</span></h1>
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
        <div class="deck-stage" :data-cards-remaining="remaining">
          <div v-if="remaining === 0" class="deck-finish"><Icon name="arrow-down" :size="36" /><p>Your next chapter<br />starts here.</p></div>
          <CardSwap :progress="progress">
            <div v-for="p in programs" :key="p.id" class="deck-card">
              <div class="deck-card-top"><Icon :name="p.icon" :size="20" /><span>{{ p.code }}</span></div>
              <div class="deck-card-copy"><h2>{{ p.name }}</h2><RouterLink :to="`/programs/${p.id}`" class="text-link">Explore program <Icon name="arrow-up-right" :size="18" /></RouterLink></div>
            </div>
          </CardSwap>
        </div>
      </div>
    </div>
    <div class="container hero-bottom"><span>{{ pinned ? 'Scroll to explore the four possibilities.' : 'Four paths. One Centralian community.' }}</span><RouterLink to="/programs">Your next chapter, this way <Icon name="arrow-down" :size="15" /></RouterLink></div>
  </section>
</template>
