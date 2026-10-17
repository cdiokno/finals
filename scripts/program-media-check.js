async function checkProgramMedia(page, base = new URL('/#/', page.url()).href) {
  page.setDefaultTimeout(10000)
  const failures = []
  const check = (value, message) => { if (!value) failures.push(message) }
  await page.unroute('**/models/robot-expressive.glb')
  await page.evaluate(() => sessionStorage.removeItem('qa-no-webgl'))
  const jump = async (id) => {
    await page.locator(`#${id}`).waitFor()
    await page.evaluate(id => {
      const el = document.getElementById(id)
      window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - 110, behavior: 'instant' })
    }, id)
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(base)
  await page.reload()
  await page.waitForFunction(() => document.querySelector('#home')?.dataset.pinned === 'true').catch(() => { throw new Error('Initial desktop intro did not pin') })
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 900 })
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForFunction(() => document.querySelector('[data-card-count]').textContent === '4')
    await page.screenshot({ path: `output/playwright/journey-home-${width}.png`, animations: 'disabled' })
    for (const id of ['bscs', 'bsit', 'bsdmia', 'blis']) {
      await jump(`program-${id}`)
      await page.waitForFunction(id => Math.abs(document.querySelector(`#program-${id}`).getBoundingClientRect().top - 110) < 5, id)
      if (id === 'bsdmia') await page.waitForFunction(() => document.querySelector('.chapter-model').dataset.modelState === 'loaded').catch(() => { throw new Error(`DMIA model did not load at ${width}`) })
      if (id === 'bsit') await page.waitForFunction(() => [...document.querySelectorAll('.chapter-cubes .cube')].some(cube => getComputedStyle(cube).transform.startsWith('matrix3d'))).catch(() => { throw new Error(`Cubes did not animate at ${width}`) })
      if (id === 'blis') await page.waitForFunction(() => document.querySelectorAll('.chapter-wall img').length > 0 && [...document.querySelectorAll('.chapter-wall img')].every(img => img.complete && img.naturalWidth))
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${id} fits ${width}`)
      await page.screenshot({ path: `output/playwright/journey-${id}-${width}.png`, animations: 'disabled' })
    }
  }

  await page.setViewportSize({ width: 1440, height: 600 })
  await page.goto(base)
  await page.waitForFunction(() => document.querySelector('#home')?.dataset.pinned === 'false').catch(() => { throw new Error('Short viewport did not release intro') })
  check(await page.locator('.deck-jumpnav a').count() === 4, 'Short viewports retain all four program links')

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.route('**/models/robot-expressive.glb', route => route.abort())
  await page.goto(base + '#program-bsdmia')
  await page.reload()
  await jump('program-bsdmia')
  await page.waitForFunction(() => document.querySelector('.chapter-model')?.dataset.modelState === 'failed').catch(() => { throw new Error('Failed GLB did not use poster') })
  check(await page.locator('.model-poster').evaluate(img => img.complete && img.naturalWidth > 0), 'Failed model uses its loaded local poster')
  await page.unroute('**/models/robot-expressive.glb')

  // Canvas failure must leave the academic content and poster usable.
  await page.addInitScript(() => {
    if (sessionStorage.getItem('qa-no-webgl') !== '1') return
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return /webgl/i.test(type) ? null : getContext.call(this, type, ...args)
    }
  })
  await page.evaluate(() => sessionStorage.setItem('qa-no-webgl', '1'))
  await page.goto(base + '#program-bsdmia')
  await page.reload()
  await jump('program-bsdmia')
  await page.waitForFunction(() => document.querySelector('.chapter-model')?.dataset.modelState === 'failed').catch(() => { throw new Error('Unavailable WebGL did not use poster') })
  check(await page.locator('.model-poster').evaluate(img => img.complete && img.naturalWidth > 0), 'Unavailable WebGL uses its loaded local poster')
  check(await page.locator('#program-bsdmia .inline-program-content').isVisible(), 'Program information survives unavailable WebGL')
  await page.evaluate(() => sessionStorage.removeItem('qa-no-webgl'))

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(base + '#program-blis')
  await page.waitForFunction(() => document.querySelector('#home')?.dataset.pinned === 'false').catch(() => { throw new Error('Reduced motion did not release intro') })
  check(await page.locator('.chapter-wall [data-tile-id]').count() === 0, 'Reduced motion uses a static library wall')
  check(await page.locator('.chapter-glitch canvas, .dmia-viewer, .chapter-cubes .cube').count() === 0, 'Reduced motion has no running hero effects')
  await jump('program-bsdmia')
  check(await page.locator('.model-poster').evaluate(img => img.complete && img.naturalWidth > 0), 'Reduced motion retains the robot poster')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(base)
  await page.reload()
  if (failures.length) throw new Error(failures.join('\n'))
  return { screenshots: 20, viewports: [1440, 768, 390, 320], shortViewport: true, failedModel: true, unavailableWebGL: true, reducedMotion: true, failures }
}
