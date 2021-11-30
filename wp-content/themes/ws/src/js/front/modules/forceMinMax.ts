/* Forces number inputs with mins/maxs to actually enforce those mins/maxs (mostly keyboard). */

function init() {
  document.querySelectorAll('input[type=number]').forEach(el => {
    if (el.hasAttribute('min') || el.hasAttribute('max')) {
      el.addEventListener('input', minMaxCallback)
      el.addEventListener('keypress', minMaxCallback)
    }
  })
}

function minMaxCallback(this: HTMLInputElement) {
  if (this.value !== undefined) {
    const value = Number(this.value)
    if (this.getAttribute('max') && value > Number(this.getAttribute('max'))) {
      this.value = this.getAttribute('max') || ''
    }
    else if (this.getAttribute('min') && value < Number(this.getAttribute('min'))) {
      this.value = this.getAttribute('min') || ''
    }
  }
}

export { init }
