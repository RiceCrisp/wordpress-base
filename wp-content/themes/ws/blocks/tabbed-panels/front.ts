import { keyCodes, uniqid } from '@ws/utils'
import { lazyEvent } from '@ws/modules/lazy'

document.querySelectorAll<HTMLElement>('.front-end .wp-block-ws-tabbed-panels').forEach(tp => {
  initTabPanel(tp)
  addTabbedPanelsListener(tp)
  selectTab(tp.querySelector<HTMLElement>('.tab:first-child'), tp, false)
})

function initTabPanel(tp: HTMLElement | null) {
  const panels = tp?.querySelectorAll<HTMLElement>('.panel')
  const tabContainer = tp?.querySelector<HTMLElement>('.tabs')
  if (!tp || !panels || !tabContainer) {
    return
  }
  tabContainer.setAttribute('role', 'tablist')
  const uid = uniqid()
  let tabs = ''
  let tabsMobile = `<label class="screen-reader-text" for="tabs-${uid}">Tabs</label><select id="tabs-${uid}">`
  panels.forEach((panel) => {
    const uid = panel.getAttribute('id')?.slice(6)
    const heading = panel.getAttribute('data-heading')
    // Setup tabs
    tabs += `<button
      id="tab-${uid}"
      class="tab"
      role="tab"
      aria-selected="false"
      aria-controls="panel-${uid}"
      tabindex="-1"
    >${heading}</button>`
    tabsMobile += `<option value="tab-${uid}">${heading}</option>`
    // Setup panel
    panel.setAttribute('role', 'tabpanel')
    panel.setAttribute('aria-labelledby', `tab-${uid}`)
    panel.setAttribute('tabindex', '0')
  })
  tabsMobile += '</select>'
  tabContainer.innerHTML = tabs
  const mobileSelect = document.createElement('div')
  mobileSelect.classList.add('col-xs-12')
  mobileSelect.classList.add('tabs-mobile')
  mobileSelect.innerHTML = tabsMobile
  tabContainer.insertAdjacentElement('afterend', mobileSelect)
}

function addTabbedPanelsListener(tp: HTMLElement | null) {
  if (!tp) {
    return
  }
  const tabs = tp.querySelectorAll<HTMLElement>('.tab')
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      selectTab(tab, tp)
    })
    tab.addEventListener('keydown', e => {
      if (e.keyCode === keyCodes.ARROW_UP || e.keyCode === keyCodes.ARROW_DOWN) {
        e.preventDefault()
      }
    })
    tab.addEventListener('keyup', e => {
      // Desktop keyboard controls
      if (window.innerWidth > 768 && !tp.classList.contains('vertical')) {
        if (e.keyCode === keyCodes.ARROW_LEFT) {
          if (i === 0) {
            selectTab(tabs[tabs.length - 1], tp)
          }
          else {
            selectTab(tabs[i - 1], tp)
          }
        }
        if (e.keyCode === keyCodes.ARROW_RIGHT) {
          if (i === tabs.length - 1) {
            selectTab(tabs[0], tp)
          }
          else {
            selectTab(tabs[i + 1], tp)
          }
        }
      }
      // Mobile keybaord controls
      else {
        if (e.keyCode === keyCodes.ARROW_UP) {
          if (i === 0) {
            selectTab(tabs[tabs.length - 1], tp)
          }
          else {
            selectTab(tabs[i - 1], tp)
          }
        }
        if (e.keyCode === keyCodes.ARROW_DOWN) {
          if (i === tabs.length - 1) {
            selectTab(tabs[0], tp)
          }
          else {
            selectTab(tabs[i + 1], tp)
          }
        }
      }
    })
  })
  const mobileSelect = tp.querySelector<HTMLSelectElement>('.tabs-mobile select')
  mobileSelect?.addEventListener('change', function(e: Event) {
    selectTab(document.querySelector(`#${(<HTMLSelectElement>e.target).value}`), tp)
  })
}

function selectTab(
  tab: HTMLElement | null,
  tp: HTMLElement | null,
  focus = true
) {
  if (!tab || !tp) {
    return
  }
  const tabs = tp.querySelectorAll('.tab')
  const panels = tp.querySelectorAll('.panel')
  // Clear tabs
  tabs.forEach(tab => {
    tab.classList.remove('current')
    tab.setAttribute('aria-selected', 'false')
    tab.setAttribute('tabindex', '-1')
  })
  // Clear panels
  panels.forEach(panel => {
    panel.classList.remove('current')
  })
  // Select tab
  const panel = tp.querySelector<HTMLElement>(`#${tab.getAttribute('aria-controls')}`)
  tab.classList.add('current')
  tab.setAttribute('aria-selected', 'true')
  tab.removeAttribute('tabindex')
  if (focus) { // Prevents the page from scrolling to element when run in init()
    tab.focus()
  }
  panel?.classList.add('current')
  lazyEvent()
}
