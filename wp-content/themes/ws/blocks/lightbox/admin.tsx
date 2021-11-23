import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import metadata from './block.json'
import { Props } from '@ws/types'
import { MediaPreview, MediaSelect } from '@ws/components'

declare const wp: any

const {
  BlockControls,
  InnerBlocks,
  InspectorControls,
  RichText,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const {
  PanelBody, SelectControl, ToolbarButton, ToolbarGroup
} = wp.components
const { __ } = wp.i18n

export const lightbox = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M19.8 4.2H4.2V19.8H19.8V4.2ZM3 3V21H21V3H3Z"/>
        <path d="M5.5 5.5H9V6.5H7.20711L9.35355 8.64645L8.64645 9.35355L6.5 7.20711V9H5.5V5.5ZM15 5.5H18.5V9H17.5V7.20711L15.3536 9.35355L14.6464 8.64645L16.7929 6.5H15V5.5ZM9.35355 15.3536L7.20711 17.5H9V18.5H5.5V15H6.5V16.7929L8.64645 14.6464L9.35355 15.3536ZM15.3536 14.6464L17.5 16.7929V15H18.5V18.5H15V17.5H16.7929L14.6464 15.3536L15.3536 14.6464Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const {
        variation, buttonText, preview, width
      } = props.attributes
      const [showLightbox, setLightbox] = useState(false)
      const blockProps = useBlockProps({
        className: `variation-${variation}`
      })
      const innerBlocksProps = useInnerBlocksProps()
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Lightbox Options', 'ws') }
            >
              <SelectControl
                label={ __('Lightbox Width', 'ws') }
                options={ [
                  { label: 'Default', value: 'default' },
                  { label: 'Narrow', value: 'narrow' },
                  { label: 'Narrower', value: 'narrower' },
                  { label: 'Narrowest', value: 'narrowest' }
                ] }
                onChange={ (newValue: string) => setAttributes({ width: newValue }) }
                value={ width }
              />
              <MediaSelect
                label={ __('Preview Image', 'ws') }
                onChange={ ({ id }: { id: number }) => setAttributes({ preview: id }) }
                id={ preview }
              />
            </PanelBody>
          </InspectorControls>
          <BlockControls>
            <ToolbarGroup>
              <ToolbarButton
                onClick={ () => setLightbox(true) }
              >
                { __('Edit Lightbox', 'ws') }
              </ToolbarButton>
            </ToolbarGroup>
          </BlockControls>
          <div { ...blockProps }>
            { variation === 'button' ? (
              <button
                className="lightbox-button"
                onClick={ e => e.preventDefault() }
              >
                <RichText
                  placeholder="Button Text"
                  onChange={ (newValue: string) => setAttributes({ buttonText: newValue }) }
                  value={ buttonText }
                />
              </button>
            ) : (
              <>
                <MediaPreview
                  id={ preview }
                  size="full"
                />
                <div className="lightbox-button">
                  <div className="lightbox-button-icon">
                    <svg viewBox="0 0 24 24" fillRule="evenodd"><path d="M5 2 L22 12 L5 22 Z"/></svg>
                  </div>
                </div>
              </>
            ) }
            { showLightbox && (
              <MyModal
                { ...innerBlocksProps }
                onClose={ () => setLightbox(false) }
                width={ width }
              />
            ) }
          </div>
        </>
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  variations: [
    {
      name: 'video-lightbox-button',
      isDefault: true,
      title: __('Button', 'ws'),
      scope: ['transform'],
      attributes: {
        variation: 'button'
      }
    },
    {
      name: 'video-lightbox-preview',
      title: __('Image Preview', 'ws'),
      scope: ['transform'],
      attributes: {
        variation: 'preview'
      }
    }
  ]
}

type ModalProps = {
  width: string,
  onClose: () => void
}

function MyModal(props: ModalProps) {
  const {
    width,
    onClose
  } = props
  const el = document.querySelector<HTMLElement>('.block-editor-block-list__layout')
  if (el) {
    return createPortal(
      <div className={ `lightbox width-${width}` }>
        <div className="container">
          <div className="row">
            <div className="lightbox-inner">
              <button
                className="lightbox-close"
                onClick={ () => onClose() }
              >
                <svg viewBox="0 0 24 24" fillRule="evenodd">
                  <title>Close</title>
                  <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/>
                </svg>
              </button>
              <div className="lightbox-content" { ...props } />
            </div>
          </div>
        </div>
      </div>,
      el
    )
  }
  return null
}
