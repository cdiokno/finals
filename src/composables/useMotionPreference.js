import { inject, onUnmounted, ref, watch } from 'vue'

const storageKey = 'ccs-motion-paused'

// The system preference is the default; an explicit site choice takes priority.
export function useMotionPreference() {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  let override = null
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'true' || saved === 'false') override = saved === 'true'
  } catch { /* Storage may be unavailable in private or restricted browsers. */ }

  const paused = ref(override ?? media.matches)
  let followingSystem = false
  const updateSystem = (event) => {
    if (override !== null) return
    followingSystem = true
    paused.value = event.matches
    followingSystem = false
  }
  const stop = watch(paused, (value) => {
    if (followingSystem) return
    override = value
    try { localStorage.setItem(storageKey, String(value)) } catch { /* Keep the in-memory choice. */ }
  }, { flush: 'sync' })
  media.addEventListener('change', updateSystem)
  onUnmounted(() => {
    stop()
    media.removeEventListener('change', updateSystem)
  })
  return paused
}

export function useMotionPaused() {
  return inject('motionPaused', null) ?? useMotionPreference()
}
