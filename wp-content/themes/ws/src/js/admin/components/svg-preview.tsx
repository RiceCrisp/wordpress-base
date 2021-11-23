import React, { useEffect, useState } from 'react'

declare const wp: any

const apiFetch = wp.apiFetch
const { SVG } = wp.components

type ComponentProps = {
  className?: string,
  id: string
}

export function SVGPreview(props: ComponentProps) {
  const {
    id
  } = props

  const [svgProps, setSvgProps] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    if (id) {
      apiFetch({ path: `/ws/svgs/${id}` })
        .then((res: any) => {
          setSvgProps({
            width: res.viewbox.split(' ')[2],
            height: res.viewbox.split(' ')[3],
            viewBox: res.viewbox,
            fillRule: 'evenodd',
            dangerouslySetInnerHTML: { __html: res.path },
            ...props
          })
        })
        .catch((err: string) => {
          setSvgProps(null)
          console.error(`error (svg id: ${id})`, err)
        })
    }
    else {
      setSvgProps(null)
    }
  }, [id])
  return (
    <>
      { !!svgProps && (
        <SVG { ...svgProps } />
      ) }
    </>
  )
}
