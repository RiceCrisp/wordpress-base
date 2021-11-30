/* Custom lazy load logic for images, videos, and iframes. Images should rely on "loading" attribute instead though. */

import { isTag, onScreen } from '@ws/utils'

function init() {
  lazyEvent()
  window.addEventListener('load', () => {
    lazyEvent()
  })
  window.removeEventListener('throttleScroll', lazyEvent, false)
  window.addEventListener('throttleScroll', lazyEvent, false)
  window.removeEventListener('resize', lazyEvent, false)
  window.addEventListener('resize', lazyEvent, false)
}

function lazyEvent() {
  document.querySelectorAll<HTMLElement>('.lazy-load').forEach(el => {
    if (onScreen(el, '-250px')) {
      if (isTag(el, 'img')) {
        if (el.hasAttribute('data-sizes')) {
          el.sizes = el.getAttribute('data-sizes') || ''
        }
        if (el.hasAttribute('data-srcset')) {
          el.srcset = el.getAttribute('data-srcset') || ''
        }
        if (el.hasAttribute('data-src')) {
          el.src = el.getAttribute('data-src') || ''
        }
      }
      else if (isTag(el, 'video')) {
        const node = document.createElement('SOURCE')
        node.setAttribute('type', 'video/mp4')
        node.setAttribute('src', el.getAttribute('data-src') || '')
        el.appendChild(node)
        el.load()
      }
      else if (isTag(el, 'iframe')) {
        el.src = el.getAttribute('data-src') || ''
      }
      else {
        if (el.hasAttribute('data-src')) {
          el.style.backgroundImage = `url(${el.getAttribute('data-src')})`
        }
      }
      el.classList.remove('lazy-load')
    }
  })
}

export { init, lazyEvent }
