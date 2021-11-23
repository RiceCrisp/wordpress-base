import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'

declare const wp: any

const { InspectorControls, useBlockProps } = wp.blockEditor
const {
  PanelBody, Path, SelectControl, SVG
} = wp.components
const { __ } = wp.i18n

export const spacer = {
  name: metadata.name,
  settings: {
    icon: (
      <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path d="M13 4v2h3.59L6 16.59V13H4v7h7v-2H7.41L18 7.41V11h2V4h-7" /></SVG>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { height } = props.attributes
      const blockProps = useBlockProps({
        className: height
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Spacer Settings', 'ws') }
            >
              <SelectControl
                label={ __('Height', 'ws') }
                options={ [
                  { label: '100%', value: 'spacer-100' },
                  { label: '50%', value: 'spacer-50' }
                ] }
                onChange={ (newValue: string) => setAttributes({ height: newValue }) }
                value={ height }
              />
            </PanelBody>
          </InspectorControls>
          <div { ...blockProps } />
        </>
      )
    },
    save: () => {
      return null
    }
  }
}
