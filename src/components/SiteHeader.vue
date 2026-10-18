<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from './Icon.vue'
import { imagePath } from '../data/college'

const route = useRoute()
const router = useRouter()
const motionPaused = inject('motionPaused')
const sections = [
  { id: 'home', label: 'Home', icon: 'sparkles' },
  { id: 'programs', label: 'Programs', icon: 'code' },
  { id: 'about', label: 'About', icon: 'book' },
  { id: 'faculty', label: 'Faculty', icon: 'graduation' },
  { id: 'news', label: 'Stories', icon: 'book' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
]
const currentId = ref('home')
const current = computed(
  () => sections.find((section) => section.id === currentId.value) || sections[0],
)
const hasScrolled = ref(false)
const mobileOpen = ref(false)
const menuButton = ref(null)
const header = ref(null)
const links = new Map()
const highlight = reactive({ left: 0, width: 0 })
let frame = 0
let resizeObserver
let elements = []

function measureHighlight() {
  const link = links.get(currentId.value)
  if (link) {
    highlight.left = link.offsetLeft
    highlight.width = link.offsetWidth
  }
}
function updateScroll() {
  frame = 0
  hasScrolled.value = window.scrollY > 0
  const readingLine = Math.min(220, Math.max(120, window.innerHeight * 0.25))
  let active = 'home'
  for (const element of elements) {
    if (element.getBoundingClientRect().top <= readingLine) active = element.id
  }
  currentId.value = active
  measureHighlight()
}
function scheduleUpdate() {
  if (!frame) frame = requestAnimationFrame(updateScroll)
}
async function goToSection(id) {
  mobileOpen.value = false
  if (route.path !== '/' || route.hash !== `#${id}`) {
    await router.push({ path: '/', hash: `#${id}`, query: route.path === '/' ? route.query : {} })
  } else {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: motionPaused.value ? 'instant' : 'smooth' })
  }
}
function onKeydown(event) {
  if (event.key === 'Escape' && mobileOpen.value) {
    mobileOpen.value = false
    menuButton.value?.focus()
  }
}
function onOutsideClick(event) {
  if (mobileOpen.value && !event.composedPath().includes(header.value)) mobileOpen.value = false
}
watch(currentId, async () => {
  await nextTick()
  measureHighlight()
})
watch(
  () => route.path,
  async () => {
    await nextTick()
    elements = [...document.querySelectorAll('[data-scroll-section]')]
    scheduleUpdate()
  },
)
onMounted(async () => {
  await nextTick()
  elements = [...document.querySelectorAll('[data-scroll-section]')]
  updateScroll()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onOutsideClick)
  resizeObserver = new ResizeObserver(() => {
    elements = [...document.querySelectorAll('[data-scroll-section]')]
    scheduleUpdate()
  })
  resizeObserver.observe(document.body)
})
onUnmounted(() => {
  if (frame) cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onOutsideClick)
})
</script>

<template>
  <header
    ref="header"
    class="island-header"
    :class="{ 'is-expanded': mobileOpen, 'has-scrolled': hasScrolled }"
    :data-current-section="currentId"
  >
    <div class="island-top">
      <a
        href="#/#home"
        class="island-brand"
        aria-label="CPU College of Computer Studies home"
        @click.prevent="goToSection('home')"
      >
        <span class="island-logo"
          ><img :src="imagePath('ccs-logo.png')" alt="" width="29" height="29"
        /></span>
        <span>CCS</span>
      </a>
      <nav class="island-nav" aria-label="Main navigation">
        <span
          class="island-highlight"
          :style="{ width: `${highlight.width}px`, transform: `translateX(${highlight.left}px)` }"
          aria-hidden="true"
        ></span>
        <a
          v-for="section in sections"
          :key="section.id"
          :ref="
            (element) => {
              if (element) links.set(section.id, element)
            }
          "
          :href="`#/#${section.id}`"
          :class="{ 'is-current': currentId === section.id }"
          :aria-current="currentId === section.id ? 'location' : undefined"
          @click.prevent="goToSection(section.id)"
          >{{ section.label }}</a
        >
      </nav>
      <div class="island-now" aria-label="Current section">
        <span class="island-live-dot"></span>
        <span>{{ current.label }}</span>
      </div>
      <button
        ref="menuButton"
        class="island-menu-button"
        :aria-expanded="mobileOpen"
        aria-controls="island-mobile-nav"
        :aria-label="mobileOpen ? 'Close navigation' : 'Open navigation'"
        @click="mobileOpen = !mobileOpen"
      >
        <Icon :name="mobileOpen ? 'close' : 'menu'" :size="20" />
      </button>
    </div>
    <nav
      v-if="mobileOpen"
      id="island-mobile-nav"
      class="island-mobile-nav"
      aria-label="Section navigation"
    >
      <span class="island-menu-caption">A little guide to your next chapter</span>
      <a
        v-for="section in sections"
        :key="section.id"
        :href="`#/#${section.id}`"
        :class="{ 'is-current': currentId === section.id }"
        :aria-current="currentId === section.id ? 'location' : undefined"
        @click.prevent="goToSection(section.id)"
        ><Icon :name="section.icon" :size="18" /><span>{{ section.label }}</span
        ><span v-if="currentId === section.id" class="island-here">You’re here</span
        ><Icon v-else name="arrow-up-right" :size="16"
      /></a>
    </nav>
  </header>
</template>
