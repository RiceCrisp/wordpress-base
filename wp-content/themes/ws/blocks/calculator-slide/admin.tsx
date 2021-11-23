import React from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'

declare const wp: any

const { InnerBlocks, RichText, useBlockProps } = wp.blockEditor
const { useSelect } = wp.data
const { __ } = wp.i18n

export const calculatorSlide = {
  name: metadata.name,
  settings: {
    edit: (props: Props) => {
      const { clientId, setAttributes } = props
      const { position, heading } = props.attributes
      const { getBlockIndex, getBlockParents } = useSelect((select: Select) => select('core/block-editor'))
      const pos = getBlockIndex(clientId, getBlockParents(clientId)[0])
      if (position !== pos) {
        setAttributes({ position: pos })
      }
      const blockProps = useBlockProps()
      return (
        <div { ...blockProps }>
          <RichText
            placeholder={ __('Heading', 'ws') }
            tagName="h2"
            onChange={ (newValue: string) => setAttributes({ heading: newValue }) }
            value={ heading }
          />
          <InnerBlocks
            templateLock={ false }
          />
        </div>
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
