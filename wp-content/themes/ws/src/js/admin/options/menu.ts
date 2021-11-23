import { SVG } from '@ws/types'
import { checkParents, handleAjax } from '@ws/utils'

declare const wp: any
declare const wpNavMenu: any

function init() {
  const headingDiv = document.querySelector<HTMLElement>('#headingdiv')
  const searchDiv = document.querySelector<HTMLElement>('#searchdiv')
  const columnDiv = document.querySelector<HTMLElement>('#columndiv')
  if (headingDiv) {
    addHeadingMenuListeners(headingDiv)
  }
  if (searchDiv) {
    addSearchMenuListeners(searchDiv)
  }
  if (columnDiv) {
    addColumnMenuListeners(columnDiv)
  }
  document.addEventListener('click', e => {
    const addImageButton = checkParents(<HTMLElement>e.target, '.add-menu-image')
    const removeImageButton = checkParents(<HTMLElement>e.target, '.remove-menu-image')
    const addIconMenu = checkParents(<HTMLElement>e.target, '.svg-select')
    const addIconButton = checkParents(<HTMLElement>e.target, '.add-menu-icon')
    const addIconMenuButton = checkParents(<HTMLElement>e.target, '.svg-select button')
    if (addImageButton) {
      e.preventDefault()
      addMenuImage(addImageButton)
    }
    if (removeImageButton) {
      e.preventDefault()
      removeMenuImage(removeImageButton)
    }
    if (!addIconMenu) {
      hideIconMenu()
    }
    if (addIconButton) {
      e.preventDefault()
      const menu = document.querySelector<HTMLElement>(`#${addIconButton.getAttribute('aria-controls')}`)
      if (menu) {
        showIconMenu(menu)
      }
    }
    if (addIconMenuButton) {
      e.preventDefault()
      hideIconMenu()
      addMenuIcon(addIconMenuButton)
    }
  })
}

function addMenuImage(addImageButton: HTMLElement) {
  const frame = wp.media({ multiple: false })
  frame.on('select', function() {
    const imageContainer = addImageButton.parentElement?.querySelector<HTMLElement>('.menu-image-container')
    const imageIdInput = addImageButton.parentElement?.querySelector<HTMLInputElement>('input[type=hidden]')
    const removeImageButton = addImageButton.parentElement?.querySelector<HTMLElement>('.remove-menu-image')
    const attachment = frame.state().get('selection').first().toJSON()
    if (!imageContainer || !imageIdInput || !removeImageButton || attachment) {
      return
    }
    imageContainer.innerHTML = `<img src="${attachment.sizes.small.url || attachment.url}" alt="${attachment.alt}" />`
    imageIdInput.value = attachment.id
    addImageButton.classList.add('hidden')
    removeImageButton.classList.remove('hidden')
    frame.remove()
  })
  frame.open()
}

function removeMenuImage(removeImageButton: HTMLElement) {
  const imageContainer = removeImageButton.parentElement?.querySelector<HTMLElement>('.menu-image-container')
  const imageIdInput = removeImageButton.parentElement?.querySelector<HTMLInputElement>('input[type=hidden]')
  const addImageButton = removeImageButton.parentElement?.querySelector<HTMLElement>('.add-menu-image')
  if (!imageContainer || !imageIdInput || !addImageButton) {
    return
  }
  imageContainer.innerHTML = ''
  imageIdInput.value = ''
  addImageButton.classList.remove('hidden')
  removeImageButton.classList.add('hidden')
}

function addMenuIcon(addIconMenuButton: HTMLElement) {
  const menu = addIconMenuButton.parentElement
  const button = document.querySelector<HTMLElement>(`#${menu?.getAttribute('aria-labelledby')}`)
  const value = addIconMenuButton.getAttribute('data-value')
  if (!menu || !button || !value) {
    return
  }
  (<HTMLInputElement>button.nextElementSibling).value = value
  button.innerHTML = value ? addIconMenuButton.innerHTML : 'Select Icon'
  menu.classList.remove('show')
}

function showIconMenu(menu: HTMLElement) {
  handleAjax(
    '/wp-json/ws/svgs/',
    (svgs: SVG[]) => {
      let output = `
        <button data-value="">
          <svg viewBox="0 0 24 24" fill-rule="evenodd">
            <text x="6" y="10" style="font: 10px sans-serif">No</text>
            <text x="3" y="21" style="font: 10px sans-serif">Icon</text>
          </svg>
        </button>
      `
      svgs.forEach(svg => {
        output += `
          <button data-value="${svg.id}" title="${svg.id}">
            <svg viewBox="${svg.viewbox}">
              ${svg.path}
            </svg>
          </button>
        `
      })
      menu.innerHTML = output
    },
    (err: string) => {
      console.error(err)
    }
  )
  menu.classList.add('show')
}

function hideIconMenu() {
  document.querySelectorAll('.svg-select').forEach(menu => menu.classList.remove('show'))
}

function addHeadingMenuListeners(headingDiv: HTMLElement) {
  const input = headingDiv.querySelector<HTMLInputElement>('#heading-menu-item-name')
  const submit = headingDiv.querySelector<HTMLElement>('#add-heading-menu-item')
  if (!input || !submit) {
    return
  }
  input.addEventListener('keypress', (e: KeyboardEvent) => {
    headingDiv.classList.remove('form-invalid')
    if (e.keyCode === 13) {
      e.preventDefault()
      submit.click()
    }
  })
  submit.addEventListener('click', () => {
    const url = '#custom_heading'
    if (input.value === '') {
      headingDiv.classList.add('form-invalid')
      return false
    }
    headingDiv.querySelector<HTMLElement>('.spinner')?.classList.add('is-active')
    wpNavMenu.addLinkToMenu(url,
      input.value,
      wpNavMenu.addMenuItemToBottom,
      function() {
        headingDiv.querySelector<HTMLElement>('.spinner')?.classList.remove('is-active')
        input.value = ''
        input.blur()
      }
    )
  })
}

function addSearchMenuListeners(searchDiv: HTMLElement) {
  const submit = searchDiv.querySelector<HTMLElement>('#add-search-menu-item')
  submit?.addEventListener('click', () => {
    const url = '#custom_search'
    searchDiv.querySelector<HTMLElement>('.spinner')?.classList.add('is-active')
    wpNavMenu.addLinkToMenu(
      url,
      'Search',
      wpNavMenu.addMenuItemToBottom,
      function() {
        searchDiv.querySelector('.spinner')?.classList.remove('is-active')
      }
    )
  })
}

function addColumnMenuListeners(columnDiv: HTMLElement) {
  const submit = columnDiv.querySelector<HTMLElement>('#add-column-menu-item')
  submit?.addEventListener('click', () => {
    const url = '#custom_column'
    columnDiv.querySelector<HTMLElement>('.spinner')?.classList.add('is-active')
    wpNavMenu.addLinkToMenu(
      url,
      'Column',
      wpNavMenu.addMenuItemToBottom,
      function() {
        columnDiv.querySelector<HTMLElement>('.spinner')?.classList.remove('is-active')
      }
    )
  })
}

export { init }
