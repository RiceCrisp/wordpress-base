import { Field } from '@ws/types'
import {
  checkParents,
  formValuesToObject,
  handleAjax,
  setFieldValue
} from '@ws/utils'
import { lazyEvent } from '@ws/modules/lazy'

const loadMoreArchives = document.querySelectorAll<HTMLElement>('.archive.load-more')
for (let i = 0; i < loadMoreArchives.length; i++) {
  const archive = loadMoreArchives[i]
  submitLoadMoreForm(archive)
  // Catch sumbit events
  archive.addEventListener('submit', e => {
    e.preventDefault()
    submitLoadMoreForm(archive, { resetPage: true })
  })
  // Submit form on select change
  const formInputs = archive.querySelectorAll('.archive-filters select, .archive-filters .listbox input')
  for (let i = 0; i < formInputs.length; i++) {
    const formInput = formInputs[i]
    formInput.addEventListener('change', () => {
      submitLoadMoreForm(archive, { resetPage: true })
    })
  }
}

const paginationArchives = document.querySelectorAll<HTMLElement>('.archive.pagination')
for (let i = 0; i < paginationArchives.length; i++) {
  const archive = paginationArchives[i]
  // Submit on page load
  submitPaginationForm(archive, { updateHistory: false })
  // Catch sumbit events
  archive.addEventListener('submit', e => {
    e.preventDefault()
    submitPaginationForm(archive, { resetPage: true })
  })
  // Submit form on select change
  const formInputs = archive.querySelectorAll('.archive-filters select, .archive-filters .listbox input')
  for (let i = 0; i < formInputs.length; i++) {
    const formInput = formInputs[i]
    formInput.addEventListener('change', () => {
      submitPaginationForm(archive, { resetPage: true })
    })
  }
  // Add history listeners
  window.addEventListener('popstate', e => {
    if (e.state && e.state.filter) {
      history.replaceState(e.state, '', e.state.url)
    }
    updateInputs(e.state && e.state.formObject ? e.state.formObject : false)
    submitPaginationForm(archive, { updateHistory: false })
  })
}

document.addEventListener('click', (e) => {
  const button = checkParents(<HTMLElement>e.target, '.archive-page-link')
  if (button) {
    e.preventDefault()
    const archive = checkParents(button, '.archive')
    const input = archive ? archive.querySelector<HTMLInputElement>('input[name=paged]') : false
    if (archive && input) {
      const page = button.getAttribute('data-page') || ''
      if (archive.classList.contains('load-more')) {
        input.value = page
        submitLoadMoreForm(archive)
      }
      else {
        input.value = page
        submitPaginationForm(archive)
      }
    }
  }
})

function submitPaginationForm(
  archive: HTMLElement,
  args: { resetPage?: boolean, updateHistory?: boolean } = {}
) {
  const {
    resetPage = false,
    updateHistory = true
  } = args
  if (resetPage) {
    const input = archive.querySelector<HTMLInputElement>('input[name=paged]')
    if (input) {
      input.value = '1'
    }
  }
  const form = archive.querySelector<HTMLFormElement>('.archive-filters')
  const resultsContainer = archive.querySelector<HTMLElement>('.archive-results')
  if (form && resultsContainer) {
    const formObject = formValuesToObject(form)
    const apiUrl = formToApiUrl(formObject)
    const windowUrl = formToWindowUrl(formObject)
    if (updateHistory) {
      history.pushState({ filter: true, formObject: formObject, url: windowUrl }, '', windowUrl)
    }
    resultsContainer.innerHTML = '<div class="archive-loading"></div>'
    handleAjax(apiUrl, paginationSuccess, filterFail, {
      archive: archive
    })
  }
}

function submitLoadMoreForm(
  archive: HTMLElement,
  args: { resetPage?: boolean } = {}
) {
  const { resetPage = false } = args
  if (resetPage) {
    const input = archive.querySelector<HTMLInputElement>('input[name=paged]')
    if (input) {
      input.value = '1'
    }
  }
  const form = archive.querySelector<HTMLFormElement>('.archive-filters')
  const resultsContainer = archive.querySelector<HTMLElement>('.archive-results')
  if (form && resultsContainer) {
    const formObject = formValuesToObject(form)
    const apiUrl = formToApiUrl(formObject)
    const button = archive.querySelector('.archive-controls')
    if (button) {
      button.parentNode?.removeChild(button)
      resultsContainer.insertAdjacentHTML('beforeend', '<div class="archive-loading"></div>')
    }
    else {
      resultsContainer.innerHTML = '<div class="archive-loading"></div>'
    }
    if (resetPage) {
      resultsContainer.innerHTML = '<div class="archive-loading"></div>'
    }
    handleAjax(apiUrl, loadMoreSuccess, filterFail, {
      archive: archive,
      page: formObject.paged
    })
  }
}

