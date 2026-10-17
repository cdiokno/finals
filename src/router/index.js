import { nextTick } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const homeSection = (hash, query = {}) => ({ path: '/', hash: `#${hash}`, query })
const routes = [
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Make your next' },
  },
  { path: '/about', redirect: () => homeSection('about') },
  { path: '/programs', redirect: () => homeSection('programs') },
  { path: '/programs/:program', redirect: (to) => homeSection(`program-${to.params.program}`) },
  {
    path: '/faculty',
    redirect: (to) => homeSection('faculty', to.query.program ? { faculty: to.query.program } : {}),
  },
  { path: '/news', redirect: () => homeSection('news') },
  { path: '/news/:slug', redirect: (to) => homeSection(`story-${to.params.slug}`) },
  { path: '/contact', redirect: (to) => homeSection('contact', to.query) },
  { path: '/credits', redirect: () => homeSection('credits') },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Filter/query changes preserve the reading position and partially filled form.
    if (to.path === from.path && to.hash === from.hash && to.fullPath !== from.fullPath) return false
    if (to.hash) {
      await nextTick()
      // A fresh deep link can arrive before the async homepage and its pinned intro mount.
      if (!document.getElementById(to.hash.slice(1))) {
        await new Promise((resolve) => {
          const observer = new MutationObserver(() => {
            if (document.getElementById(to.hash.slice(1))) finish()
          })
          const timeout = setTimeout(finish, 1500)
          function finish() { observer.disconnect(); clearTimeout(timeout); resolve() }
          observer.observe(document.getElementById('main-content'), { childList: true, subtree: true })
        })
      }
      await document.fonts.ready
      await nextTick()
      // Font metrics can change whether the intro fits; let its resize observer settle first.
      await new Promise((resolve) => {
        // Background tabs can suspend animation frames; navigation must still finish.
        const timeout = setTimeout(resolve, 100)
        requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(timeout); resolve() }))
      })
      const target = document.getElementById(to.hash.slice(1))
      if (target) {
        // Deep links open their inline program, article, or credits before scrolling.
        for (let element = target; element; element = element.parentElement) {
          if (element instanceof HTMLDetailsElement) element.open = true
        }
        await nextTick()
        return {
          el: target,
          top: 110,
          behavior: document.documentElement.classList.contains('motion-paused')
            ? 'instant'
            : 'smooth',
        }
      }
    }
    return { top: 0 }
  },
})
router.afterEach((to) => {
  document.title = `${to.meta.title} | CPU College of Computer Studies`
})
export default router
