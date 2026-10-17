<!-- Adapted from Vue Bits: https://vue-bits.dev; see THIRD_PARTY_NOTICES.md. -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue'

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v)

const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1)
  return t * t * (3 - 2 * t)
}

interface ScrollExpandProps {
  src?: string
  mediaType?: 'image' | 'video'
  poster?: string
  alt?: string
  title?: string
  scrollHint?: string
  startWidth?: number
  startHeight?: number
  startRadius?: number
  endRadius?: number
  mediaZoom?: number
  scrollDistance?: number
  holdDistance?: number
  smoothing?: number
  overlayScrim?: number
  useWindowScroll?: boolean
  enabled?: boolean
  className?: string
  style?: CSSProperties
}

const props = withDefaults(defineProps<ScrollExpandProps>(), {
  src: '',
  mediaType: 'image',
  poster: '',
  alt: '',
  title: '',
  scrollHint: '',
  startWidth: 42,
  startHeight: 58,
  startRadius: 24,
  endRadius: 0,
  mediaZoom: 1.35,
  scrollDistance: 1.2,
  holdDistance: 0.35,
  smoothing: 0.1,
  overlayScrim: 0.45,
  useWindowScroll: false,
  enabled: true,
  className: '',
})

const rootRef = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const stageRef = ref<HTMLDivElement | null>(null)
const frameRef = ref<HTMLDivElement | null>(null)
const mediaRef = ref<HTMLImageElement | HTMLVideoElement | null>(null)
const titleRef = ref<HTMLDivElement | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const scrimRef = ref<HTMLDivElement | null>(null)
const hintRef = ref<HTMLDivElement | null>(null)

let teardown: (() => void) | null = null

const applyProgress = (p: number) => {
  const frame = frameRef.value
  const media = mediaRef.value
  if (!frame || !media) return

  const e = smoothstep(0, 1, p)

  const w = props.startWidth + (100 - props.startWidth) * e
  const h = props.startHeight + (100 - props.startHeight) * e
  const ix = Math.max(0, (100 - w) / 2)
  const iy = Math.max(0, (100 - h) / 2)
  const r = props.startRadius + (props.endRadius - props.startRadius) * e
  frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`

  media.style.transform = `scale(${props.mediaZoom + (1 - props.mediaZoom) * e})`

  if (scrimRef.value) scrimRef.value.style.opacity = `${props.overlayScrim * e}`

  if (titleRef.value) {
    const out = smoothstep(0.4, 0.88, p)
    titleRef.value.style.opacity = `${1 - out}`
    titleRef.value.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`
  }

  if (hintRef.value) {
    const gone = smoothstep(0, 0.12, p)
    hintRef.value.style.opacity = `${1 - gone}`
    hintRef.value.style.transform = `translate3d(0, ${8 * gone}px, 0)`
  }

  if (overlayRef.value) {
    const inn = smoothstep(0.68, 1, p)
    overlayRef.value.style.opacity = `${inn}`
    overlayRef.value.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`
    overlayRef.value.inert = inn < 0.1
  }
}

const setup = () => {
  const root = rootRef.value
  const track = trackRef.value
  const stage = stageRef.value
  if (!root || !track || !stage) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let raf = 0
  let current = 0
  let target = 0
  let stageH = 0
  let running = false

  const measure = () => {
    stageH = props.useWindowScroll ? window.innerHeight : root.clientHeight
    if (stageH <= 0) return
    stage.style.height = `${stageH}px`
    const distance =
      props.enabled && !reduceMotion
        ? 1 + Math.max(0, props.scrollDistance) + Math.max(0, props.holdDistance)
        : 1
    track.style.height = `${stageH * distance}px`

    const w = root.clientWidth || stageH
    stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`)
  }

  const readProgress = () => {
    if (!props.enabled || reduceMotion) return 1
    const span = stageH * Math.max(0.01, props.scrollDistance)
    if (props.useWindowScroll) {
      const top = track.getBoundingClientRect().top
      return clamp(-top / span, 0, 1)
    }
    return clamp(root.scrollTop / span, 0, 1)
  }

  const tick = () => {
    const k = props.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * props.smoothing))
    current += (target - current) * k
    if (Math.abs(target - current) < 0.0004) {
      current = target
      running = false
    }
    applyProgress(current)
    raf = running ? requestAnimationFrame(tick) : 0
  }

  const kick = () => {
    if (running) return
    running = true
    if (!raf) raf = requestAnimationFrame(tick)
  }

  const onScroll = () => {
    target = readProgress()
    if (props.smoothing <= 0 || reduceMotion) {
      current = target
      applyProgress(current)
      return
    }
    kick()
  }

  const onResize = () => {
    measure()
    target = readProgress()
    current = target
    applyProgress(current)
  }

  measure()
  target = readProgress()
  current = target
  applyProgress(current)

  const scroller: Window | HTMLDivElement = props.useWindowScroll ? window : root
  scroller.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  const ro = new ResizeObserver(onResize)
  ro.observe(root)

  teardown = () => {
    if (raf) cancelAnimationFrame(raf)
    scroller.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    ro.disconnect()
  }
}

onMounted(() => {
  setup()
})

onUnmounted(() => {
  teardown?.()
  teardown = null
})

watch(
  () => props.useWindowScroll,
  () => {
    teardown?.()
    teardown = null
    setup()
  },
)
</script>

<template>
  <div
    ref="rootRef"
    class="relative w-full h-full"
    :class="[
      useWindowScroll
        ? ''
        : 'overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
      className,
    ]"
    :style="style"
  >
    <div ref="trackRef" class="relative w-full">
      <div ref="stageRef" class="top-0 sticky w-full overflow-hidden [--se-title-size:4rem]">
        <div
          ref="frameRef"
          class="absolute inset-0 will-change-[clip-path] [clip-path:inset(21%_29%_21%_29%_round_24px)]"
        >
          <video
            v-if="mediaType === 'video'"
            ref="mediaRef"
            class="absolute inset-0 w-full h-full object-cover origin-center select-none will-change-transform"
            :src="src"
            :poster="poster"
            autoplay
            muted
            loop
            playsinline
          />
          <img
            v-else
            ref="mediaRef"
            class="absolute inset-0 w-full h-full object-cover origin-center select-none will-change-transform"
            :src="src"
            :alt="alt"
            :draggable="false"
          />
          <div
            ref="scrimRef"
            class="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75),rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.35))] opacity-0 pointer-events-none"
          />
          <div
            v-if="$slots.default"
            ref="overlayRef"
            class="absolute inset-0 flex flex-col justify-center items-center opacity-0 p-[6%] text-center will-change-[opacity,transform]"
          >
            <slot />
          </div>
        </div>
        <div
          v-if="title"
          ref="titleRef"
          class="absolute inset-0 flex justify-center items-center m-0 px-[6%] font-bold text-white text-center leading-none tracking-[-0.03em] pointer-events-none will-change-[opacity,transform] [font-size:var(--se-title-size)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
        >
          {{ title }}
        </div>
        <div
          v-if="scrollHint"
          ref="hintRef"
          class="bottom-5 absolute inset-x-0 text-[0.8125rem] text-white/55 text-center tracking-[0.02em] pointer-events-none will-change-[opacity,transform]"
        >
          {{ scrollHint }}
        </div>
      </div>
    </div>
  </div>
</template>
