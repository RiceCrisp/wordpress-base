import React, { useEffect, useRef } from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'

declare const wp: any

const {
  InnerBlocks,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { useSelect, useDispatch } = wp.data

export const iconList = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M21 11.25H9V12.75H21V11.25Z"/>
        <path d="M5 12.8C5.44183 12.8 5.8 12.4418 5.8 12C5.8 11.5582 5.44183 11.2 5 11.2C4.55817 11.2 4.2 11.5582 4.2 12C4.2 12.4418 4.55817 12.8 5 12.8ZM5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"/>
        <path d="M21 5.25H9V6.75H21V5.25Z"/>
        <path d="M5 6.8C5.44183 6.8 5.8 6.44183 5.8 6C5.8 5.55817 5.44183 5.2 5 5.2C4.55817 5.2 4.2 5.55817 4.2 6C4.2 6.44183 4.55817 6.8 5 6.8ZM5 8C6.10457 8 7 7.10457 7 6C7 4.89543 6.10457 4 5 4C3.89543 4 3 4.89543 3 6C3 7.10457 3.89543 8 5 8Z"/>
        <path d="M21 17.25H9V18.75H21V17.25Z"/>
        <path d="M5 18.8C5.44183 18.8 5.8 18.4418 5.8 18C5.8 17.5582 5.44183 17.2 5 17.2C4.55817 17.2 4.2 17.5582 4.2 18C4.2 18.4418 4.55817 18.8 5 18.8ZM5 20C6.10457 20 7 19.1046 7 18C7 16.8954 6.10457 16 5 16C3.89543 16 3 16.8954 3 18C3 19.1046 3.89543 20 5 20Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { clientId } = props
      const { removeBlock } = useDispatch('core/block-editor')
      const { blockCount } = useSelect((select: Select) => ({
        blockCount: select('core/block-editor').getBlockCount(clientId)
      }))
      const previousBlockCount = useRef(blockCount)
      useEffect(() => {
        if (previousBlockCount.current > 0 && blockCount === 0) {
          removeBlock(clientId)
        }
        previousBlockCount.current = blockCount
      }, [blockCount, clientId])
      const blockProps = useBlockProps()
      const innerBlocksProps = useInnerBlocksProps(blockProps, {
        allowedBlocks: ['ws/icon-list-item'],
        template: [
          ['ws/icon-list-item']
        ],
        renderAppender: false
      })
      return (
        <ul { ...innerBlocksProps } />
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
