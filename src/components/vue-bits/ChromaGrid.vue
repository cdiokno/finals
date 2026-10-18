<!-- Adapted from Vue Bits: https://vue-bits.dev; see THIRD_PARTY_NOTICES.md. -->
<script setup lang="ts">
import { onMounted, onUnmounted, computed, useTemplateRef, shallowRef, reactive, watch } from 'vue'
import gsap from 'gsap'
import { useMotionPaused } from '../../composables/useMotionPreference'

interface CardItem {
  image?: string
  id?: string
  initials?: string
  title: string
  subtitle: string
  handle?: string
  borderColor?: string
  gradient?: string
  url?: string
  location?: string
}

interface GridMotionProps {
  items?: CardItem[]
  className?: string
  radius?: number
  damping?: number
  fadeOut?: number
  ease?: string
}

const props = withDefaults(defineProps<GridMotionProps>(), {
  items: () => [],
  className: '',
  radius: 300,
  damping: 0.45,
  fadeOut: 0.6,
  ease: 'power3.out',
})

const rootRef = useTemplateRef<HTMLElement>('rootRef')
const fadeRef = useTemplateRef<HTMLElement>('fadeRef')
const setX = shallowRef<(value: number | string) => void>()
const setY = shallowRef<(value: number | string) => void>()
const pos = reactive({ x: 0, y: 0 })
const motionPaused = useMotionPaused()
watch(motionPaused, (paused) => {
  if (!paused) return
  gsap.killTweensOf(pos)
  if (fadeRef.value) {
    gsap.killTweensOf(fadeRef.value)
    fadeRef.value.style.opacity = '1'
  }
})

const data = computed(() => props.items)
const emit = defineEmits<{ select: [index: number] }>()
onUnmounted(() => {
  gsap.killTweensOf(pos)
  if (fadeRef.value) gsap.killTweensOf(fadeRef.value)
})

onMounted(() => {
  const el = rootRef.value
  if (!el) return

  setX.value = gsap.quickSetter(el, '--x', 'px') as (value: number | string) => void
  setY.value = gsap.quickSetter(el, '--y', 'px') as (value: number | string) => void
  const { width, height } = el.getBoundingClientRect()
  pos.x = width / 2
  pos.y = height / 2
  setX.value?.(pos.x)
  setY.value?.(pos.y)
})

const moveTo = (x: number, y: number) => {
  gsap.to(pos, {
    x,
    y,
    duration: props.damping,
    ease: props.ease,
    onUpdate: () => {
      setX.value?.(pos.x)
      setY.value?.(pos.y)
    },
    overwrite: true,
  })
}

const handleMove = (e: PointerEvent) => {
  if (motionPaused.value) return
  const r = rootRef.value?.getBoundingClientRect()
  if (!r) return
  moveTo(e.clientX - r.left, e.clientY - r.top)
  if (fadeRef.value) {
    gsap.to(fadeRef.value, { opacity: 0, duration: 0.25, overwrite: true })
  }
}

const handleLeave = () => {
  if (motionPaused.value) return
  if (fadeRef.value) {
    gsap.to(fadeRef.value, {
      opacity: 1,
      duration: props.fadeOut,
      overwrite: true,
    })
  }
}

const handleCardClick = (url?: string) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const handleCardMove = (e: MouseEvent) => {
  if (motionPaused.value) return
  const c = e.currentTarget as HTMLElement
  const rect = c.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  c.style.setProperty('--mouse-x', `${x}px`)
  c.style.setProperty('--mouse-y', `${y}px`)
}

const spotlightStyle = {
  backdropFilter: 'grayscale(1)',
  WebkitBackdropFilter: 'grayscale(1)',
  background: 'rgba(0,0,0,0.001)',
  maskImage:
    'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)',
  WebkitMaskImage:
    'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)',
}

const fadeStyle = {
  ...spotlightStyle,
  maskImage:
    'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
  WebkitMaskImage:
    'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
  opacity: 1,
}
</script>

<template>
  <div
    ref="rootRef"
    class="chroma-grid"
    :class="className"
    :style="{ '--r': `${props.radius}px`, '--x': '50%', '--y': '50%' }"
    @pointermove="handleMove"
    @pointerleave="handleLeave"
  >
    <button
      v-for="(c, i) in data"
      :key="c.id || c.title"
      type="button"
      class="faculty-card"
      :style="{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--card-border': c.borderColor || '#a8b5ed',
      }"
      @mousemove="handleCardMove"
      @click="emit('select', i)"
      :aria-label="`View profile: ${c.title}`"
    >
      <div class="faculty-photo">
        <img v-if="c.image" :src="c.image" :alt="c.title" loading="lazy" />
        <div v-else class="faculty-initials">{{ c.initials }}<small>Photo to follow</small></div>
        <span class="faculty-open" aria-hidden="true">↗</span>
      </div>
      <div class="faculty-caption">
        <span class="faculty-program">{{ c.handle }}</span>
        <h3>{{ c.title }}</h3>
        <p>{{ c.subtitle }}</p>
      </div>
    </button>
    <div class="chroma-overlay" :style="spotlightStyle" aria-hidden="true" />
    <div ref="fadeRef" class="chroma-overlay" :style="fadeStyle" aria-hidden="true" />
  </div>
</template>
