import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { MediaSelect } from '@ws/components'

declare const wp: any

const apiFetch = wp.apiFetch

function AuthorOptions() {
  const [fields, setFields] = useState({
    custom_avatar: 0
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('user_id') || '1'
    apiFetch({ path: `/wp/v2/users/${userId}` })
      .then((res: any) => {
        setFields({ custom_avatar: res.meta.custom_avatar || 0 })
      })
      .catch((err: string) => {
        console.error('error', err)
      })
  }, [])

  return (
    <>
      <h3>Custom Avatar</h3>
      <MediaSelect
        id={ fields.custom_avatar }
        onChange={ ({ id }) => setFields({ custom_avatar: id }) }
        size="thumbnail"
      />
      <input name="custom_avatar" type="hidden" value={ fields.custom_avatar } />
    </>
  )
}

function init() {
  const authorOptions = document.querySelector('.author-options')
  if (authorOptions) {
    ReactDOM.render(
      <AuthorOptions />,
      authorOptions
    )
  }
}

export { init }
