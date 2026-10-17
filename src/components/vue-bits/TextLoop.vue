<!-- Adapted from Vue Bits: https://vue-bits.dev; see THIRD_PARTY_NOTICES.md. -->
<script setup lang="ts">
import { gsap } from 'gsap'
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue'

export type TextLoopShape = 'wave' | 'circle' | 'infinity' | 'arch' | 'line'
export type TextLoopDirection = 'forward' | 'reverse'

interface TextLoopProps {
  text?: string
  shape?: TextLoopShape
  path?: string
  speed?: number
  direction?: TextLoopDirection
  separator?: string
  curviness?: number
  fontSize?: number
  fontWeight?: number | string
  letterSpacing?: number
  uppercase?: boolean
  color?: string
  ribbon?: boolean
  ribbonColor?: string
  ribbonWidth?: number
  pauseOnHover?: boolean
  className?: string
  style?: CSSProperties
}

interface Metrics {
  length: number
  reps: number
}

const VIEW_W = 1200
const VIEW_H = 520
const CX = VIEW_W / 2
const CY = VIEW_H / 2
const EDGE_PAD = 6

const buildPath = (shape: TextLoopShape, curviness: number, ribbonWidth: number): string => {
  const c = Math.max(0, curviness)
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD)

  switch (shape) {
    case 'circle': {
      const r = Math.min(90 + c * 0.95, room)
      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`
    }
    case 'infinity': {
      const r = 150 + c * 1.4
      const h = Math.min(60 + c * 0.95, room)
      return [
        `M ${CX} ${CY}`,
        `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,
        `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,
        `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,
        `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,
        'Z',
      ].join(' ')
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2)
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`
    }
    case 'line':
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2)
      return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`
    }
  }
}

const props = withDefaults(defineProps<TextLoopProps>(), {
  text: 'React ✦ Bits',
  shape: 'wave',
  speed: 90,
  direction: 'forward',
  separator: '✦',
  curviness: 90,
  fontSize: 46,
  fontWeight: 800,
  letterSpacing: 2,
  uppercase: true,
  color: '#ffffff',
  ribbon: true,
  ribbonColor: '#5227FF',
  ribbonWidth: 86,
  pauseOnHover: true,
  className: '',
})

const rootRef = ref<HTMLDivElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const measureRef = ref<SVGTextElement | null>(null)
const headRef = ref<SVGTextPathElement | null>(null)
const tailRef = ref<SVGTextPathElement | null>(null)

const metrics = ref<Metrics>({ length: 0, reps: 1 })

const uid = Math.random().toString(36).slice(2, 10)
const pathId = `text-loop-${uid}`

const d = computed(() => props.path || buildPath(props.shape, props.curviness, props.ribbonWidth))

const unit = computed(() => {
  const base = props.uppercase ? String(props.text).toUpperCase() : String(props.text)
  const gap = props.separator ? `\u00A0${props.separator}\u00A0` : '\u00A0\u00A0\u00A0'
  return `${base}${gap}`
})

const textStyle = computed<CSSProperties>(() => ({
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  letterSpacing: `${props.letterSpacing}px`,
}))

const loopText = computed(() => unit.value.repeat(metrics.value.reps))
const fitLength = computed(() => metrics.value.length || undefined)

let cancelMeasure: (() => void) | null = null

const runMeasure = () => {
  cancelMeasure?.()
  let cancelled = false
  cancelMeasure = () => {
    cancelled = true
  }

  const measureOnce = () => {
    if (cancelled) return
    const pathEl = pathRef.value
    const measureEl = measureRef.value
    if (!pathEl || !measureEl) return
    let length = 0
    let unitWidth = 0
    try {
      length = pathEl.getTotalLength()
      unitWidth = measureEl.getComputedTextLength()
    } catch {
      return
    }
    if (!length) return

    const reps = unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1
    const prev = metrics.value
    metrics.value = prev.length === length && prev.reps === reps ? prev : { length, reps }
  }

  measureOnce()
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(measureOnce).catch(() => {})
  }
}

onMounted(() => {
  runMeasure()
})

onUnmounted(() => {
  cancelMeasure?.()
  cancelMeasure = null
})

watch(
  () => [d.value, unit.value, props.fontSize, props.fontWeight, props.letterSpacing],
  () => runMeasure(),
  { flush: 'post' },
)

let animTeardown: (() => void) | null = null

const setupAnimation = () => {
  const { length } = metrics.value
  const head = headRef.value
  const tail = tailRef.value
  if (!head || !tail || !length) return

  const apply = (offset: number) => {
    const partner = offset >= 0 ? offset - length : offset + length
    head.setAttribute('startOffset', String(offset))
    tail.setAttribute('startOffset', String(partner))
  }

  apply(0)

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced || props.speed <= 0) return

  const state = { offset: 0 }
  const tween = gsap.to(state, {
    offset: props.direction === 'reverse' ? -length : length,
    duration: length / props.speed,
    ease: 'none',
    repeat: -1,
    onUpdate: () => apply(state.offset),
  })

  const root = rootRef.value
  const pause = () => tween.pause()
  const resume = () => tween.resume()

  if (props.pauseOnHover && root) {
    root.addEventListener('pointerenter', pause)
    root.addEventListener('pointerleave', resume)
  }

  animTeardown = () => {
    tween.kill()
    if (props.pauseOnHover && root) {
      root.removeEventListener('pointerenter', pause)
      root.removeEventListener('pointerleave', resume)
    }
  }
}

onUnmounted(() => {
  animTeardown?.()
  animTeardown = null
})

watch(
  () => [metrics.value, props.speed, props.direction, props.pauseOnHover],
  () => {
    animTeardown?.()
    animTeardown = null
    setupAnimation()
  },
  { flush: 'post' },
)
</script>

<template>
  <div ref="rootRef" class="relative w-full overflow-hidden" :class="className" :style="style">
    <svg
      class="block w-full h-auto"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="text"
    >
      <path
        ref="pathRef"
        :id="pathId"
        :d="d"
        fill="none"
        :stroke="ribbon ? ribbonColor : 'none'"
        :stroke-width="ribbon ? ribbonWidth : 0"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <text
        ref="measureRef"
        class="invisible pointer-events-none"
        :style="textStyle"
        aria-hidden="true"
      >
        {{ unit }}
      </text>

      <text
        class="select-none"
        :style="textStyle"
        :fill="color"
        dominant-baseline="central"
        aria-hidden="true"
      >
        <textPath
          ref="headRef"
          :href="`#${pathId}`"
          :start-offset="0"
          :text-length="fitLength"
          length-adjust="spacing"
        >
          {{ loopText }}
        </textPath>
      </text>

      <text
        class="select-none"
        :style="textStyle"
        :fill="color"
        dominant-baseline="central"
        aria-hidden="true"
      >
        <textPath
          ref="tailRef"
          :href="`#${pathId}`"
          :start-offset="0"
          :text-length="fitLength"
          length-adjust="spacing"
        >
          {{ loopText }}
        </textPath>
      </text>
    </svg>
  </div>
</template>
