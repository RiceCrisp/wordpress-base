import React from 'react'
import { Props } from '@ws/types'

declare const wp: any

const { InspectorControls } = wp.blockEditor
const { ToggleControl, PanelBody } = wp.components
const { createHigherOrderComponent } = wp.compose
const { __ } = wp.i18n

export const separatorControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-separator-controls',
  func: createHigherOrderComponent((BlockEdit: any) => {
    return (props: Props) => {
      if (props.name !== 'core/separator') {
        return (
          <BlockEdit { ...props } />
        )
      }
      const { setAttributes } = props
      const { className } = props.attributes
      const classes = className ? className.split(' ') : []
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Separator Options', 'ws') }
            >
              <ToggleControl
                label={ __('Extra Spacing', 'ws') }
                onChange={ (newValue: boolean) => {
                  const classIndex = classes.indexOf('extra-spacing')
                  if (newValue && classIndex === -1) {
                    classes.push('extra-spacing')
                    setAttributes({ className: classes.join(' ') })
                  }
                  else if (!newValue && classIndex !== -1) {
                    classes.splice(classIndex, 1)
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                checked={ classes.indexOf('extra-spacing') !== -1 }
              />
            </PanelBody>
          </InspectorControls>
          <BlockEdit { ...props } />
        </>
      )
    }
  }, 'withSeparatorControls')
}

export const separatorSupports = {
  hook: 'blocks.registerBlockType',
  name: 'ws/with-separator-support',
  func: (settings: Record<string, any>) => {
    if (settings.name === 'core/separator') {
      return {
        ...settings,
        supports: {
          ...settings.supports,
          align: false,
          textAlign: true
        }
      }
    }
    return settings
  }
}
