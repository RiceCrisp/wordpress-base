import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { SVGPicker } from '@ws/components'
import classnames from 'classnames'

declare const wp: any

const {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  __experimentalColorGradientControl: ColorGradientControl,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { PanelBody, SelectControl } = wp.components
const { __ } = wp.i18n

export const icon = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M12 17.5C15.0376 17.5 17.5 15.0376 17.5 12C17.5 8.96243 15.0376 6.5 12 6.5C8.96243 6.5 6.5 8.96243 6.5 12C6.5 15.0376 8.96243 17.5 12 17.5ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const {
        size,
        icon,
        text,
        iconColor,
        iconBackgroundColor,
        iconBackgroundGradient
      } = props.attributes
      const blockProps = useBlockProps({ className: text })
      const innerBlocksProps = useInnerBlocksProps({
        className: 'icon-text'
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Icon Options', 'ws') }
            >
              <ColorGradientControl
                label={ __('Icon Color', 'ws') }
                onColorChange={ (newValue: string) => setAttributes({ iconColor: newValue }) }
                colorValue={ iconColor }
              />
              <ColorGradientControl
                label={ __('Background Color', 'ws') }
                onColorChange={ (newValue: string) => setAttributes({ iconBackgroundColor: newValue }) }
                onGradientChange={ (newValue: string) => setAttributes({ iconBackgroundGradient: newValue }) }
                colorValue={ iconBackgroundColor }
                gradientValue={ iconBackgroundGradient }
              />
              <SelectControl
                label={ __('Size', 'ws') }
                options={ [
                  { value: 'artboard', label: 'Artboard' },
                  { value: 'small', label: 'Small' },
                  { value: 'large', label: 'Large' }
                ] }
                onChange={ (newValue: string) => setAttributes({ size: newValue }) }
                value={ size }
              />
              <SelectControl
                label={ __('Text Location', 'ws') }
                options={ [
                  { value: '', label: 'None' },
                  { value: 'icon-text-right', label: 'Right' },
                  { value: 'icon-text-left', label: 'Left' }
                ] }
                onChange={ (newValue: string) => setAttributes({ text: newValue }) }
                value={ text }
              />
            </PanelBody>
          </InspectorControls>
          <div { ...blockProps }>
            <SVGPicker
              style={ {
                color: iconColor,
                backgroundColor: iconBackgroundColor,
                backgroundImage: iconBackgroundGradient
              } }
              className={ classnames('icon-svg', {
                [`size-${size}`]: size
              }) }
              onChange={ (newValue: string) => setAttributes({ icon: newValue }) }
              value={ icon }
            />
            { text && (
              <div { ...innerBlocksProps } />
            ) }
          </div>
        </>
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
