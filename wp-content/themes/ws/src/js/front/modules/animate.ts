import { checkParents, onScreen } from '@ws/utils'

function init() {
  animateEvent()
  window.addEventListener('load', () => {
    animateEvent()
  })
  window.removeEventListener('throttleScroll', animateEvent, false)
  window.addEventListener('throttleScroll', animateEvent, false)
}

function animateEvent() {
  elementEvent()
  // Creates waterfall effect over several elements
  document.querySelectorAll<HTMLElement>('.animate-group').forEach(el => {
    if (onScreen(el, '100px') || onScreen(el, '100%')) {
      el.classList.add('animating')
      el.classList.remove('animate-group')
      el.querySelectorAll('.animate').forEach((child, i, children) => {
        setTimeout(() => {
          child.classList.add('animation-done')
          child.classList.remove('animate')
          if (i >= children.length - 1) {
            el.classList.remove('animating')
          }
        }, i * 100)
      })
    }
  })
}

function elementEvent() {
  document.querySelectorAll<HTMLElement>('.animate').forEach(el => {
    // Already animating
    if (checkParents(el, '.animate-group, .animating')) {
      return // eslint-disable-line no-useless-return
    }
    // Animate when completely in window
    else if (el.classList.contains('animate-100')) {
      if (onScreen(el, '100%')) {
        el.classList.add('animation-done')
        el.classList.remove('animate')
      }
    }
    // Animate when 100px into window
    else {
      if (onScreen(el, '100px')) {
        el.classList.add('animation-done')
        el.classList.remove('animate')
      }
    }
  })
}

export { init, animateEvent }
