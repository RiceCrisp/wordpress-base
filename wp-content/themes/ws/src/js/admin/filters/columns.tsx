import React from 'react'
import { Props, Select } from '@ws/types'

declare const wp: any

const { createHigherOrderComponent } = wp.compose
const { useSelect } = wp.data

export const columnClasses = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-column-classes',
  func: createHigherOrderComponent((BlockEdit: any) => {
    return (props: Props) => {
      if (props.name !== 'core/columns') {
        return (
          <BlockEdit { ...props } />
        )
      }
      const { setAttributes } = props
      const { className } = props.attributes
      const { count } = useSelect((select: Select) => ({
        count: select('core/block-editor').getBlockCount(props.clientId)
      }))
      if (className && className.search(/has-\d+-columns/i) !== -1) {
        setAttributes({ className: className.replace(/has-\d+-columns/i, `has-${count}-columns`) })
      }
      else {
        setAttributes({ className: className ? `${className} has-${count}-columns` : `has-${count}-columns` })
      }
      return (
        <BlockEdit { ...props } />
      )
    }
  }, 'withColumnClasses')
}