function formToApiUrl(formObject: Record<string, any>) {
  const parameters = []
  const taxonomies = []
  for (const key in formObject) {
    const value = formObject[key]
    if (value) {
      if (key.substring(0, 7) === 'filter-') {
        const taxonomy = key.substring(7)
        if (taxonomy === 'post_type') {
          parameters.push(`post_type=${value}`)
        }
        if (taxonomy === 'year') {
          parameters.push(`year=${value}`)
        }
        else {
          taxonomies.push({ name: taxonomy, terms: [value] })
        }
      }
      else {
        parameters.push(`${key}=${value}`)
      }
    }
  }
  if (taxonomies.length > 0) {
    const taxTerms = taxonomies.map(taxonomy => {
      return `${taxonomy.name}~~${taxonomy.terms.join('~')}`
    })
    parameters.push(`terms=${taxTerms.join(',')}`)
  }
  return `/wp-json/ws/archive?${parameters.join('&')}`
}

function formToWindowUrl(formObject: Record<string, any>) {
  let url = ''
  if (formObject.paged && formObject.paged > 1) {
    url += `page/${formObject.paged}/`
  }
  const parameters = []
  for (const key in formObject) {
    const value = formObject[key]
    if (['post_type', 'paged', 'posts_per_page', 'type'].indexOf(key) === -1 && value !== '') {
      parameters.push(`${key}=${value}`)
    }
  }
  if (parameters.length) {
    url += `?${parameters.join('&')}`
  }
  return `${window.location.pathname.replace(/page\/\d+\//, '')}${url}`
}

function paginationSuccess(
  data: { currentPage: number, totalPages: number, output: string },
  args: { archive: HTMLElement }
) {
  const resultsContainer = args.archive.querySelector<HTMLElement>('.archive-results')
  const loading = args.archive.querySelector<HTMLElement>('.archive-loading')
  if (resultsContainer && loading) {
    loading.parentNode?.removeChild(loading)
    resultsContainer.insertAdjacentHTML('beforeend', data.output)
    const currentPage = data.currentPage
    const totalPages = data.totalPages
    if (totalPages > 1) {
      let pagination = '<div class="archive-controls">'
      if (currentPage - 1 > 0) {
        pagination += `<a class="archive-page-link previous" rel="prev" data-page="${currentPage - 1}" href="${getPageUrl(currentPage - 1)}">Previous</a>`
      }
      pagination += currentPage
      if (currentPage + 1 <= totalPages) {
        pagination += `<a class="archive-page-link next" rel="next" data-page="${currentPage + 1}" href="${getPageUrl(currentPage + 1)}">Next</a>`
      }
      pagination += '</div>'
      resultsContainer.insertAdjacentHTML('beforeend', pagination)
    }
    if (!data.output) {
      resultsContainer.insertAdjacentHTML('beforeend', '<div class="archive-controls"><p class="no-results">No results found.</p></div>')
    }
    lazyEvent()
  }
}

function loadMoreSuccess(
  data: { currentPage: number, totalPages: number, output: string },
  args: { archive: HTMLElement, page: number }
) {
  const resultsContainer = args.archive.querySelector('.archive-results')
  const loading = args.archive.querySelector('.archive-loading')
  if (resultsContainer && loading) {
    loading.parentNode?.removeChild(loading)
    resultsContainer.insertAdjacentHTML('beforeend', data.output)
    if (data.currentPage < data.totalPages) {
      const loadMore = `<div class="archive-controls"><button class="archive-page-link" data-page="${Number(args.page) + 1}">Load More</button></div>`
      resultsContainer.insertAdjacentHTML('beforeend', loadMore)
    }
    if (!data.output) {
      resultsContainer.insertAdjacentHTML('beforeend', '<div class="archive-controls"><p class="no-results">No results found.</p></div>')
    }
    lazyEvent()
  }
}

function getPageUrl(page: number) {
  let path = ''
  if (page === 1) {
    path = window.location.pathname.replace(/page\/\d+\//, '')
  }
  else {
    path = window.location.pathname.replace(/(.*\/page\/)(\d+)(\/.*)/, `$1${page}$3`)
  }
  return `${path}${window.location.search}`
}

function filterFail(args: { archive: HTMLElement }) {
  const resultsContainer = args.archive.querySelector('.archive-results')
  if (resultsContainer) {
    resultsContainer.innerHTML = '<div class="col-xs-12 text-center"><p class="no-margin">Something has gone wrong. Please try again.</p></div>'
  }
}

function updateInputs(formObject: Record<string, any>) {
  if (Object.keys(formObject).length === 0) {
    const inputs = document.querySelectorAll<Field>('.archive-filters select, .archive-filters .listbox input, .archive-filters input:not([type=hidden])')
    inputs.forEach(input => {
      setFieldValue(input, '')
    })
  }
  else {
    for (const key in formObject) {
      const value = formObject[key]
      const input = document.querySelector<Field>(`.archive-filters [name="${key}"]`)
      if (input) {
        setFieldValue(input, decodeURIComponent(value))
      }
    }
  }
}
