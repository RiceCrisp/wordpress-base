import React from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'
import classnames from 'classnames'

declare const wp: any

const {
  BlockControls,
  BlockVerticalAlignmentToolbar,
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { PanelBody, SelectControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const layoutColumn = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M3.2 8.2V15.8H6.8V8.2H3.2ZM3 7C2.44772 7 2 7.44772 2 8V16C2 16.5523 2.44772 17 3 17H7C7.55228 17 8 16.5523 8 16V8C8 7.44772 7.55228 7 7 7H3Z"/>
        <path d="M9 8C9 7.44772 9.44772 7 10 7H14C14.5523 7 15 7.44772 15 8V16C15 16.5523 14.5523 17 14 17H10C9.44772 17 9 16.5523 9 16V8Z"/>
        <path d="M10.2 8.2V15.8H13.8V8.2H10.2ZM10 7C9.44772 7 9 7.44772 9 8V16C9 16.5523 9.44772 17 10 17H14C14.5523 17 15 16.5523 15 16V8C15 7.44772 14.5523 7 14 7H10Z"/>
        <path d="M17.2 8.2V15.8H20.8V8.2H17.2ZM17 7C16.4477 7 16 7.44772 16 8V16C16 16.5523 16.4477 17 17 17H21C21.5523 17 22 16.5523 22 16V8C22 7.44772 21.5523 7 21 7H17Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { clientId, setAttributes } = props
      const { width, verticalAlignment } = props.attributes
      const { updateBlockAttributes } = useDispatch('core/block-editor')
      const { hasChildBlocks, rootClientId } = useSelect((select: Select) => ({
        hasChildBlocks: select('core/block-editor').getBlockCount(clientId) > 0,
        rootClientId: select('core/block-editor').getBlockRootClientId(clientId)
      }), [clientId])
      const blockProps = useBlockProps({
        className: classnames({
          [`align-self-${verticalAlignment}`]: verticalAlignment,
          [`col-${width}`]: width
        })
      })
      const innerBlocksProps = useInnerBlocksProps(blockProps, {
        templateLock: false,
        renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Layout Column Options', 'ws') }
            >
              <SelectControl
                label={ __('Width', 'ws') }
                options={ [
                  { label: '100%', value: '1' },
                  { label: '1/2', value: '2' },
                  { label: '1/3', value: '3' },
                  { label: '1/4', value: '4' },
                  { label: '1/5', value: '5' },
                  { label: '1/6', value: '6' }
                ] }
                onChange={ (newValue: string) => setAttributes({ width: Number(newValue) }) }
                value={ width }
              />
            </PanelBody>
          </InspectorControls>
          <BlockControls>
            <BlockVerticalAlignmentToolbar
              onChange={ (newValue: string) => {
                setAttributes({ verticalAlignment: newValue })
                updateBlockAttributes(rootClientId, {
                  verticalAlignment: null
                })
              } }
              value={ verticalAlignment }
            />
          </BlockControls>
          <div { ...innerBlocksProps } />
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
