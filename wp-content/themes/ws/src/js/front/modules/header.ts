/* All logic related to the site header/navigation. Mostly accessibility. */

import { keyCodes, releaseFocus, trapFocus } from '@ws/utils'

function init() {
  updateTabIndex()
  scrollMenu()
  emptyLinks()
  tabbableDesktopMenu()
  tabbableMobileMenu()
  keyboardDesktopMenu()
  keyboardMobileMenu()
  window.addEventListener('load', updateSubmenuHeights)
  window.addEventListener('resize', updateSubmenuHeights)
}

function updateSubmenuHeights() {
  const firstLevelMenus = document.querySelectorAll<HTMLElement>('.desktop-nav .sub-menu.depth-2')
  firstLevelMenus.forEach(firstLevelMenu => {
    firstLevelMenu.removeAttribute('style')
    let minHeight = firstLevelMenu.offsetHeight
    const secondLevelMenus = firstLevelMenu.querySelectorAll<HTMLElement>('.sub-menu.depth-3')
    secondLevelMenus.forEach(secondLevelMenu => {
      secondLevelMenu.removeAttribute('style')
      minHeight = Math.max(minHeight, secondLevelMenu.offsetHeight)
    })
    firstLevelMenu.style.height = `${minHeight}px`
    secondLevelMenus.forEach(secondLevelMenu => {
      secondLevelMenu.style.height = `${minHeight}px`
    })
  })
}

function emptyLinks() {
  document.querySelectorAll<HTMLElement>('.desktop-nav a[href="#"]').forEach(emptyLink => {
    emptyLink.addEventListener('click', function(e) {
      e.preventDefault()
    })
  })
  document.querySelectorAll<HTMLElement>('.mobile-nav a[href="#"]').forEach(emptyLink => {
    emptyLink.addEventListener('click', function(e) {
      (e.preventDefault() as any)
      const dropdown = this.nextElementSibling as HTMLElement
      if (dropdown && dropdown.classList.contains('dropdown')) {
        dropdown.click()
      }
    })
  })
}

function scrollMenu() {
  let lastScrollY = 0
  const menu = document.querySelector<HTMLElement>('.site-header')
  if (menu) {
    const scrollMenuEvent = () => {
      if (!menu) {
        return
      }
      if (window.pageYOffset < menu.offsetHeight) {
        menu.classList.add('header-scroll-top')
        menu.classList.remove('header-not-scroll-top')
      }
      else {
        menu.classList.remove('header-scroll-top')
        menu.classList.add('header-not-scroll-top')
        if (lastScrollY - window.pageYOffset >= 1) {
          menu.classList.add('header-scrolling-up')
        }
        else {
          menu.classList.remove('header-scrolling-up')
        }
      }
      lastScrollY = window.pageYOffset
    }
    window.removeEventListener('throttleScroll', scrollMenuEvent, false)
    window.addEventListener('throttleScroll', scrollMenuEvent, false)
    window.addEventListener('load', scrollMenuEvent, false)
  }
}

function tabbableDesktopMenu() {
  document.querySelectorAll<HTMLElement>('.desktop-nav .sub-menu a').forEach(subnav => {
    subnav.addEventListener('focus', () => {
      getParentNav(subnav, true)
    })
    subnav.addEventListener('blur', () => {
      getParentNav(subnav, false)
    })
  })
}

function tabbableMobileMenu() {
  const hamburger = document.querySelector<HTMLElement>('.mobile-nav .hamburger')
  if (hamburger) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault()
      if (this.classList.contains('opened')) {
        closeMobileMenu(this)
      }
      else {
        openMobileMenu(this)
      }
    })
  }
  document.querySelectorAll<HTMLElement>('.mobile-nav .dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function() {
      if (this.classList.contains('opened')) {
        closeMobileDropdown(this)
      }
      else {
        openMobileDropdown(this)
      }
    })
  })
}

function keyboardDesktopMenu() {
  document.querySelectorAll<HTMLInputElement>('.desktop-nav .menu > .menu-item > a, .desktop-nav .menu-search-form input').forEach((el, i, a) => {
    // Prevent keyboard scrolling
    el.addEventListener('keydown', e => {
      if (e.keyCode === keyCodes.ARROW_UP || e.keyCode === keyCodes.ARROW_DOWN) {
        e.preventDefault()
      }
    })
    const submenuItems = el.parentElement?.querySelectorAll<HTMLElement>('.sub-menu a')
    el.addEventListener('keyup', e => {
      if (e.keyCode === keyCodes.ARROW_LEFT) {
        if ((<HTMLElement>e.target).getAttribute('type') !== 'search') {
          goToIndex(i - 1, a).focus()
        }
      }
      if (e.keyCode === keyCodes.ARROW_RIGHT) {
        if ((<HTMLElement>e.target).getAttribute('type') !== 'search') {
          goToIndex(i + 1, a).focus()
        }
      }
      if (submenuItems) {
        if (e.keyCode === keyCodes.ARROW_UP) {
          submenuItems[submenuItems.length - 1].focus()
        }
        if (e.keyCode === keyCodes.ARROW_DOWN) {
          submenuItems[0].focus()
        }
      }
    })
    if (submenuItems) {
      submenuItems.forEach((el2, i2, a2) => {
        // Prevent keyboard scrolling
        el2.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.keyCode === keyCodes.ARROW_UP || e.keyCode === keyCodes.ARROW_DOWN) {
            e.preventDefault()
          }
        })
        el2.addEventListener('keyup', (e: KeyboardEvent) => {
          if (e.keyCode === keyCodes.ARROW_UP) {
            goToIndex(i2 - 1, a2).focus()
          }
          if (e.keyCode === keyCodes.ARROW_DOWN) {
            goToIndex(i2 + 1, a2).focus()
          }
          if (e.keyCode === keyCodes.ARROW_LEFT) {
            goToIndex(i - 1, a).focus()
          }
          if (e.keyCode === keyCodes.ARROW_RIGHT) {
            goToIndex(i + 1, a).focus()
          }
          if (e.keyCode === keyCodes.ESCAPE) {
            goToIndex(i, a).focus()
          }
        })
      })
    }
  })
}

