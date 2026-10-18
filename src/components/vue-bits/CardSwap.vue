<script setup>
// Adapted from Vue Bits Card Swap: the original timer is replaced by reversible scroll progress.
import { onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({ progress: { type: Number, default: 0 } })
const container = ref(null)
let timeline
let observer
let cards = []

function update() {
  const progress = Math.max(0, Math.min(1, props.progress))
  timeline?.progress(progress)
  const front = Math.min(cards.length, Math.floor(progress * cards.length + 0.00001))
  cards.forEach((card, index) => {
    card.inert = index !== front
    card.setAttribute('aria-hidden', String(index !== front))
  })
}

function layout() {
  timeline?.kill()
  cards = Array.from(container.value.children)
  const distance = Math.min(28, container.value.clientWidth * 0.07)
  const slot = (index) => ({ x: index * distance, y: -index * 47 })
  cards.forEach((card, index) => {
    gsap.set(card, {
      ...slot(index), xPercent: -50, yPercent: -50, skewY: 6,
      opacity: 1, rotation: 0, zIndex: cards.length - index, force3D: true,
    })
  })
  timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  cards.forEach((card, index) => {
    timeline.to(card, { y: container.value.clientHeight + 180, duration: 0.85 }, index + 0.15)
    timeline.to(card, { opacity: 0, duration: 0.35 }, index + 0.65)
    cards.slice(index + 1).forEach((next, offset) => {
      timeline.to(next, { ...slot(offset), duration: 0.7 }, index + 0.3)
    })
  })
  update()
}

onMounted(() => {
  observer = new ResizeObserver(layout)
  observer.observe(container.value)
  layout()
})
watch(() => props.progress, update)
onUnmounted(() => { timeline?.kill(); observer?.disconnect() })
</script>

<template>
  <div ref="container" class="card-swap" :data-progress="progress"><slot /></div>
</template>

<style scoped>
.card-swap { position: relative; width: 100%; height: 100%; }
.card-swap :deep(.deck-card) {
  position: absolute; top: 50%; left: 50%; width: 100%; height: 100%;
  backface-visibility: hidden; will-change: transform, opacity;
}
</style>
