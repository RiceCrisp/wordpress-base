import React from 'react'
import { Select } from '@ws/types'

declare const wp: any

const { InspectorControls } = wp.blockEditor
const { PanelBody, RangeControl } = wp.components
const { createHigherOrderComponent } = wp.compose
const { useSelect } = wp.data
const { __ } = wp.i18n

export const listColumnsControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-list-columns-controls',
  func: createHigherOrderComponent((BlockEdit: any) => {
    return (props: Record<string, any>) => {
      const { columnSupport } = useSelect((select: Select) => ({
        columnSupport: select('core/blocks').getBlockSupport(props.name, 'columns')
      }), [])
      if (!columnSupport) {
        return (
          <BlockEdit { ...props } />
        )
      }
      const { setAttributes } = props
      const { className = '' } = props.attributes
      const classes: string[] = className ? className.split(' ') : []
      const classIndex = classes.findIndex(c => c.substring(0, 13) === 'column-count-')
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('List Options', 'ws') }
            >
              <RangeControl
                label={ __('Columns', 'ws') }
                min={ 1 }
                max={ 3 }
                onChange={ (newValue: number) => {
                  if (classIndex === -1) {
                    classes.push(`column-count-${newValue}`)
                    setAttributes({ className: classes.join(' ') })
                  }
                  else {
                    classes[classIndex] = `column-count-${newValue}`
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                value={ classIndex === -1 ? 1 : Number(classes[classIndex].substr(-1)) }
              />
            </PanelBody>
          </InspectorControls>
          <BlockEdit { ...props } />
        </>
      )
    }
  }, 'withListColumnsControls')
}
