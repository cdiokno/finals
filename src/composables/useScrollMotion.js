import { onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Keep one motion treatment across the page, including filtered faculty and stories.
const revealTargets = [
  '.program-chapter-heading',
  '.inline-program-intro', '.inline-program-columns > section', '.inline-program-teachers',
  '.inline-program-footer', '.program-helper', '.story-bottom', '.about-hero > div',
  '.about-campus', '.purpose-section .section-kicker', '.purpose-section h2',
  '.purpose-grid > article', '.history-section > div:first-child', '.timeline > article',
  '.dean-panel', '.community-heading', '.page-intro > *', '.directory-controls',
  '.results-count', '.faculty-group > h3', '.faculty-card',
  '.news-card', '.advice-panel', '.contact-details > *', '.contact-form-panel',
  '.home-credits', '.footer-invitation > *', '.footer-columns > *', '.footer-bottom',
].join(', ')
const imageTargets = '.news-image img, .location-card img'

export function useScrollMotion(motionPaused) {
  const effects = new Map()
  const focusedElements = new WeakSet()
  let root
  let mutationObserver
  let resizeObserver
  let refreshFrame
  let disposed = false

  function refresh() {
    cancelAnimationFrame(refreshFrame)
    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  function sync() {
    for (const [element, effect] of effects) {
      if (motionPaused.value || !element.isConnected) {
        effect.revert()
        effects.delete(element)
      }
    }
    if (motionPaused.value) return

    for (const element of root.querySelectorAll(`${revealTargets}, ${imageTargets}`)) {
      if (effects.has(element) || focusedElements.has(element)) continue
      const image = element.matches(imageTargets)
      const siblings = [...element.parentElement.children].filter(child => child.matches(revealTargets))
      const offset = Math.min(siblings.indexOf(element), 3) * 3
      const effect = gsap.context(() => {
        gsap.fromTo(element,
          image ? { translate: '0 -3%', scale: 1.08 } : { opacity: 0.2, translate: '0 32px' },
          {
            ...(image ? { translate: '0 3%', scale: 1.08 } : { opacity: 1, translate: '0 0' }),
            ease: 'none',
            scrollTrigger: {
              trigger: image ? element.parentElement : element,
              start: image ? 'top bottom' : `clamp(top ${96 - offset}%)`,
              end: image ? 'bottom top' : `clamp(top ${68 - offset}%)`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })
      effects.set(element, effect)
    }
    refresh()
  }

  // Keyboard navigation reveals focused content immediately.
  function revealFocused(event) {
    if (!event.target.matches(':focus-visible')) return
    for (const [element, effect] of effects) {
      if (element.contains(event.target)) {
        focusedElements.add(element)
        effect.revert()
        effects.delete(element)
      }
    }
  }

  onMounted(() => {
    root = document.getElementById('app')
    sync()
    mutationObserver = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node =>
        node instanceof Element && (node.matches(`${revealTargets}, ${imageTargets}`) ||
          node.querySelector(`${revealTargets}, ${imageTargets}`)),
      ))) sync()
    })
    mutationObserver.observe(root, { childList: true, subtree: true })
    resizeObserver = new ResizeObserver(refresh)
    resizeObserver.observe(document.body)
    root.addEventListener('focusin', revealFocused)
    document.fonts.ready.then(() => { if (!disposed) refresh() })
  })
  watch(motionPaused, () => { if (root) sync() }, { flush: 'post' })
  onUnmounted(() => {
    disposed = true
    mutationObserver?.disconnect()
    resizeObserver?.disconnect()
    cancelAnimationFrame(refreshFrame)
    root?.removeEventListener('focusin', revealFocused)
    effects.forEach(effect => effect.revert())
    effects.clear()
  })
}
