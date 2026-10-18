async function checkProgramWheels(page) {
  const assert = (ok, message) => { if (!ok) throw new Error(message) }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.reload()
    await page.locator('.chapter-runway').first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    for (const id of ['bscs', 'bsit', 'bsdmia', 'blis']) {
      const hero = page.locator(`.chapter-${id}`)
      const bounds = await hero.evaluate(el => {
        const runway = el.parentElement
        return { start: scrollY + runway.getBoundingClientRect().top, distance: runway.offsetHeight - innerHeight, height: el.offsetHeight }
      })
      assert(bounds.height === 900, `${id}: full viewport at ${width}`)
      for (const progress of [0.1, 0.65, 0.9, 0.1]) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), bounds.start + bounds.distance * progress)
        const expected = Math.round(Math.min(progress / (id === 'bsdmia' ? 0.55 : 1), 1) * 3)
        await page.waitForFunction(({ id, expected }) => {
          const buttons = [...document.querySelectorAll(`.chapter-${id} .program-wheel-options button`)]
          return buttons.findIndex(b => b.getAttribute('aria-pressed') === 'true') === expected
        }, { id, expected })
        assert(Math.abs(await hero.evaluate(el => el.getBoundingClientRect().top)) < 2, `${id}: remains sticky`)
      }
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}`)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.locator('.chapter-runway.is-paused').first().waitFor()
  const hero = page.locator('.chapter-bsdmia')
  await hero.getByRole('button', { name: 'Where you’ll go' }).click()
  assert(await hero.getByRole('button', { name: 'Where you’ll go' }).getAttribute('aria-pressed') === 'true', 'Reduced motion options work')
  assert(await hero.evaluate(el => getComputedStyle(el).position) === 'relative', 'Reduced motion removes sticky scroll')
  return 'PASS: four full-screen heroes, forward/reverse wheel progress, sticky desktop/mobile, no overflow, reduced motion controls'
}