function keyboardMobileMenu() {
  document.querySelectorAll<HTMLElement>('.mobile-nav .menu-item > a, .mobile-nav .dropdown, .mobile-nav .menu-search-form input').forEach(el => {
    // Prevent keyboard scrolling
    el.addEventListener('keydown', e => {
      if (e.keyCode === keyCodes.ARROW_UP || e.keyCode === keyCodes.ARROW_DOWN) {
        e.preventDefault()
      }
    })
  })
}

function getParentNav(a: HTMLElement | null, hover = false) {
  if (!a) {
    return
  }
  const parent = a.parentElement?.parentElement
  if (!parent) {
    return
  }
  if (parent.classList.contains('sub-menu')) {
    const li = parent.parentElement
    if (!li) {
      return
    }
    li.classList.add('hover')
    if (hover) {
      li.classList.add('hover')
    }
    else {
      li.classList.remove('hover')
    }
    getParentNav((<HTMLElement>li.children[0]), hover)
  }
}

function updateTabIndex() {
  // Mobile
  document.querySelectorAll<HTMLElement>('.mobile-nav .menu-item > a, .mobile-nav .dropdown, .mobile-nav .menu-search-form input').forEach(el => {
    el.setAttribute('tabindex', '-1')
  })
  // Desktop
  document.querySelectorAll<HTMLElement>('.desktop-nav .menu-item > a, .desktop-nav .menu-search-form input').forEach(el => {
    el.setAttribute('tabindex', '0')
  })
}

function openMobileMenu(hamburger: HTMLElement | null) {
  const header = document.querySelector<HTMLElement>('.mobile-nav')
  if (!hamburger || !header) {
    return
  }
  hamburger.classList.remove('closed')
  hamburger.classList.add('opened')
  header.classList.remove('closed')
  header.classList.add('opened')
  hamburger.setAttribute('aria-expanded', 'true')
  document.body.classList.add('no-scroll')
  document.querySelectorAll<HTMLElement>('.mobile-nav .menu > .menu-item > a, .mobile-nav .menu > .menu-item > .dropdown, .mobile-nav .menu > .menu-item > .menu-search-form input').forEach(el => {
    el.setAttribute('tabindex', '0')
  })
  trapFocus(document.querySelector('.site-header'))
}

function closeMobileMenu(hamburger: HTMLElement | null) {
  const header = document.querySelector<HTMLElement>('.mobile-nav')
  if (!hamburger || !header) {
    return
  }
  hamburger.classList.remove('opened')
  hamburger.classList.add('closed')
  header.classList.remove('opened')
  header.classList.add('closed')
  hamburger.setAttribute('aria-expanded', 'false')
  document.body.classList.remove('no-scroll')
  document.querySelectorAll<HTMLElement>('.mobile-nav .menu-item > a, .mobile-nav .dropdown, .mobile-nav .menu-search-form input').forEach(el => {
    el.setAttribute('tabindex', '-1')
    el.classList.remove('opened')
    if (el.hasAttribute('aria-expanded')) {
      el.setAttribute('aria-expanded', 'false')
    }
  })
  releaseFocus(document.querySelector('.site-header'))
}

function openMobileDropdown(dropdown: HTMLElement | null) {
  if (!dropdown) {
    return
  }
  dropdown.classList.remove('closed')
  dropdown.classList.add('opened')
  dropdown.setAttribute('aria-expanded', 'true')
  // Make (only) next level children tabbable
  const menuItems = dropdown.nextElementSibling?.children || []
  for (let i = 0; i < menuItems.length; i++) {
    const children = menuItems[i].children
    for (let j = 0; j < children.length; j++) {
      if (children[j].tagName === 'A' || children[j].tagName === 'BUTTON') {
        children[j].setAttribute('tabindex', '0')
      }
    }
  }
}

function closeMobileDropdown(dropdown: HTMLElement | null) {
  if (!dropdown) {
    return
  }
  dropdown.classList.remove('opened')
  dropdown.classList.add('closed')
  dropdown.setAttribute('aria-expanded', 'false')
  dropdown.nextElementSibling?.querySelectorAll<HTMLElement>('a').forEach(el => {
    el.setAttribute('tabindex', '-1')
  })
  dropdown.nextElementSibling?.querySelectorAll<HTMLElement>('.dropdown').forEach(el => {
    el.setAttribute('tabindex', '-1')
    closeMobileDropdown(el)
  })
}

function goToIndex(i: number, a: NodeListOf<any>) {
  if (i < 0) {
    return a[a.length - 1]
  }
  else if (i >= a.length) {
    return a[0]
  }
  return a[i]
}

export { init, updateSubmenuHeights }
