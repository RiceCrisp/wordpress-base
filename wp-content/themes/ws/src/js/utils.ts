/* Utility/helper functions used by the theme. */

import theme from '@ws/theme'
import {
  Color,
  Field,
  Gradient,
  SVG
} from '@ws/types'

// Check if arrays are equal
function arraysMatch(
  arrayA: any[],
  arrayB: any[]
) {
  if (arrayA.length !== arrayB.length) {
    return false
  }
  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return false
    }
  }
  return true
}

// Move array item from one index to another
function arrayMove(
  arr: any[],
  oldIndex: number,
  newIndex: number
) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}

// Helper function to see if we're in a child element (for elements added dynamically)
function checkParents(
  el: Node,
  selector: string
) {
  let cur: Node | null = el
  const all = document.querySelectorAll(selector)
  while (cur) {
    for (let i = 0; i < all.length; i++) {
      if (all[i] === cur) {
        return <HTMLElement>cur
      }
    }
    cur = cur.parentNode || null
  }
  return null
}

// Helper function for converting form data into url-ready key/value pairs
function formValuesToObject(form: HTMLFormElement) {
  const s: { [index: string]: string } = {}
  for (let i = 0; i < form.elements.length; i++) {
    const el: any = form.elements[i]
    if (el.name && !el.disabled && el.type !== 'file' && el.type !== 'reset' && el.type !== 'submit' && el.type !== 'button') {
      if (el.type === 'select-multiple') {
        el.options.forEach((option: HTMLOptionElement) => {
          if (option.selected) {
            s[encodeURIComponent(el.name)] = encodeURIComponent(option.value).replace(/%20/g, '+')
          }
        })
      }
      else if ((el.type !== 'checkbox' && el.type !== 'radio') || el.checked) {
        s[encodeURIComponent(el.name)] = encodeURIComponent(el.value).replace(/%20/g, '+')
      }
    }
  }
  return s
}

// Sets the correct animation-end event depending on browser
function getAnimationEvent() {
  const el: HTMLElement = document.createElement('fakeelement')
  const animations: { [index: string]: string } = {
    animation: 'animationend',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd'
  }
  for (const a in animations) {
    if (el.style[a as any] !== undefined) {
      return animations[a]
    }
  }
}

// Get cookie
function getCookie(cookieName: string) {
  const name = `${cookieName}=`
  const cookieArray = decodeURIComponent(document.cookie).split(';')
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }
  return false
}

// Sets the correct transition-end event depending on browser
function getTransitionEvent() {
  const el: HTMLElement = document.createElement('fakeelement')
  const transitions: { [index: string]: string } = {
    transition: 'transitionend',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }
  for (const t in transitions) {
    if (el.style[t as any] !== undefined) {
      return transitions[t]
    }
  }
}

// Handle ajax requests
function handleAjax(
  url: string,
  success: (data: any, args: any) => void,
  fail: (args: any) => void,
  args: any = null
) {
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.onload = () => {
    console.log(req.response)
    const data = JSON.parse(req.response)
    if (req.status === 200 && data) {
      success(data, args)
    }
    else {
      fail(args)
    }
  }
  req.onerror = () => {
    fail(args)
  }
  req.send()
}

function isTag<K extends keyof HTMLElementTagNameMap>(
  el: Element|EventTarget|null, tagName: K): el is HTMLElementTagNameMap[K] {
  return el instanceof HTMLElement && el.tagName.toLowerCase() === tagName
}

const keyCodes = {
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27
}

// Check if objects are equal
function objectsMatch(
  objectA: Record<string, any>,
  objectB: Record<string, any>
) {
  const aProps = Object.getOwnPropertyNames(objectA)
  const bProps = Object.getOwnPropertyNames(objectB)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    if (objectA[propName] !== objectB[propName]) {
      return false
    }
  }
  return true
}

// Helper function for scrolling
function onScreen(
  el: HTMLElement,
  visible: string
) {
  const rect = el.getBoundingClientRect()
  let visibleFromTop = false
  let visibleFromBottom = false
  // element is hidden
  if (el.offsetParent === null) {
    return false
  }
  // visible is a percentage
  if (visible[visible.length - 1] === '%') {
    const percentVisible = Number(visible.replace(/%/g, ''))
    visibleFromTop = 100 - (rect.top / rect.height * -100) > percentVisible
    visibleFromBottom = 100 - ((rect.bottom - window.innerHeight) / rect.height * 100) > percentVisible
  }
  // visible is in pixels
  else {
    const pixelsVisible = Number(visible.replace(/[px]+/g, ''))
    visibleFromTop = rect.bottom >= 0 + pixelsVisible
    visibleFromBottom = rect.top < window.innerHeight - pixelsVisible
  }
  return visibleFromTop && visibleFromBottom
}

