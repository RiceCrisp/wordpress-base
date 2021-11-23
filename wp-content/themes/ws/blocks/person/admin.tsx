import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { MediaSelect } from '@ws/components'

declare const wp: any

const {
  InnerBlocks,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor

export const person = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M12 19.8C16.3078 19.8 19.8 16.3078 19.8 12C19.8 7.69218 16.3078 4.2 12 4.2C7.69218 4.2 4.2 7.69218 4.2 12C4.2 16.3078 7.69218 19.8 12 19.8ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"/>
        <path d="M12 11.8C12.9941 11.8 13.8 10.9941 13.8 10C13.8 9.00589 12.9941 8.2 12 8.2C11.0059 8.2 10.2 9.00589 10.2 10C10.2 10.9941 11.0059 11.8 12 11.8ZM12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"/>
        <path d="M15 19C15.2882 18.8147 15.8 18.4602 15.8 17C15.8 15.067 13.933 13.3 12 13.3C10.067 13.3 8.2 15.067 8.2 17C8.2 18.3977 8.66024 18.7888 9 19C9.51067 19.3175 10.6271 20 12 20C13.5145 20 14.5345 19.2993 15 19ZM12 20.5C15 20.5 17 20.5 17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17C7 20.5 9.23858 20.5 12 20.5Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { image } = props.attributes
      const blockProps = useBlockProps()
      const innerBlocksProps = useInnerBlocksProps({
        className: 'person-info'
      })
      return (
        <div { ...blockProps }>
          <MediaSelect
            size="thumbnail"
            onChange={ ({ id }: { id: number }) => setAttributes({ image: id }) }
            id={ image }
          />
          <div { ...innerBlocksProps } />
        </div>
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
