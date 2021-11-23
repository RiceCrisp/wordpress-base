import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'

declare const wp: any

const {
  InnerBlocks,
  RichText,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { __ } = wp.i18n

export const accordion = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M7.46967 10.5303L8.53033 9.46967L12 12.9393L15.4697 9.46967L16.5303 10.5303L12 15.0607L7.46967 10.5303Z" />
        <path d="M19 4.5H5C4.72386 4.5 4.5 4.72386 4.5 5V19C4.5 19.2761 4.72386 19.5 5 19.5H19C19.2761 19.5 19.5 19.2761 19.5 19V5C19.5 4.72386 19.2761 4.5 19 4.5ZM5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5Z" />
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { heading } = props.attributes
      const blockProps = useBlockProps()
      const innerBlocksProps = useInnerBlocksProps()
      return (
        <div { ...blockProps }>
          <h3>
            <div className="accordion-button open">
              <RichText
                placeholder={ __('Heading', 'ws') }
                tagName="span"
                className="accordion-heading"
                keepPlaceholderOnFocus={ true }
                onChange={ (newValue: string) => setAttributes({ heading: newValue }) }
                value={ heading }
              />
              <svg className="accordion-icon" viewBox="0 0 24 24">
                <path className="down" d="M12 0 L12 24Z"></path>
                <path className="across" d="M0 12 L24 12Z"></path>
              </svg>
            </div>
          </h3>
          <div className="accordion-panel open">
            <div { ...innerBlocksProps } />
          </div>
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
