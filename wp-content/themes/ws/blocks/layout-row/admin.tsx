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
const { createBlocksFromInnerBlocksTemplate } = wp.blocks
const {
  PanelBody,
  Placeholder,
  SelectControl,
  ToggleControl
} = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const layoutRow = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M3.2 8.2V15.8H6.8V8.2H3.2ZM3 7C2.44772 7 2 7.44772 2 8V16C2 16.5523 2.44772 17 3 17H7C7.55228 17 8 16.5523 8 16V8C8 7.44772 7.55228 7 7 7H3Z"/>
        <path d="M10.2 8.2V15.8H13.8V8.2H10.2ZM10 7C9.44772 7 9 7.44772 9 8V16C9 16.5523 9.44772 17 10 17H14C14.5523 17 15 16.5523 15 16V8C15 7.44772 14.5523 7 14 7H10Z"/>
        <path d="M17.2 8.2V15.8H20.8V8.2H17.2ZM17 7C16.4477 7 16 7.44772 16 8V16C16 16.5523 16.4477 17 17 17H21C21.5523 17 22 16.5523 22 16V8C22 7.44772 21.5523 7 21 7H17Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { clientId, setAttributes } = props
      const {
        sideScroll,
        verticalAlignment
      } = props.attributes
      const { replaceInnerBlocks, updateBlockAttributes } = useDispatch('core/block-editor')
      const { getBlockOrder, hasInnerBlocks } = useSelect((select: Select) => ({
        getBlockOrder: select('core/block-editor').getBlockOrder,
        hasInnerBlocks: select('core/block-editor').getBlocks(clientId).length > 0
      }))
      const blockProps = useBlockProps({
        className: classnames('row', {
          'side-scroll': sideScroll,
          [`align-items-${verticalAlignment}`]: verticalAlignment
        })
      })
      const innerBlocksProps = useInnerBlocksProps(blockProps, {
        allowedBlocks: ['ws/layout-column'],
        template: [
          ['ws/layout-column', { width: '4' }],
          ['ws/layout-column', { width: '4' }],
          ['ws/layout-column', { width: '4' }]
        ],
        orientation: 'horizontal'
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Layout Row Options', '_ws') }
            >
              <ToggleControl
                label={ __('Side scroll', '_ws') }
                onChange={ (newValue: boolean) => setAttributes({ sideScroll: newValue }) }
                checked={ sideScroll }
              />
            </PanelBody>
          </InspectorControls>
          { hasInnerBlocks ? (
            <>
              <BlockControls>
                <BlockVerticalAlignmentToolbar
                  onChange={ (newValue: string) => {
                    setAttributes({ verticalAlignment: newValue })
                    const innerBlockClientIds = getBlockOrder(clientId)
                    innerBlockClientIds.forEach((block: any) => {
                      updateBlockAttributes(block, {
                        verticalAlignment: newValue
                      })
                    })
                  } }
                  value={ verticalAlignment }
                />
              </BlockControls>
              <div { ...innerBlocksProps } />
            </>
          ) : (
            <div { ...blockProps }>
              <Placeholder
                icon="image-flip-horizontal"
                label={ __('Layout Row', 'ws') }
                instructions={ __('Select a layout to start with.', 'ws') }
              >
                <SelectControl
                  options={ [
                    { label: __('Select Layout', 'ws'), value: '', disabled: true },
                    { label: __('Halves', 'ws'), value: '2/2' },
                    { label: __('Thirds', 'ws'), value: '3/3/3' },
                    { label: __('Fourths', 'ws'), value: '4/4/4/4' },
                    { label: __('Fifths', 'ws'), value: '5/5/5/5/5' },
                    { label: __('Sixths', 'ws'), value: '6/6/6/6/6/6' }
                  ] }
                  onChange={ (newValue: string) => {
                    const columns = newValue.split('/')
                    const blocks = columns.map(column => {
                      return ['ws/layout-column', { width: Number(column) }]
                    })
                    replaceInnerBlocks(
                      clientId,
                      createBlocksFromInnerBlocksTemplate(blocks)
                    )
                  } }
                  value=""
                />
              </Placeholder>
            </div>
          ) }
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
