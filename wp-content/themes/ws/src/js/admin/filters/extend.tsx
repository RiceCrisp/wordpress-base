import React from 'react'
import { Props } from '@ws/types'

declare const wp: any

const { InspectorControls } = wp.blockEditor
const { ToggleControl, PanelBody } = wp.components
const { createHigherOrderComponent } = wp.compose
const { __ } = wp.i18n

export const extendControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-extend-controls',
  func: createHigherOrderComponent((BlockEdit: any) => {
    return (props: Props) => {
      if (!['core/image', 'core/video', 'ws/card'].includes(props.name)) {
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
              title={ __('Extend', 'ws') }
            >
              <ToggleControl
                label={ __('Extend Left', 'ws') }
                onChange={ (newValue: boolean) => {
                  const classIndex = classes.indexOf('extend-left')
                  if (newValue && classIndex === -1) {
                    classes.push('extend-left')
                    setAttributes({ className: classes.join(' ') })
                  }
                  else if (!newValue && classIndex !== -1) {
                    classes.splice(classIndex, 1)
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                checked={ classes.indexOf('extend-left') !== -1 }
              />
              <ToggleControl
                label={ __('Extend Right', 'ws') }
                onChange={ (newValue: boolean) => {
                  const classIndex = classes.indexOf('extend-right')
                  if (newValue && classIndex === -1) {
                    classes.push('extend-right')
                    setAttributes({ className: classes.join(' ') })
                  }
                  else if (!newValue && classIndex !== -1) {
                    classes.splice(classIndex, 1)
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                checked={ classes.indexOf('extend-right') !== -1 }
              />
            </PanelBody>
          </InspectorControls>
          <BlockEdit { ...props } />
        </>
      )
    }
  }, 'withExtendControls')
}
