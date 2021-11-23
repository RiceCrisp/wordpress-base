import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { useMeta } from '@ws/hooks'

declare const wp: any

const { useBlockProps } = wp.blockEditor
const { RadioControl, TextControl } = wp.components
const { __ } = wp.i18n

export const metaLink = {
  name: metadata.name,
  settings: {
    edit: (props: Props) => {
      const { setAttributes } = props
      const { linkUrl, linkType } = props.attributes
      const blockProps = useBlockProps()
      useMeta(setAttributes, metadata.attributes)
      return (
        <div { ...blockProps }>
          <div className="row">
            <div className="col-sm-6">
              <RadioControl
                label={ __('Link Behavior') }
                options={ [
                  { label: 'Open url in new tab', value: 'new-tab' },
                  { label: 'Download file', value: 'download' },
                  { label: 'Open content in lightbox', value: 'lightbox' }
                ] }
                onChange={ (newValue: string) => setAttributes({ linkType: newValue }) }
                selected={ linkType || 'new-tab' }
              />
            </div>
            <div className="col-sm-6">
              { (linkType === 'new-tab' || linkType === 'download') && (
                <TextControl
                  label={ __('Internal or external resource URL', 'ws') }
                  onChange={ (newValue: string) => setAttributes({ linkUrl: newValue }) }
                  value={ linkUrl }
                />
              ) }
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
