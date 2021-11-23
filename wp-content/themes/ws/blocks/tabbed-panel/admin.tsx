import React, { useEffect } from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'
import classnames from 'classnames'

declare const wp: any

const {
  InnerBlocks,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { useDispatch, useSelect } = wp.data

export const tabbedPanel = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M2 12C2 10.8954 2.89543 10 4 10H20C21.1046 10 22 10.8954 22 12V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V12Z"/>
        <path d="M20 11H4C3.44772 11 3 11.4477 3 12V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V12C21 11.4477 20.5523 11 20 11ZM4 10C2.89543 10 2 10.8954 2 12V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V12C22 10.8954 21.1046 10 20 10H4Z"/>
        <path d="M2 6C2 5.44772 2.44772 5 3 5H7C7.55228 5 8 5.44772 8 6V8C8 8.55228 7.55228 9 7 9H3C2.44772 9 2 8.55228 2 8V6Z"/>
        <path d="M7 6H3L3 8H7V6ZM3 5C2.44772 5 2 5.44772 2 6V8C2 8.55228 2.44772 9 3 9H7C7.55228 9 8 8.55228 8 8V6C8 5.44772 7.55228 5 7 5H3Z"/>
        <path d="M14 6H10V8H14V6ZM10 5C9.44772 5 9 5.44772 9 6V8C9 8.55228 9.44772 9 10 9H14C14.5523 9 15 8.55228 15 8V6C15 5.44772 14.5523 5 14 5H10Z"/>
        <path d="M21 6H17V8H21V6ZM17 5C16.4477 5 16 5.44772 16 6V8C16 8.55228 16.4477 9 17 9H21C21.5523 9 22 8.55228 22 8V6C22 5.44772 21.5523 5 21 5H17Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { clientId } = props
      const {
        setTabbedPanelCurrentId
      } = useDispatch('ws/tabbed-panels')
      const {
        currentPanelId,
        isSelected,
        rootClientId
      } = useSelect((select: Select) => {
        const rootClientId = select('core/block-editor').getBlockRootClientId(clientId)
        const isSelected = select('core/block-editor').isBlockSelected(clientId, true)
        const hasInnerBlocksSelected = select('core/block-editor').hasSelectedInnerBlock(clientId, true)
        return {
          currentPanelId: select('ws/tabbed-panels').getTabbedPanelCurrentId(rootClientId),
          isSelected: isSelected || hasInnerBlocksSelected,
          rootClientId: rootClientId
        }
      })
      useEffect(() => {
        if (isSelected) {
          setTabbedPanelCurrentId(rootClientId, clientId)
        }
      }, [isSelected])
      const blockProps = useBlockProps({
        className: classnames('panel', {
          current: currentPanelId === clientId
        })
      })
      const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: [
          ['core/paragraph']
        ]
      })
      return (
        <div { ...innerBlocksProps } />
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
