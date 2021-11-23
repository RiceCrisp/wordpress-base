import { checkParents, keyCodes, uniqid } from '@ws/utils'

function init() {
  replaceHTML()
  addDocumentListener()
}

function replaceHTML() {
  document.querySelectorAll('select').forEach(el => {
    const id = el.hasAttribute('id') ? el.getAttribute('id') : `${uniqid()}`
    const name = el.hasAttribute('name') ? `name="${el.getAttribute('name')}"` : ''
    const label = document.querySelector(`[for="${id}"]`)
    if (label && !label.hasAttribute('id')) {
      label.setAttribute('id', uniqid())
    }
    let selected = { name: ' ', value: '' }
    const options: { name: string, value: string }[] = []
    el.querySelectorAll('option').forEach(option => {
      const obj = { name: option.text, value: option.value }
      selected = option.selected ? obj : selected
      options.push(obj)
    })
    el.insertAdjacentHTML('afterend',
      `<div class="listbox">
        <button ${id ? `id="listbox-${id}"` : ''} aria-haspopup="listbox" aria-labelledby="${label ? label.id : ''} ${id ? `listbox-${id}` : ''}">${selected.name}</button>
        <ul tabindex="-1" role="listbox" aria-labelledby="${label ? label.id : ''}">
          ${options.map(option => `<li id="${uniqid()}" role="option" data-value="${option.value}" ${option.value === selected.value ? 'class="selected"' : ''}>${option.name}</li>`).join('')}
        </ul>
        <input ${id ? `id="${id}"` : ''} class="hidden-input" ${name} value="${selected.value}" type="hidden" />
      </div>`
    )
    const newSelect = el.parentNode?.querySelector<HTMLElement>('.listbox')
    el.parentNode?.removeChild(el)
    addListboxListeners(newSelect || null)
  })
}

function addListboxListeners(el: HTMLElement | null) {
  if (!el) {
    return
  }
  const button = el.querySelector('button')
  const list = el.querySelector('ul')
  const options = el.querySelectorAll('li')
  if (!button || !list || !options) {
    return
  }
  // If we click button
  button.addEventListener('click', buttonClick)
  button.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.keyCode === keyCodes.ENTER) {
      e.preventDefault()
    }
  })
  button.addEventListener('keyup', e => {
    if (e.keyCode === keyCodes.ENTER) {
      buttonClick(e)
    }
  })
  list.addEventListener('keydown', e => {
    const selection = list.querySelector('.selected')
    if (e.keyCode === keyCodes.ARROW_UP) {
      e.preventDefault()
      if (selection && selection.previousElementSibling) {
        selectOption(<HTMLElement>selection.previousElementSibling)
      }
    }
    if (e.keyCode === keyCodes.ARROW_DOWN) {
      e.preventDefault()
      if (selection && selection.nextElementSibling) {
        selectOption(<HTMLElement>selection.nextElementSibling)
      }
    }
    if (e.keyCode === keyCodes.TAB) {
      cancelListbox(el)
      closeListbox(el, true)
    }
  })
  list.addEventListener('keyup', e => {
    const selection = list.querySelector<HTMLElement>('.selected')
    if (e.keyCode === keyCodes.ENTER) {
      if (selection) {
        changeInput(el, selection)
      }
      closeListbox(el, true)
    }
    if (e.keyCode === keyCodes.ESCAPE) {
      cancelListbox(el)
      closeListbox(el, true)
    }
  })
  // If we click a list item
  options.forEach(option => {
    option.addEventListener('click', () => {
      selectOption(option)
      changeInput(el, option)
      closeListbox(el, true)
    })
  })
}

function addDocumentListener() {
  document.addEventListener('click', e => {
    // If we click outside the list
    if (!checkParents((<HTMLElement>e.target), '.listbox')) {
      document.querySelectorAll('.listbox').forEach(listbox => {
        closeListbox((<HTMLElement>listbox), false)
      })
    }
  })
}

function buttonClick(e: Event) {
  e.preventDefault()
  const listbox = (<HTMLElement>e.target)?.parentElement
  if (listbox) {
    if (listbox.classList?.contains('open')) {
      closeListbox(listbox)
    }
    else {
      openListbox(listbox)
    }
  }
}

function openListbox(listbox: HTMLElement) {
  const list = listbox.querySelector('ul')
  if (!list) {
    return
  }
  listbox.classList.add('open')
  list.setAttribute('tabindex', '0')
  list.focus()
  listbox.querySelector('button')?.setAttribute('aria-expanded', 'true')
}

function cancelListbox(listbox: HTMLElement) {
  const input: HTMLInputElement | null = listbox.querySelector('.hidden-input')
  if (!input) {
    return
  }
  const options = listbox.querySelectorAll('li')
  options.forEach(option => {
    option.classList.remove('selected')
    if (option.getAttribute('data-value') === input.value) {
      option.classList.add('selected')
    }
  })
}

function closeListbox(listbox: HTMLElement, focus = false) {
  const button = listbox.querySelector('button')
  const list = listbox.querySelector('ul')
  if (!list || !button) {
    return
  }
  listbox.classList.remove('open')
  list.setAttribute('tabindex', '-1')
  button.removeAttribute('aria-expanded')
  if (focus) {
    button.focus()
  }
}

function selectOption(selection: HTMLElement) {
  const listbox = selection.parentElement?.parentElement
  const list = selection.parentElement
  if (!listbox || !list) {
    return
  }
  listbox.querySelectorAll('li').forEach(option => {
    option.classList.remove('selected')
  })
  selection.classList.add('selected')
  list.setAttribute('aria-activedescendant', selection.getAttribute('id') || '')
}

function changeInput(listbox: HTMLElement, selection: HTMLElement) {
  const input = listbox.querySelector<HTMLInputElement>('.hidden-input')
  const button = listbox.querySelector('button')
  if (!input || !button) {
    return
  }
  button.innerHTML = selection.innerHTML
  input.value = selection.getAttribute('data-value') || ''
  const event = document.createEvent('Event')
  event.initEvent('change', true, true)
  input.dispatchEvent(event)
}

export { init }
