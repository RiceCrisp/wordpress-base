import React from 'react'
import { Props } from '@ws/types'

declare const wp: any

const { InspectorControls } = wp.blockEditor
const { PanelBody, ToggleControl } = wp.components
const { createHigherOrderComponent } = wp.compose
const { __ } = wp.i18n

export const shadowControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-shadow-controls',
  func: createHigherOrderComponent((BlockEdit: any) => {
    return (props: Props) => {
      if (props.name !== 'core/image') {
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
              title={ __('Shadow', 'ws') }
            >
              <ToggleControl
                label={ __('Drop Shadow', 'ws') }
                onChange={ (newValue: boolean) => {
                  const classIndex = classes.indexOf('has-drop-shadow')
                  if (newValue && classIndex === -1) {
                    classes.push('has-drop-shadow')
                    setAttributes({ className: classes.join(' ') })
                  }
                  else if (!newValue && classIndex !== -1) {
                    classes.splice(classIndex, 1)
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                checked={ classes.indexOf('has-drop-shadow') !== -1 }
              />
            </PanelBody>
          </InspectorControls>
          <BlockEdit { ...props } />
        </>
      )
    }
  }, 'withShadowControls')
}
