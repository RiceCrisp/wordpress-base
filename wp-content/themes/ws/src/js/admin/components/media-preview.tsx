import React, { useEffect, useState } from 'react'

declare const wp: any

type ComponentProps = {
  className?: string,
  size?: string,
  x?: string,
  y?: string,
  id: number
}

export function MediaPreview(props: ComponentProps) {
  const {
    className = '',
    size,
    x,
    y,
    id
  } = props
  const [mediaObject, setMediaObject] = useState<Record<string, any> | null>(null)
  useEffect(() => {
    if (id) {
      wp.media.attachment(id).fetch()
        .then((data: any) => {
          setMediaObject(data)
        })
        .fail(() => {
          setMediaObject(null)
        })
    }
    else {
      setMediaObject(null)
    }
  }, [id])
  const imgStyles = {
    objectPosition: x !== undefined && y !== undefined ? `${Number(x) * 100}% ${Number(y) * 100}%` : ''
  }
  if (id && mediaObject && mediaObject.url) {
    return (
      <>
        { mediaObject.type === 'image' ? (
          <img
            className={ `components-media-preview ${className}` }
            src={ size && mediaObject.sizes[size] ? mediaObject.sizes[size].url : mediaObject.url }
            alt={ mediaObject.alt }
            style={ imgStyles }
          />
        ) : (
          <span>{ mediaObject.url.replace(/^.*[/]/, '') }</span>
        ) }
      </>
    )
  }
  return null
}
