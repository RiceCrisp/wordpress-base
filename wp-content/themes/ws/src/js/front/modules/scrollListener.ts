/* Performant scroll listener. Would recommend adding this listener instead of just "scroll". */

function init() {
  let ticking = false
  const scrollEvent = document.createEvent('Event')
  scrollEvent.initEvent('throttleScroll', true, true)
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        window.dispatchEvent(scrollEvent)
        ticking = false
      })
      ticking = true
    }
  })
}

export { init }
