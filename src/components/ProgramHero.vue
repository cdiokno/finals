<script setup>
import { computed, defineAsyncComponent, inject, onErrorCaptured, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LetterGlitch from './vue-bits/LetterGlitch.vue'
import Cubes from './vue-bits/Cubes.vue'
import DriftWall from './vue-bits/DriftWall.vue'
import Icon from './Icon.vue'
import { imagePath } from '../data/college'
import { libraryPhotos } from '../data/programMedia'

const ModelViewer = defineAsyncComponent(() => import('./vue-bits/ModelViewer.vue'))
gsap.registerPlugin(ScrollTrigger)
const props = defineProps({ program: { type: Object, required: true } })
const motionPaused = inject('motionPaused')
const root = ref(null)
const runway = ref(null)
const visible = ref(false)
const tabVisible = ref(!document.hidden)
const modelFailed = ref(false)
const modelLoaded = ref(false)
const orbitProgress = ref(0)
const wheelEnd = computed(() => props.program.id === 'bsdmia' ? 0.55 : 1)
const options = computed(() => [
  { label: 'The idea', text: props.program.short },
  { label: 'What you’ll learn', text: props.program.subjects.slice(0, 3).join(' · ') },
  { label: 'What you’ll create', text: props.program.objectives[0] },
  { label: 'Where you’ll go', text: props.program.careers.slice(0, 3).join(' · ') },
])
const wheelPosition = computed(() => Math.min(orbitProgress.value / wheelEnd.value, 1) * (options.value.length - 1))
const selected = computed(() => Math.round(wheelPosition.value))
// Fast moves followed by a hold give each scroll-controlled camera beat weight.
const shots = [
  [0.12, -0.5, -0.04, 1],
  [-0.28, 0.75, 0.12, 1.42],
  [0.42, 2.65, -0.16, 0.92],
  [-0.2, 4.8, 0.1, 1.3],
  [0.16, Math.PI * 2 - 0.35, 0, 1.06],
]
const modelPose = computed(() => {
  const position = orbitProgress.value * (shots.length - 1)
  const index = Math.min(Math.floor(position), shots.length - 2)
  const t = Math.min((position - index) / 0.65, 1)
  const eased = 1 - Math.pow(1 - t, 3)
  return shots[index].map((value, axis) => value + (shots[index + 1][axis] - value) * eased)
})
const modelRotation = computed(() => modelPose.value.slice(0, 3))
function selectOption(index) {
  if (motionPaused.value || !orbitTween?.scrollTrigger || getComputedStyle(root.value).position !== 'sticky') {
    orbitProgress.value = index / (options.value.length - 1) * wheelEnd.value
    return
  }
  const trigger = orbitTween.scrollTrigger
  window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * index / (options.value.length - 1) * wheelEnd.value, behavior: 'instant' })
}
const active = computed(() => visible.value && tabVisible.value && !motionPaused.value)
watch(active, () => { modelLoaded.value = false })
const colors = ['#665b93', '#a195ce', '#667da5']
const modelUrl = `${import.meta.env.BASE_URL}models/robot-expressive.glb`
const glitchText = Array.from({ length: 34 }, (_, r) => Array.from({ length: 130 }, (_, c) => '01{}<>/ABCXYZ+=[]'[ (r * 7 + c * 13) % 16 ]).join('')).join('\n')
let observer
let orbitTween
function setupOrbit() {
  orbitTween?.scrollTrigger?.kill()
  orbitTween?.kill()
  orbitProgress.value = 0
  if (motionPaused.value || !runway.value) return
  orbitTween = gsap.fromTo(orbitProgress, { value: 0 }, {
    value: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: runway.value,
      start: () => getComputedStyle(root.value).position === 'sticky' ? 'top top' : 'top 70%',
      end: () => getComputedStyle(root.value).position === 'sticky' ? 'bottom bottom' : 'bottom 30%',
      scrub: 0.25,
      invalidateOnRefresh: true,
    },
  })
}
watch(motionPaused, setupOrbit, { flush: 'post' })
function updateVisibility() { tabVisible.value = !document.hidden }
function failModel() { modelFailed.value = true }
onErrorCaptured(() => {
  if (props.program.id === 'bsdmia') { failModel(); return false }
})
onMounted(() => {
  setupOrbit()
  observer = new IntersectionObserver(([entry]) => { visible.value = entry.isIntersecting }, { threshold: 0 })
  observer.observe(root.value)
  document.addEventListener('visibilitychange', updateVisibility)
})
onUnmounted(() => {
  observer?.disconnect()
  orbitTween?.scrollTrigger?.kill()
  orbitTween?.kill()
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>

<template>
  <div ref="runway" class="chapter-runway" :class="{ 'chapter-runway-long': program.id === 'bsdmia', 'is-paused': motionPaused }">
  <div ref="root" class="chapter-hero" :class="[`chapter-${program.id}`, program.theme]" :data-effect-active="active">
    <div v-if="program.id === 'bscs'" class="chapter-glitch" aria-hidden="true">
      <LetterGlitch v-if="active" class="glitch-canvas" :glitch-colors="colors" :glitch-speed="100" :smooth="false" />
      <pre v-else class="glitch-still">{{ glitchText }}</pre>
    </div>
    <div v-if="program.id === 'blis'" class="chapter-wall" aria-hidden="true" inert>
      <DriftWall v-if="active" :items="libraryPhotos" :columns="5" :tile-width="260" :tile-height="185" :speed="24" :parallax="0" :lift="0" :dim="1" :fade="0.18" :tilt="12" :turn="-12" overlay-color="#182850" />
      <div v-else class="wall-still"><img v-for="(photo, i) in [...libraryPhotos, ...libraryPhotos, ...libraryPhotos]" :key="i" :src="photo.image" alt="" loading="lazy" /></div>
    </div>
    <div class="container chapter-hero-grid">
      <div class="chapter-copy">
        <div class="chapter-label"><img :src="imagePath(program.logo)" alt="" width="36" height="36" /><span>{{ program.code }}</span><span class="chapter-degree">{{ program.degree }}</span></div>
        <h2>{{ program.name }}</h2>
        <div class="program-wheel" :aria-label="`About ${program.code}`">
          <div class="program-wheel-options" role="group" aria-label="Explore the program">
            <button v-for="(option, index) in options" :key="option.label" type="button" :aria-pressed="selected === index" :class="{ 'is-selected': selected === index }" @click="selectOption(index)">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>{{ option.label }}
            </button>
          </div>
          <div class="program-wheel-window">
            <div class="program-wheel-drum" :style="{ transform: `translateZ(-80px) rotateX(${wheelPosition * 90}deg)` }">
              <p v-for="(option, index) in options" :key="option.label" :aria-hidden="selected !== index" :style="{ transform: `rotateX(${-index * 90}deg) translateZ(80px)` }">{{ option.text }}</p>
            </div>
          </div>
        </div>
        <a :href="`#/#program-${program.id}-details`" class="button" :class="program.id === 'bscs' || program.id === 'blis' ? 'button-yellow' : 'button-navy'">Discover {{ program.code }} <Icon name="arrow-down" :size="18" /></a>
      </div>
      <div v-if="program.id === 'bsit'" class="chapter-cubes" aria-hidden="true">
        <Cubes v-if="active" :grid-size="7" :max-angle="32" :radius="3" face-color="#a8d8bf" border-style="1px solid #477560" :ripple-on-click="false" :duration="{ enter: 0.2, leave: 0.25 }" />
        <div v-else class="cubes-still"><span v-for="i in 49" :key="i"></span></div>
      </div>
      <div v-if="program.id === 'bsdmia'" class="chapter-model" :data-model-state="modelFailed ? 'failed' : modelLoaded && active ? 'loaded' : 'poster'">
        <img class="model-poster" :src="imagePath('dmia-robot-poster.png')" alt="A stylized low-poly robot character representing 3D animation and game art" width="600" height="600" loading="lazy" />
        <ModelViewer v-if="active && !modelFailed" class="dmia-viewer" :url="modelUrl" width="100%" height="100%" :auto-frame="true" :default-rotation-x="-20" :default-rotation-y="8" :rotation="modelRotation" :zoom="modelPose[3] * 1.2" :enable-manual-rotation="false" :enable-manual-zoom="false" :enable-hover-rotation="false" :enable-mouse-parallax="false" :show-screenshot-button="false" environment-preset="none" :ambient-intensity="1.8" :key-light-intensity="3" :auto-rotate="false" @model-loaded="modelLoaded = true" @model-error="failModel" />
        <span v-if="active && !modelFailed" class="model-hint">Scroll for a new perspective.</span>
        <span v-else class="model-hint">A little character. A world of possibilities.</span>
      </div>
    </div>
    <div class="container chapter-hero-bottom"><span>{{ program.id === 'blis' ? 'Henry Luce III Library · Central Philippine University' : 'CPU College of Computer Studies' }}</span><span>Keep scrolling to take a closer look <Icon name="arrow-down" :size="14" /></span></div>
  </div>
  </div>
</template>
