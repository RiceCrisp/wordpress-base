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
  PanelBody, Placeholder, SelectControl, ToggleControl
} = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const split = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M9.8 6.2H4C3.55817 6.2 3.2 6.55817 3.2 7V17C3.2 17.4418 3.55817 17.8 4 17.8H9.8V6.2ZM4 5C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H11V5H4Z"/>
        <path d="M20 6.2H14.2V17.8H20C20.4418 17.8 20.8 17.4418 20.8 17V7C20.8 6.55817 20.4418 6.2 20 6.2ZM13 5V19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5H13Z"/>
        <path d="M6.20711 12.5L7.35355 13.6464L6.64645 14.3536L4.29289 12L6.64645 9.64645L7.35355 10.3536L6.20711 11.5H8.5V12.5H6.20711Z"/>
        <path d="M17.7929 11.5L16.6464 10.3536L17.3536 9.64645L19.7071 12L17.3536 14.3536L16.6464 13.6464L17.7929 12.5H15.5V11.5H17.7929Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { clientId, setAttributes } = props
      const { verticalAlignment, mobileReverse } = props.attributes
      const {
        moveBlockToPosition,
        replaceInnerBlocks,
        updateBlockAttributes
      } = useDispatch('core/block-editor')
      const { getBlockOrder, hasInnerBlocks } = useSelect((select: Select) => ({
        getBlockOrder: select('core/block-editor').getBlockOrder,
        hasInnerBlocks: select('core/block-editor').getBlocks(clientId).length > 0
      }))
      const blockProps = useBlockProps({
        className: classnames('row', {
          [`align-items-${verticalAlignment}`]: verticalAlignment,
          'row-reverse': mobileReverse
        })
      })
      const innerBlocksProps = useInnerBlocksProps(blockProps, {
        allowedBlocks: ['ws/split-half'],
        orientation: 'horizontal',
        templateLock: 'insert'
      })
      return (
        <>
          { hasInnerBlocks ? (
            <>
              <InspectorControls>
                <PanelBody
                  title={ __('Split Options', 'ws') }
                >
                  <ToggleControl
                    label={ __('Reverse halves on mobile', 'ws') }
                    onChange={ (newValue: boolean) => {
                      const blocks = getBlockOrder(clientId)
                      moveBlockToPosition(blocks[0], clientId, clientId, 1)
                      moveBlockToPosition(blocks[1], clientId, clientId, 0)
                      setAttributes({ mobileReverse: newValue })
                    } }
                    checked={ mobileReverse }
                  />
                </PanelBody>
              </InspectorControls>
              <BlockControls>
                <BlockVerticalAlignmentToolbar
                  onChange={ (newValue: string) => {
                    const blocks = getBlockOrder(clientId)
                    blocks.forEach((block: any) => {
                      updateBlockAttributes(block, {
                        verticalAlignment: newValue
                      })
                    })
                    setAttributes({ verticalAlignment: newValue })
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
                label={ __('Split', 'ws') }
                instructions={ __('Select a layout to start with. Columns are based on a 12 column grid with any remaining columns acting as space between the halves.', 'ws') }
              >
                <SelectControl
                  options={ [
                    { label: __('Select Layout', 'ws'), value: '', disabled: true },
                    { label: __('6 columns / 6 columns', 'ws'), value: '6/6' },
                    { label: __('5 columns / 5 columns', 'ws'), value: '5/5' },
                    { label: __('6 columns / 5 columns', 'ws'), value: '6/5' },
                    { label: __('5 columns / 6 columns', 'ws'), value: '5/6' },
                    { label: __('7 columns / 5 columns', 'ws'), value: '7/5' },
                    { label: __('5 columns / 7 columns', 'ws'), value: '5/7' },
                    { label: __('7 columns / 4 columns', 'ws'), value: '7/4' },
                    { label: __('4 columns / 7 columns', 'ws'), value: '4/7' },
                    { label: __('8 columns / 4 columns', 'ws'), value: '8/4' },
                    { label: __('4 columns / 8 columns', 'ws'), value: '4/8' }
                  ] }
                  onChange={ (newValue: string) => {
                    const splits = newValue.split('/')
                    replaceInnerBlocks(
                      clientId,
                      createBlocksFromInnerBlocksTemplate([
                        ['ws/split-half', { width: Number(splits[0]) }],
                        ['ws/split-half', { width: Number(splits[1]) }]
                      ])
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
