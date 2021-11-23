import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { SVGPreview } from '@ws/components'

declare const wp: any

const { InspectorControls, useBlockProps } = wp.blockEditor
const { PanelBody, TextControl } = wp.components
const { __ } = wp.i18n

export const socialShare = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M10 12C10 13.6569 8.65685 15 7 15C5.34315 15 4 13.6569 4 12C4 10.3431 5.34315 9 7 9C8.65685 9 10 10.3431 10 12Z"/>
        <path d="M20 7C20 8.65685 18.6569 10 17 10C15.3431 10 14 8.65685 14 7C14 5.34315 15.3431 4 17 4C18.6569 4 20 5.34315 20 7Z"/>
        <path d="M8.67705 12L17.3354 7.67082L16.6646 6.32918L5.32295 12L16.6646 17.6708L17.3354 16.3292L8.67705 12Z"/>
        <path d="M20 17C20 18.6569 18.6569 20 17 20C15.3431 20 14 18.6569 14 17C14 15.3431 15.3431 14 17 14C18.6569 14 20 15.3431 20 17Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { pdf } = props.attributes
      const blockProps = useBlockProps()
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Social Share Options', 'ws') }
            >
              <TextControl
                label={ __('Download Link', 'ws') }
                onChange={ (newValue: string) => setAttributes({ pdf: newValue }) }
                value={ pdf }
              />
            </PanelBody>
          </InspectorControls>
          <div { ...blockProps }>
            <SVGPreview
              id="mail"
              className="share-button"
            />
            <SVGPreview
              id="linkedin"
              className="share-button"
            />
            <SVGPreview
              id="facebook"
              className="share-button"
            />
            <SVGPreview
              id="twitter"
              className="share-button"
            />
            { !!pdf && (
              <SVGPreview
                id="download"
                className="share-button"
              />
            ) }
          </div>
        </>
      )
    },
    save: () => {
      return null
    }
  }
}
