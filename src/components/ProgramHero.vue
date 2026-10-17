<script setup>
import { computed, defineAsyncComponent, inject, onErrorCaptured, onMounted, onUnmounted, ref, watch } from 'vue'
import LetterGlitch from './vue-bits/LetterGlitch.vue'
import Cubes from './vue-bits/Cubes.vue'
import DriftWall from './vue-bits/DriftWall.vue'
import Icon from './Icon.vue'
import { imagePath } from '../data/college'
import { libraryPhotos } from '../data/programMedia'

const ModelViewer = defineAsyncComponent(() => import('./vue-bits/ModelViewer.vue'))
const props = defineProps({ program: { type: Object, required: true } })
const motionPaused = inject('motionPaused')
const root = ref(null)
const visible = ref(false)
const tabVisible = ref(!document.hidden)
const modelFailed = ref(false)
const modelLoaded = ref(false)
const active = computed(() => visible.value && tabVisible.value && !motionPaused.value)
watch(active, () => { modelLoaded.value = false })
const colors = ['#665b93', '#a195ce', '#667da5']
const modelUrl = `${import.meta.env.BASE_URL}models/robot-expressive.glb`
const glitchText = Array.from({ length: 34 }, (_, r) => Array.from({ length: 130 }, (_, c) => '01{}<>/ABCXYZ+=[]'[ (r * 7 + c * 13) % 16 ]).join('')).join('\n')
let observer
function updateVisibility() { tabVisible.value = !document.hidden }
function failModel() { modelFailed.value = true }
onErrorCaptured(() => {
  if (props.program.id === 'bsdmia') { failModel(); return false }
})
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { visible.value = entry.isIntersecting }, { threshold: 0 })
  observer.observe(root.value)
  document.addEventListener('visibilitychange', updateVisibility)
})
onUnmounted(() => { observer?.disconnect(); document.removeEventListener('visibilitychange', updateVisibility) })
</script>

<template>
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
        <p class="chapter-tagline">{{ program.tagline }}</p>
        <p class="chapter-description">{{ program.short }}</p>
        <a :href="`#/#program-${program.id}-details`" class="button" :class="program.id === 'bscs' || program.id === 'blis' ? 'button-yellow' : 'button-navy'">Discover {{ program.code }} <Icon name="arrow-down" :size="18" /></a>
      </div>
      <div v-if="program.id === 'bsit'" class="chapter-cubes" aria-hidden="true">
        <Cubes v-if="active" :grid-size="7" :max-angle="32" :radius="3" face-color="#a8d8bf" border-style="1px solid #477560" :ripple-on-click="false" :duration="{ enter: 0.2, leave: 0.25 }" />
        <div v-else class="cubes-still"><span v-for="i in 49" :key="i"></span></div>
      </div>
      <div v-if="program.id === 'bsdmia'" class="chapter-model" :data-model-state="modelFailed ? 'failed' : modelLoaded && active ? 'loaded' : 'poster'">
        <img class="model-poster" :src="imagePath('dmia-robot-poster.png')" alt="A stylized low-poly robot character representing 3D animation and game art" width="600" height="600" loading="lazy" />
        <ModelViewer v-if="active && !modelFailed" class="dmia-viewer" :url="modelUrl" width="100%" height="100%" :auto-frame="true" :default-rotation-x="-20" :default-rotation-y="8" :enable-manual-zoom="false" :enable-hover-rotation="false" :enable-mouse-parallax="false" :show-screenshot-button="false" environment-preset="none" :ambient-intensity="1.8" :key-light-intensity="3" :auto-rotate="false" @model-loaded="modelLoaded = true" @model-error="failModel" />
        <span v-if="active && !modelFailed" class="model-hint">Drag to turn. Imagine what you could create.</span>
        <span v-else class="model-hint">A little character. A world of possibilities.</span>
      </div>
    </div>
    <div class="container chapter-hero-bottom"><span>{{ program.id === 'blis' ? 'Henry Luce III Library · Central Philippine University' : 'CPU College of Computer Studies' }}</span><span>Keep scrolling to take a closer look <Icon name="arrow-down" :size="14" /></span></div>
  </div>
</template>
