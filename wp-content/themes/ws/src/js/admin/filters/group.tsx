import React from 'react'
import { Props } from '@ws/types'

declare const wp: any

const { InspectorControls } = wp.blockEditor
const { PanelBody, ToggleControl } = wp.components
const { createHigherOrderComponent } = wp.compose
const { __ } = wp.i18n

export const groupControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-group-controls',
  func: createHigherOrderComponent((BlockEdit: any) => {
    return (props: Props) => {
      if (props.name !== 'core/group') {
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
              title={ __('Group Options', 'ws') }
            >
              <ToggleControl
                label={ __('Condense (Vertically)', 'ws') }
                onChange={ (newValue: boolean) => {
                  const classIndex = classes.indexOf('condense')
                  if (newValue && classIndex === -1) {
                    classes.push('condense')
                    setAttributes({ className: classes.join(' ') })
                  }
                  else if (!newValue && classIndex !== -1) {
                    classes.splice(classIndex, 1)
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                checked={ classes.indexOf('condense') !== -1 }
              />
              <ToggleControl
                label={ __('Limit Width (Text)', 'ws') }
                onChange={ (newValue: boolean) => {
                  const classIndex = classes.indexOf('limit-width')
                  if (newValue && classIndex === -1) {
                    classes.push('limit-width')
                    setAttributes({ className: classes.join(' ') })
                  }
                  else if (!newValue && classIndex !== -1) {
                    classes.splice(classIndex, 1)
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                checked={ classes.indexOf('limit-width') !== -1 }
              />
            </PanelBody>
          </InspectorControls>
          <BlockEdit { ...props } />
        </>
      )
    }
  }, 'withGroupControls')
}