// Allow focus to leave element children
function releaseFocus(
  element: HTMLElement | null,
  handleFocus?: (e: FocusEvent) => void
) {
  if (!element) {
    return
  }
  if (handleFocus === undefined) {
    handleFocus = defaultFocusHandler
  }
  if (element) {
    const firstElement = <HTMLElement>element.firstElementChild
    const lastElement = <HTMLElement>element.lastElementChild
    firstElement.removeEventListener('focus', handleFocus)
    lastElement.removeEventListener('focus', handleFocus)
    firstElement.parentNode?.removeChild(firstElement)
    lastElement.parentNode?.removeChild(lastElement)
  }
}

// Scale from one range to another
function scaleValue(
  value: number,
  from: number[],
  to: number[]
) {
  const scale = (to[1] - to[0]) / (from[1] - from[0])
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
  return capped * scale + to[0]
}

// Set cookie
function setCookie(
  cookieName: string,
  cookieValue: string,
  expirationDays: number
) {
  const d = new Date()
  d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000))
  const expires = `expires=${d.toUTCString()}`
  document.cookie = `${cookieName}=${cookieValue};${expires};path=/`
}

// Set value for text and select inputs
function setFieldValue(
  field: Field,
  value: any
) {
  if (isTag(field, 'select')) {
    const options = field.querySelectorAll('option')
    let index = -1
    options.forEach((option: HTMLOptionElement, i: number) => {
      option.selected = false
      if (option.value === value) {
        index = i
      }
    })
    field.selectedIndex = index
  }
  else {
    field.value = value
  }
}

// Takes hex or linear gradient styles and returns the theme object
function styleToThemeObject(style: string) {
  let output: Color | Gradient | boolean = false
  if (style.substring(0, 1) === '#') {
    theme.settings.color.palette.forEach((c: Color) => {
      if (c.color === style) {
        output = c
      }
    })
  }
  else if (style.substring(0, 16) === 'linear-gradient(') {
    theme.settings.color.gradients.forEach((g: Gradient) => {
      if (g.gradient === style) {
        output = g
      }
    })
  }
  return output
}

// Prints svg element from svg object
function svgFromObject(svg: SVG) {
  return `<svg viewBox="${svg.viewbox}"><title>${svg.title}</title>${svg.path}</svg>`
}

// Prevent focus from leaving element children
function trapFocus(
  element: HTMLElement | null,
  handleFocus?: (e: FocusEvent) => void
) {
  if (!element) {
    return
  }
  if (handleFocus === undefined) {
    handleFocus = defaultFocusHandler
  }
  const preDiv = document.createElement('div')
  preDiv.tabIndex = 0
  element.insertBefore(preDiv, element.firstChild)
  const postDiv = document.createElement('div')
  postDiv.tabIndex = 0
  element.appendChild(postDiv)
  preDiv.addEventListener('focus', handleFocus)
  postDiv.addEventListener('focus', handleFocus)
}


function defaultFocusHandler(
  e: FocusEvent
) {
  e.preventDefault()
  const target = e.target as HTMLElement
  target.focus({ preventScroll: true })
  const relatedTarget = e.relatedTarget as HTMLElement
  relatedTarget.focus()
}

function treeMap(
  mapFunc: (node: any) => any,
  tree: { children?: any[] }[] = []
) {
  const output = []
  for (let i = 0; i < tree.length; i++) {
    const node = mapFunc(tree[i])
    if (tree[i].children) {
      node.children = treeMap(mapFunc, tree[i].children)
    }
    output.push(node)
  }
  return output
}

interface WPData {
  id: number,
  parent: number
}

function unflattenWPData<Type extends WPData>(datas: Type[]): Type[] {
  if (!datas) {
    return []
  }
  const output = []
  const mappedArray: { [index: string]: Type & { children: Type[] } } = {}
  datas.forEach((data: Type) => {
    mappedArray[data.id] = {
      ...data,
      children: []
    }
  })
  for (const id in mappedArray) {
    const mappedEl = mappedArray[id]
    if (mappedEl.parent) {
      mappedArray[mappedEl.parent].children?.push(mappedEl)
    }
    else {
      output.push(mappedEl)
    }
  }
  return output
}

// Returns unique id
function uniqid(prefix = '') {
  const time = Date.now()
  return `${prefix}${time.toString(36)}`
}

export {
  arraysMatch,
  arrayMove,
  checkParents,
  formValuesToObject,
  getAnimationEvent,
  getCookie,
  getTransitionEvent,
  handleAjax,
  isTag,
  keyCodes,
  objectsMatch,
  onScreen,
  releaseFocus,
  scaleValue,
  setCookie,
  setFieldValue,
  styleToThemeObject,
  svgFromObject,
  trapFocus,
  treeMap,
  unflattenWPData,
  uniqid
}
