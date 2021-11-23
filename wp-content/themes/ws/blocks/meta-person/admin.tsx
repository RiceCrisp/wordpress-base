import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { useMeta } from '@ws/hooks'

declare const wp: any

const { useBlockProps } = wp.blockEditor
const { TextControl } = wp.components
const { __ } = wp.i18n

export const metaPerson = {
  name: metadata.name,
  settings: {
    edit: (props: Props) => {
      const { setAttributes } = props
      const { position } = props.attributes
      const blockProps = useBlockProps()
      useMeta(setAttributes, metadata.attributes)
      return (
        <div { ...blockProps }>
          <div className="row">
            <div className="col-xs-12">
              <TextControl
                label={ __('Position/Title', 'ws') }
                onChange={ (newValue: string) => setAttributes({ position: newValue }) }
                value={ position }
              />
            </div>
          </div>
        </div>
      )
    },
    save: () => {
      return null
    }
  }
}
