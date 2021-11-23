import { CountUp } from 'countup.js'
import { onScreen } from '@ws/utils'

counterEvent()
window.addEventListener('load', () => {
  counterEvent()
})
window.removeEventListener('throttleScroll', counterEvent, false)
window.addEventListener('throttleScroll', counterEvent, false)

function counterEvent() {
  const counts = document.querySelectorAll<HTMLElement>('.count[data-count]')
  for (let i = 0; i < counts.length; i++) {
    const count = counts[i]
    if (onScreen(count, '50%')) {
      count.classList.remove('count')
      const dataCount = count.getAttribute('data-count')
      const matches = dataCount?.match(/[0-9,.]+/g)
      if (dataCount && matches) {
        const numberString = matches[0]
        const parts = dataCount?.split(numberString)
        const decimalPlaces = numberString.indexOf('.') !== -1 ? numberString.substring(numberString.indexOf('.') + 1).length : 0
        const countUp = new CountUp(count, Number(numberString), {
          duration: 2.5,
          decimalPlaces: decimalPlaces,
          prefix: parts[0],
          suffix: parts[1]
        })
        countUp.start()
      }
    }
  }
}
