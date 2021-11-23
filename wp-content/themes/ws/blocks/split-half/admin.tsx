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
const { PanelBody, RangeControl, ToggleControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const splitHalf = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M20 6.2H14.2V17.8H20C20.4418 17.8 20.8 17.4418 20.8 17V7C20.8 6.55817 20.4418 6.2 20 6.2ZM13 5V19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5H13Z"/>
        <path d="M4 5C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H11V5H4ZM7.35355 13.6464L6.20711 12.5H8.5V11.5H6.20711L7.35355 10.3536L6.64645 9.64645L4.29289 12L6.64645 14.3536L7.35355 13.6464Z"/>
        <path d="M17.7929 11.5L16.6464 10.3536L17.3536 9.64645L19.7071 12L17.3536 14.3536L16.6464 13.6464L17.7929 12.5H15.5V11.5H17.7929Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { clientId, setAttributes } = props
      const {
        width, sticky, extendTop, extendBottom, verticalAlignment
      } = props.attributes
      const { updateBlockAttributes } = useDispatch('core/block-editor')
      const {
        hasChildBlocks,
        rootClientId,
        adjacentBlockId,
        adjacentBlock
      } = useSelect((select: Select) => {
        const adjacentBlockId = select('core/block-editor').getAdjacentBlockClientId(clientId, 1) || select('core/block-editor').getAdjacentBlockClientId(clientId, -1)
        return {
          adjacentBlockId: adjacentBlockId,
          hasChildBlocks: select('core/block-editor').getBlockCount(clientId) > 0,
          rootClientId: select('core/block-editor').getBlockRootClientId(clientId),
          adjacentBlock: select('core/block-editor').getBlockAttributes(adjacentBlockId)
        }
      })
      const blockProps = useBlockProps({
        className: classnames({
          [`align-self-${verticalAlignment}`]: verticalAlignment,
          [`col-${width}`]: width
        })
      })
      const innerBlocksProps = useInnerBlocksProps({
        className: 'split-half-inner'
      }, {
        templateLock: false,
        renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Split Half Options', 'ws') }
            >
              <RangeControl
                label={
                  <>
                    { __('Width', 'ws') }
                    &nbsp;
                    <small>{ __('(columns out of 12)', 'ws') }</small>
                  </>
                }
                min={ 4 }
                max={ 8 }
                onChange={ (newValue: number) => {
                  if (12 - newValue < adjacentBlock.width) {
                    updateBlockAttributes(adjacentBlockId, { width: 12 - newValue })
                      .then(setAttributes({ width: newValue }))
                  }
                  else {
                    setAttributes({ width: newValue })
                  }
                } }
                value={ width }
              />
              <ToggleControl
                label={ __('Sticky', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ sticky: newValue }) }
                checked={ sticky }
              />
              <ToggleControl
                label={ __('Extend Top', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ extendTop: newValue }) }
                checked={ extendTop }
              />
              <ToggleControl
                label={ __('Extend Bottom', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ extendBottom: newValue }) }
                checked={ extendBottom }
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
          <div { ...blockProps }>
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
