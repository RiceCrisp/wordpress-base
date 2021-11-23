import React, { useEffect, useState } from 'react'

declare const wp: any

const apiFetch = wp.apiFetch
const { __ } = wp.i18n

type ComponentProps = {
  id: number
}

export function PostPreview(props: ComponentProps) {
  const {
    id
  } = props
  const [postObject, setPostObject] = useState<Record<string, any> | null>(null)
  useEffect(() => {
    apiFetch({ path: `/ws/all?include=${id}` })
      .then((res: any) => {
        setPostObject(res[0])
      })
      .catch((err: string) => {
        setPostObject(null)
        console.error('error', err)
      })
  }, [id])
  let preview
  if (postObject) {
    const d = new Date(postObject.start_date || postObject.start_date)
    preview = (
      <>
        { postObject.thumbnail && (
          <div className="featured-image">
            <img src={ postObject.thumbnail } alt={ postObject.post_title } />
          </div>
        ) }
        <p className="label">
          { `${postObject.post_type} | ${monthToString(d.getMonth())} ${d.getDate()}, ${d.getFullYear()}` }
        </p>
        <h3 className="post-title">{ decodeEntities(postObject.post_title) }</h3>
      </>
    )
  }
  else {
    preview = (
      <h3>{ __('Post Removed or Corrupted', 'ws') }</h3>
    )
  }
  return (
    <div className="components-post-preview">
      { preview }
    </div>
  )
}

function monthToString(n: number) {
  const m = [
    __('January', 'ws'),
    __('February', 'ws'),
    __('March', 'ws'),
    __('April', 'ws'),
    __('May', 'ws'),
    __('June', 'ws'),
    __('July', 'ws'),
    __('August', 'ws'),
    __('September', 'ws'),
    __('October', 'ws'),
    __('November', 'ws'),
    __('December', 'ws')
  ]
  return m[n]
}

function decodeEntities(html: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}
