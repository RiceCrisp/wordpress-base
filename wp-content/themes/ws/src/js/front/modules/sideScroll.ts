function init() {
  document.querySelectorAll<HTMLElement>('.side-scroll').forEach(container => {
    createControls(container)
  })
}

function createControls(container: HTMLElement) {
  const prevIcon = '<svg viewBox="0 0 25 25"><path d="M18.91,24.46a1.81,1.81,0,0,1-2.55,0h0L6.2,14a2.22,2.22,0,0,1,0-3.08L16.32.56a1.79,1.79,0,0,1,2.54,0h0a1.91,1.91,0,0,1,0,2.65l-9,9.3,9,9.3A1.91,1.91,0,0,1,18.91,24.46Z" /></svg>'
  const nextIcon = '<svg viewBox="0 0 25 25"><path d="M6.09.56a1.8,1.8,0,0,1,2.55,0h0L18.8,11a2.22,2.22,0,0,1,0,3.08L8.68,24.46a1.8,1.8,0,0,1-2.54,0h0a1.91,1.91,0,0,1,0-2.65l9-9.3-9-9.3A1.91,1.91,0,0,1,6.09.56Z" /></svg>'
  const controls = document.createElement('div')
  controls.classList.add('side-scroll-controls')
  controls.innerHTML = `<button class="prev-button" disabled aria-label="Previous">${prevIcon}</button><button class="next-button" aria-label="Next">${nextIcon}</button>`
  container.insertAdjacentElement('afterend', controls)
  addSliderRowListeners(container, controls)
}

function addSliderRowListeners(container: HTMLElement, controls: HTMLElement) {
  const prevButton = controls.querySelector('.prev-button')
  const nextButton = controls.querySelector('.next-button')
  if (!prevButton || !nextButton) {
    return
  }
  prevButton.addEventListener('click', e => {
    e.preventDefault()
    const width = (<HTMLElement>container.children[0]).offsetWidth
    container.scrollLeft -= width
  })
  nextButton.addEventListener('click', e => {
    e.preventDefault()
    const width = (<HTMLElement>container.children[0]).offsetWidth
    container.scrollLeft += width
  })
  container.addEventListener('scroll', function() {
    const left = this.scrollLeft === 0
    const pseudoWidthStr = window.getComputedStyle(container, ':after').width
    const pseudoWidth = Number(pseudoWidthStr.substr(0, pseudoWidthStr.length - 2))
    const right = this.scrollWidth - this.offsetWidth - this.scrollLeft - pseudoWidth < 2
    if (left) {
      prevButton.setAttribute('disabled', '')
    }
    else {
      prevButton.removeAttribute('disabled')
    }
    if (right) {
      nextButton.setAttribute('disabled', '')
    }
    else {
      nextButton.removeAttribute('disabled')
    }
    if (left && right) {
      container.classList.add('no-scroll')
    }
  })
  function checkWidth() {
    const left = container.scrollLeft === 0
    const right = Math.abs(container.scrollWidth - container.offsetWidth - container.scrollLeft) < 2
    if (left && right) {
      controls.classList.add('no-controls')
    }
    else {
      controls.classList.remove('no-controls')
    }
  }
  window.addEventListener('resize', checkWidth)
  checkWidth()
}

export { init }
