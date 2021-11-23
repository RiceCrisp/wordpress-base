import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { Background, MediaPreview, MediaSelect } from '@ws/components'
import classnames from 'classnames'

declare const wp: any

const {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { PanelBody, SelectControl, ToggleControl } = wp.components
const { __ } = wp.i18n

export const card = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M19 4.5H5C4.72386 4.5 4.5 4.72386 4.5 5V17.5C4.5 17.7761 4.72386 18 5 18H19C19.2761 18 19.5 17.7761 19.5 17.5V5C19.5 4.72386 19.2761 4.5 19 4.5ZM5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5Z" />
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const {
        clickable,
        padding,
        image,
        imageX,
        imageY,
        imagePosition
      } = props.attributes
      const blockProps = useBlockProps({
        className: classnames({
          'has-background': props.attributes.backgroundMedia
        })
      })
      const innerBlocksProps = useInnerBlocksProps({
        className: 'card-body'
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Card Options', 'ws') }
            >
              <ToggleControl
                label={ __('Whole Card Clickable', 'ws') }
                help={ __('Card must contain link.', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ clickable: newValue }) }
                checked={ clickable }
              />
              <ToggleControl
                label={ __('Extra Padding', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ padding: newValue }) }
                checked={ padding }
              />
              <MediaSelect
                label={ __('Image', 'ws') }
                onChange={ ({ id, focalPoint }: { id: number, focalPoint: { x: string, y: string } }) => {
                  setAttributes({
                    image: id,
                    imageX: focalPoint.x,
                    imageY: focalPoint.y
                  })
                } }
                id={ image }
                focalPoint={ {
                  x: imageX,
                  y: imageY
                } }
              />
              { !!image && (
                <SelectControl
                  label={ __('Image Position', 'ws') }
                  options={ [
                    { value: 'top', label: 'Top' },
                    { value: 'right', label: 'Right' },
                    { value: 'left', label: 'Left' }
                  ] }
                  onChange={ (newValue: string) => setAttributes({ imagePosition: newValue }) }
                  value={ imagePosition }
                />
              ) }
            </PanelBody>
          </InspectorControls>
          <div
            { ...blockProps }
            className={ blockProps.className.replace(/has-[^-]+?-background-color/, '') }
            style={ { ...blockProps.style, backgroundColor: '' } }
          >
            <div className={ classnames('card', {
              'extra-padding': padding,
              [`image-${imagePosition}`]: imagePosition
            }) }>
              <Background { ...props } />
              <MediaPreview
                id={ image }
                className="card-image"
                x={ imageX }
                y={ imageY }
                size="large"
              />
              <div { ...innerBlocksProps } />
            </div>
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
