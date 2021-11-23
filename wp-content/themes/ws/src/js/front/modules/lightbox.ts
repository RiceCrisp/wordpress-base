import {
  checkParents,
  getTransitionEvent,
  keyCodes,
  releaseFocus,
  trapFocus
} from '@ws/utils'
import { lazyEvent } from './lazy'

function init() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const button = checkParents(target, '.lightbox-button')
    if (button) {
      e.preventDefault()
      openLightbox(button)
    }
  })
}

function handleFocus(e: FocusEvent) {
  e.preventDefault()
  const target = e.target as HTMLElement
  target.focus({ preventScroll: true })
  const relatedTarget = e.relatedTarget as HTMLElement | null
  if (relatedTarget) {
    relatedTarget.focus()
  }
  else {
    document.querySelector<HTMLElement>('.lightbox-close')?.focus()
  }
}

function openLightbox(button: HTMLElement) {
  const lightbox = document.querySelector<HTMLElement>(`#${button.getAttribute('aria-controls')}`)
  const closeButton = lightbox?.querySelector<HTMLElement>('.lightbox-close')
  if (!lightbox || !closeButton) {
    return
  }
  document.body.appendChild(lightbox)
  setTimeout(() => {
    trapFocus(lightbox, handleFocus)
    document.body.classList.add('no-scroll')
    lightbox.classList.add('show')
    closeButton.focus()
    lazyEvent()
    document.addEventListener('keyup', function handleEsc(e: KeyboardEvent) {
      if (e.keyCode === keyCodes.ESCAPE) {
        document.removeEventListener('keyup', handleEsc)
        closeLightbox(lightbox, button)
      }
    })
    closeButton.addEventListener('click', function handleClose() {
      this.removeEventListener('click', handleClose)
      closeLightbox(lightbox, button)
    })
  }, 0)
}

function closeLightbox(lightbox: HTMLElement, button: HTMLElement) {
  const transitionEvent = getTransitionEvent()
  // Remove trapFocus listeners
  releaseFocus(lightbox, handleFocus)
  lightbox.classList.remove('show')
  if (transitionEvent) {
    lightbox.addEventListener(transitionEvent, function handleTransition() {
      lightbox.removeEventListener(transitionEvent, handleTransition)
      document.body.classList.remove('no-scroll')
      document.body.removeChild(lightbox)
      document.body.appendChild(lightbox)
      try {
        button.focus()
      }
      catch (err) {
        console.error(err)
      }
    })
  }
}

export { init, openLightbox, closeLightbox }
