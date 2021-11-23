import { getTransitionEvent } from '@ws/utils'

const accordions = document.querySelectorAll<HTMLElement>('.accordion-button')
for (let i = 0; i < accordions.length; i++) {
  const accordion = accordions[i]
  const target = document.querySelector<HTMLElement>(`#${accordion.getAttribute('aria-controls')}`)
  if (!target) {
    continue
  }
  accordion.addEventListener('click', function(this: HTMLElement, e: Event) {
    e.preventDefault()
    if (this.classList.contains('animating')) {
      return
    }
    if (this.classList.contains('closed')) {
      openAccordion(this, target)
    }
    else {
      closeAccordion(this, target)
    }
  })
}

function openAccordion(button: HTMLElement, target: HTMLElement) {
  const transitionEvent = getTransitionEvent()
  if (!transitionEvent) {
    return
  }
  button.classList.add('animating')
  target.style.height = '0px'
  target.classList.remove('closed')
  target.classList.add('open')
  target.removeAttribute('hidden')
  button.classList.remove('closed')
  button.classList.add('open')
  target.style.height = `${target.scrollHeight}px`
  target.addEventListener(transitionEvent, function autoHeight1() {
    button.setAttribute('aria-expanded', 'true')
    target.removeEventListener(transitionEvent, autoHeight1)
    button.classList.remove('animating')
  })
}

function closeAccordion(button: HTMLElement, target: HTMLElement) {
  const transitionEvent = getTransitionEvent()
  if (!transitionEvent) {
    return
  }
  button.classList.add('animating')
  target.style.height = '0px'
  target.classList.remove('open')
  target.classList.add('closed')
  button.classList.remove('open')
  button.classList.add('closed')
  target.addEventListener(transitionEvent, function autoHeight2() {
    button.setAttribute('aria-expanded', 'false')
    target.setAttribute('hidden', 'hidden')
    target.removeEventListener(transitionEvent, autoHeight2)
    button.classList.remove('animating')
  })
}
