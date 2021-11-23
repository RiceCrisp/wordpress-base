import { checkParents } from '@ws/utils'
import mktoFormChain from './marketo'

declare const MktoForms2: any

initForms('marketo')

function initForms(crm: string) {
  // emptySelectStyles()
  updateUtmCookies()
  if (crm === 'marketo') {
    addMarketoListeners()
  }
  else if (crm === 'hubspot') {
    addHubspotListeners()
  }
  else if (crm === 'pardot') {
    addPardotListeners()
  }
}

function addMarketoListeners() {
  if (typeof MktoForms2 !== 'undefined') {
    const formIds = []
    const t = document.querySelectorAll('.mktoForm[data-form-id]')
    for (let i = 0; i < t.length; i++) {
      formIds.push(t[i].getAttribute('data-form-id'))
    }
    mktoFormChain({
      podId: '',
      munchkinId: '',
      formIds: [...new Set(formIds)]
    })
    MktoForms2.whenReady((form: any) => {
      pullUtmCookies(form)
      form.onValidate(() => {
        form.getFormElem()[0].classList.add('submitted')
      })
      form.onSuccess(() => {
        return hideFormShowMessage(form)
      })
    })
    MktoForms2.whenRendered((form: any) => {
      const formEl: HTMLElement = form.getFormElem()[0]
      destyleForm(formEl)
    })
  }
}

function addHubspotListeners() {
  window.addEventListener('hsvalidatedsubmit', e => {
    const form = <HTMLElement>e.target
    hideFormShowMessage(form)
  })
}

function addPardotListeners() {
  function receiveMessage(e: MessageEvent) {
    if (e.origin !== 'http://go.pardot.com') {
      return
    }
    if (e.data.url || e.data.name) {
      if (e.data.submitted) {
        const form = e.data.name ? document.querySelector<HTMLElement>(`iframe[name^="${e.data.name}"]`) : document.querySelector<HTMLElement>(`iframe[src="${e.data.url}"]`)
        hideFormShowMessage(form)
      }
    }
  }
  window.addEventListener('message', receiveMessage, false)
}

function destyleForm(form: HTMLElement) {
  form.removeAttribute('style')
  // form.querySelectorAll('[style]').forEach(el => {
  //   el.removeAttribute('style')
  // })
}

function updateUtmCookies() {
  if (location.search) {
    const keyValuePairs = location.search.substr(1).split('&')
    keyValuePairs.forEach(keyValuePair => {
      const temp = keyValuePair.split('=')
      const key = temp[0]
      const value = temp[1]
      if (key.indexOf('utm_') === 0 || key === 'gclid') {
        document.cookie = `${key}=${value}; path=/`
      }
    })
  }
  document.cookie = `referrer=${document.referrer}; path=/`
}

function pullUtmCookies(form: any) {
  const cookies = document.cookie.split('; ').filter(cookie => {
    return cookie.indexOf('utm_') === 0 || cookie.indexOf('gclid')
  })
  cookies.forEach(cookie => {
    const temp = cookie.split('=')
    const field = temp[0]
    const value = temp[1]
    form.vals({ [field]: value })
  })
}

function hideFormShowMessage(form: HTMLElement | null) {
  if (form) {
    const parent = checkParents(form, '.wp-block-ws-form') || undefined
    const thankYou = parent?.querySelector<HTMLElement>('.form-msg')
    if (thankYou && thankYou.innerHTML !== '') {
      form.style.setProperty('display', 'none')
      thankYou.innerHTML = atob(thankYou.innerHTML)
      thankYou.style.setProperty('display', 'block')
      return false
    }
  }
  return true
}
