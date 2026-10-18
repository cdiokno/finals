<script setup>
import { nextTick, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useMotionPreference } from './composables/useMotionPreference'
import { useScrollMotion } from './composables/useScrollMotion'
const route = useRoute()
const motionPaused = useMotionPreference()
useScrollMotion(motionPaused)
provide('motionPaused', motionPaused)
watch(motionPaused, (value) => document.documentElement.classList.toggle('motion-paused', value), {
  immediate: true,
})
watch(
  () => route.path,
  async () => {
    await nextTick()
    document.getElementById('main-content')?.focus({ preventScroll: true })
  },
)
function skipToContent() {
  const main = document.getElementById('main-content')
  main?.focus({ preventScroll: true })
  main?.scrollIntoView({ behavior: motionPaused.value ? 'instant' : 'smooth' })
}
</script>
<template>
  <a class="skip-link" href="#main-content" @click.prevent="skipToContent">Skip to content</a>
  <SiteHeader />
  <main id="main-content" tabindex="-1">
    <RouterView v-slot="{ Component }"><component :is="Component" :key="route.path" /></RouterView>
  </main>
  <SiteFooter />
</template>
