async function checkMotion(page, base = new URL('/#/', page.url()).href) {
  page.setDefaultTimeout(15000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const jump = async (selector) => {
    await page.locator(selector).first().evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
  }
  const changes = async (selector, property, attribute = false) => {
    const before = await page.locator(selector).first().evaluate((el, { property, attribute }) =>
      attribute ? el.getAttribute(property) : getComputedStyle(el)[property], { property, attribute })
    await page.waitForFunction(({ selector, property, attribute, before }) => {
      const el = document.querySelector(selector)
      return el && (attribute ? el.getAttribute(property) : getComputedStyle(el)[property]) !== before
    }, { selector, property, attribute, before })
  }
  const paused = () => page.waitForFunction(() => document.documentElement.classList.contains('motion-paused'))
  const enabled = () => page.waitForFunction(() => !document.documentElement.classList.contains('motion-paused'))

  await page.goto(base)
  await page.evaluate(() => localStorage.removeItem('ccs-motion-paused'))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  await enabled()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await paused()
  if (await page.evaluate(() => localStorage.getItem('ccs-motion-paused')) !== null) {
    throw new Error('A system preference change must not save a manual override')
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await enabled()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await paused()
  await page.getByRole('button', { name: 'Enable motion', exact: true }).click()
  await enabled()
  await page.reload()
  await enabled()
  if (await page.evaluate(() => localStorage.getItem('ccs-motion-paused')) !== 'false') {
    throw new Error('Enable motion must survive reloading with system reduced motion enabled')
  }
  await page.locator('#home').waitFor()

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    if (viewport.width === 1440) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await page.waitForFunction(() => document.querySelector('#home')?.dataset.pinned === 'true')
      await page.evaluate(() => window.scrollTo({ top: 510, behavior: 'instant' }))
      await page.waitForFunction(() => document.querySelector('.deck-stage').dataset.cardsRemaining === '3')
    }
    await jump('#program-bscs')
    await page.locator('.chapter-glitch canvas').waitFor()
    await jump('#program-bsit')
    await page.locator('.chapter-cubes .cube').first().waitFor()
    await changes('.chapter-cubes .cube', 'transform')
    await jump('#program-bsdmia')
    await page.waitForFunction(() => document.querySelector('.chapter-model').dataset.modelState === 'loaded')
    await jump('#program-blis')
    await page.locator('.chapter-wall [data-tile-id]').first().waitFor()
    await changes('.chapter-wall .flex.flex-col.will-change-transform', 'transform')
    await jump('.college-story')
    await page.locator('.scroll-reveal-word').first().waitFor()
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.scroll-reveal-word')).opacity) > 0.9)
    await jump('.campus-expand-section')
    await page.waitForFunction(() => !!document.querySelector('.campus-expand-section .sticky')?.style.height)
    const clipBefore = await page.locator('.campus-expand-section [class*="will-change-[clip-path]"]').evaluate(el => el.style.clipPath)
    await page.evaluate(() => window.scrollBy({ top: innerHeight * 0.45, behavior: 'instant' }))
    await page.waitForFunction(before => document.querySelector('.campus-expand-section [class*="will-change-[clip-path]"]').style.clipPath !== before, clipBefore)
    await jump('.community-section')
    await changes('.community-section .will-change-transform', 'transform')
    await jump('.text-ribbon')
    await changes('.text-ribbon textPath', 'startOffset', true)
  }

  await page.getByRole('button', { name: 'Pause motion', exact: true }).click()
  await paused()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  await paused()
  const offset = await page.locator('.text-ribbon textPath').first().getAttribute('startOffset')
  if (Number(offset) !== 0) throw new Error('Pause motion must stop the text ribbon')
  await jump('#program-blis')
  await page.locator('.chapter-wall .wall-still').waitFor()
  if (await page.locator('.chapter-glitch canvas, .chapter-cubes .cube, .dmia-viewer, .scroll-reveal-word').count()) {
    throw new Error('Pause motion must stop the program and scroll effects')
  }
  if (errors.length) throw new Error(errors.join('\n'))
  await page.evaluate(() => localStorage.removeItem('ccs-motion-paused'))
  await page.reload()
  return { systemDefault: true, enableOverride: true, persistedPause: true, desktopAndMobile: true, browserErrors: errors }
}
