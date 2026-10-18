async function checkScrollInteractions(page, base = new URL('/#/', page.url()).href) {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const check = (value, message) => { if (!value) throw new Error(message) }
  const scroll = async top => {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top)
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  }
  const style = selector => page.locator(selector).first().evaluate(el => ({
    opacity: Number(getComputedStyle(el).opacity),
    translate: getComputedStyle(el).translate,
  }))

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(base)
  await page.evaluate(() => localStorage.removeItem('ccs-motion-paused'))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  await page.waitForFunction(() => document.querySelector('#home')?.dataset.pinned === 'true')
  await page.evaluate(() => document.fonts.ready)
  check(await page.locator('.hero-word svg, .deck-card .program-art').count() === 0, 'Hero decoration is removed')
  for (const [position, count] of [[0, 4], [510, 3], [1010, 2], [1510, 1], [2000, 0], [1010, 2], [0, 4]]) {
    await scroll(position)
    await page.waitForFunction(count => Number(document.querySelector('.deck-stage').dataset.cardsRemaining) === count, count)
    check(await page.locator('.deck-card:not([inert])').count() === (count ? 1 : 0), 'Only the front card is interactive')
  }
  const selector = '.purpose-grid > article'
  await page.waitForFunction(selector => document.querySelector(selector)?.style.opacity === '0.2', selector)
  const top = await page.locator(selector).first().evaluate(el => el.getBoundingClientRect().top + scrollY)
  await scroll(top - 1000)
  const start = await style(selector)
  await scroll(top - 800)
  const middle = await style(selector)
  await scroll(top - 500)
  const end = await style(selector)
  check(start.opacity < middle.opacity && middle.opacity < end.opacity && end.opacity === 1, 'Section reveals follow scroll progress')
  await scroll(top - 1000)
  check((await style(selector)).opacity < middle.opacity, 'Scrolling backward reverses the reveal')

  const imageTop = await page.locator('.news-image').first().evaluate(el => el.getBoundingClientRect().top + scrollY)
  await scroll(imageTop - 800)
  const imageStart = await style('.news-image img')
  await scroll(imageTop - 300)
  check((await style('.news-image img')).translate !== imageStart.translate, 'Images move with scroll')

  await page.locator('#faculty').evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
  await page.getByRole('searchbox', { name: 'Search faculty by name or role' }).fill('Gleason')
  check(await page.locator('.faculty-card').count() > 0, 'Faculty filtering still works')
  await page.waitForFunction(() => [...document.querySelectorAll('.faculty-card')].every(el => el.style.translate))
  await page.locator('.faculty-card').first().focus()
  check(await page.locator('.faculty-card').first().evaluate(el => !el.style.translate && !el.style.opacity), 'Keyboard focus reveals content immediately')
  await page.getByRole('searchbox', { name: 'Search faculty by name or role' }).fill('')

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 })
    await scroll(0)
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Page fits width ${width}`)
    check(await page.locator('.hero-copy').evaluate(el => el.scrollWidth <= el.clientWidth + 1), `Headline fits width ${width}`)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await scroll(0)
  await page.waitForFunction(() => document.querySelector('#home').dataset.pinned === 'false')
  const stageTop = await page.locator('.deck-stage').evaluate(el => el.getBoundingClientRect().top + scrollY)
  await scroll(stageTop - 844 * 0.38 + (250 + 844 * 0.38) * 0.5)
  await page.waitForFunction(() => document.querySelector('.deck-stage').dataset.cardsRemaining === '2')
  await scroll(0)
  await page.waitForFunction(() => document.querySelector('.deck-stage').dataset.cardsRemaining === '4')
  await page.screenshot({ path: 'output/playwright/scroll-hero-mobile.png' })

  await scroll(await page.evaluate(() => document.documentElement.scrollHeight))
  check((await style('.footer-bottom')).opacity === 1, 'Footer finishes revealing at the end of the page')
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click()
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-paused'))
  check(await page.locator('.purpose-grid article').first().evaluate(el => !el.style.opacity && !el.style.translate), 'Pausing restores visible static content')
  check(await page.locator('#home').getAttribute('data-pinned') === 'false', 'Pausing releases the hero')
  await page.reload()
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-paused'))
  check(await page.locator('.purpose-grid article').first().evaluate(el => !el.style.opacity), 'Pause persists after reload')
  await page.evaluate(() => localStorage.removeItem('ccs-motion-paused'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await page.waitForFunction(() => !!document.querySelector('.purpose-grid article'))
  check(await page.locator('.purpose-grid article').first().evaluate(el => !el.style.opacity), 'System reduced motion leaves content visible')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.reload()
  await scroll(0)
  await page.waitForFunction(() => document.querySelector('.deck-stage')?.dataset.cardsRemaining === '4')
  await page.screenshot({ path: 'output/playwright/scroll-hero-desktop.png' })
  check(!errors.length, errors.join('\n'))
  return { reversibleReveals: true, imageParallax: true, keyboard: true, responsiveWidths: [320, 390, 768, 1440], mobileStack: true, pauseAndReducedMotion: true, browserErrors: errors }
}

async function checkDmiaOrbit(page, base = new URL('/#/', page.url()).href) {
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const check = (value, message) => { if (!value) throw new Error(message) }
  await page.goto(base)
  await page.evaluate(() => localStorage.removeItem('ccs-motion-paused'))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  await page.locator('.chapter-model').waitFor()
  await page.evaluate(() => document.fonts.ready)

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 })
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    await page.locator('.chapter-model').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }))
    await page.waitForFunction(() => document.querySelector('.chapter-model')?.dataset.modelState === 'loaded').catch(() => { throw new Error(`Model did not load at width ${width}`) })
    const range = await page.locator('.dmia-viewer canvas').evaluate(canvas => {
      let instance = canvas.__vueParentComponent
      while (instance.type.__name !== 'ProgramHero') instance = instance.parent
      const trigger = instance.setupState.orbitTween.scrollTrigger
      return { start: trigger.start, end: trigger.end }
    })
    const poses = []
    for (const progress of [0.25, 0.5, 0.75, 0.5, 0.25]) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), range.start + (range.end - range.start) * progress)
      const turn = (0.5 - Math.cos(Math.PI * progress) / 2) * Math.PI * 2
      await page.waitForFunction(yaw => {
        const context = document.querySelector('.dmia-viewer canvas')?.__vueParentComponent.provides.useTres
        const model = context?.scene.value.children.filter(object => object.type === 'Group').at(-1)
        return model && Math.abs(model.rotation.y - yaw) < 0.015
      }, turn - Math.PI - Math.PI / 9).catch(() => { throw new Error(`Orbit did not settle at progress ${progress}, width ${width}`) })
      const pose = await page.locator('.dmia-viewer canvas').evaluate(canvas => {
        const context = canvas.__vueParentComponent.provides.useTres
        const model = context.scene.value.children.filter(object => object.type === 'Group').at(-1)
        return { rotation: model.rotation.toArray(), camera: context.camera.value.position.length() }
      })
      check(pose.camera > 1.2, 'Updating the angle preserves the fitted camera')
      check(Math.abs(pose.rotation[0] - (Math.PI / 22.5 + Math.sin(turn) * 0.16)) < 0.015, 'The orbit changes pitch as well as yaw')
      poses.push(pose)
      if (progress === 0.5) await page.screenshot({ path: `output/playwright/dmia-orbit-${width}.png` })
    }
    check(poses[2].rotation[1] - poses[0].rotation[1] > 4, 'Scroll explores different sides of the actual 3D model')
    check(Math.abs(poses[0].rotation[1] - poses[4].rotation[1]) < 0.03, 'Reverse scrolling returns to the same angle')
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'The orbit fits the viewport')
  }

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.locator('.chapter-model').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }))
  const canvas = await page.locator('.dmia-viewer canvas').boundingBox()
  await page.mouse.move(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2)
  const before = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 150)
  await page.waitForFunction(before => scrollY > before, before).catch(() => { throw new Error('Wheel over the model did not scroll the page') })
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click()
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-paused')).catch(() => { throw new Error('Pause motion did not stop the orbit') })
  check(await page.locator('.dmia-viewer canvas').count() === 0, 'Pause motion stops the model orbit')
  check(await page.locator('.model-poster').evaluate(img => img.complete && img.naturalWidth > 0), 'Pause motion keeps the poster')
  await page.evaluate(() => localStorage.removeItem('ccs-motion-paused'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await page.locator('.chapter-model').waitFor()
  check(await page.locator('.dmia-viewer canvas').count() === 0, 'System reduced motion disables the orbit')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(base + '#program-bsdmia')
  await page.reload()
  await page.locator('.chapter-model').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }))
  await page.waitForFunction(() => document.querySelector('.chapter-model')?.dataset.modelState === 'loaded').catch(() => { throw new Error('Orbit did not load after restoring motion') })
  check(!errors.length, errors.join('\n'))
  return { actual3dRotation: true, easedOrbitAndTilt: true, reverseScroll: true, fittedCamera: true, desktopAndMobile: true, wheelScroll: true, reducedMotion: true, browserErrors: errors }
}
