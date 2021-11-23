import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { Background } from '@ws/components'
import classnames from 'classnames'

declare const wp: any

const {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { PanelBody, SelectControl } = wp.components
const { __ } = wp.i18n

export const tile = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M3.2 17.2V20.8H13.8V17.2H3.2ZM3 16C2.44772 16 2 16.4477 2 17V21C2 21.5523 2.44772 22 3 22H14C14.5523 22 15 21.5523 15 21V17C15 16.4477 14.5523 16 14 16H3Z"/>
        <path d="M2 3C2 2.44772 2.44772 2 3 2H14C14.5523 2 15 2.44772 15 3V14C15 14.5523 14.5523 15 14 15H3C2.44772 15 2 14.5523 2 14V3Z"/>
        <path d="M3.2 3.2V13.8H13.8V3.2H3.2ZM3 2C2.44772 2 2 2.44772 2 3V14C2 14.5523 2.44772 15 3 15H14C14.5523 15 15 14.5523 15 14V3C15 2.44772 14.5523 2 14 2H3Z"/>
        <path d="M17.2 3.2V6.8H20.8V3.2H17.2ZM17 2C16.4477 2 16 2.44772 16 3V7C16 7.55228 16.4477 8 17 8H21C21.5523 8 22 7.55228 22 7V3C22 2.44772 21.5523 2 21 2H17Z"/>
        <path d="M17.2 10.2V20.8H20.8V10.2H17.2ZM17 9C16.4477 9 16 9.44772 16 10V21C16 21.5523 16.4477 22 17 22H21C21.5523 22 22 21.5523 22 21V10C22 9.44772 21.5523 9 21 9H17Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { size } = props.attributes
      const blockProps = useBlockProps({
        className: classnames(size)
      })
      const innerBlocksProps = useInnerBlocksProps({
        className: 'inner-tile'
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Tile Options', 'ws') }
            >
              <SelectControl
                label={ __('Size', 'ws') }
                options={ [
                  { label: '1x1', value: 'one-one' },
                  { label: '1x2', value: 'one-two' },
                  { label: '2x1', value: 'two-one' },
                  { label: '2x2', value: 'two-two' }
                ] }
                onChange={ (newValue: string) => setAttributes({ size: newValue }) }
                value={ size }
              />
            </PanelBody>
          </InspectorControls>
          <div
            { ...blockProps }
            className={ blockProps.className.replace(/has-[^-]+?-background-color/, '') }
            style={ { ...blockProps.style, backgroundColor: '' } }
          >
            <Background { ...props } />
            <div { ...innerBlocksProps } />
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
