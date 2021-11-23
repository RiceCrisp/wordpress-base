import React, { useEffect, useState } from 'react'
import { Props } from '@ws/types'
import { MediaSelect } from '@ws/components'

declare const wp: any

const { InspectorControls } = wp.blockEditor
const { hasBlockSupport } = wp.blocks
const { PanelBody, SelectControl, ToggleControl } = wp.components
const { __ } = wp.i18n

export function Background(props: Props) {
  const { setAttributes } = props
  const {
    backgroundColor,
    backgroundMedia,
    backgroundVideoPoster,
    backgroundX,
    backgroundY,
    backgroundSize,
    backgroundOverlay,
    backgroundParallax,
    gradient: backgroundGradient,
    style = { color: '' }
  } = props.attributes
  const customBackgroundColor = style.color ? style.color.background : null
  const customBackgroundGradient = style.color ? style.color.gradient : null
  const classes = ['block-background']
  const styles: Record<string, any> = {}
  if (backgroundColor || customBackgroundColor) {
    classes.push('has-background-color')
    if (backgroundColor) {
      classes.push(`has-${backgroundColor}-background-color`)
    }
    if (customBackgroundColor) {
      styles.backgroundColor = customBackgroundColor
    }
  }
  if (backgroundGradient || customBackgroundGradient) {
    classes.push('has-background-gradient')
    if (backgroundGradient) {
      classes.push(`has-${backgroundGradient}-gradient-background`)
    }
    if (customBackgroundGradient) {
      styles.background = customBackgroundGradient
    }
  }
  const mediaClasses = ['block-background-media']
  if (backgroundSize) {
    classes.push(`has-${backgroundSize}-background-size`)
  }
  if (backgroundOverlay) {
    classes.push('has-background-overlay')
  }
  if (backgroundParallax) {
    mediaClasses.push('parallax-bg')
  }
  const [mediaObject, setMediaObject] = useState<Record<string, any> | null>(null)
  useEffect(() => {
    if (backgroundMedia) {
      wp.media.attachment(backgroundMedia).fetch()
        .then((data: any) => {
          setMediaObject(data)
        })
        .fail(() => {
          setMediaObject(null)
        })
    }
  }, [backgroundMedia])
  return (
    <>
      { hasBlockSupport(props.name, 'backgroundMedia') && (
        <InspectorControls>
          <PanelBody
            title={ __('Background Media Settings', 'ws') }
          >
            <MediaSelect
              label={ __('Background Image/Video', 'ws') }
              buttonText={ __('Select Background Image/Video', 'ws') }
              onChange={ ({ id, focalPoint, posterImage }: { id: number, focalPoint: { x: string, y: string }, posterImage: number}) => {
                setAttributes({
                  backgroundMedia: id,
                  backgroundX: focalPoint.x,
                  backgroundY: focalPoint.y,
                  backgroundVideoPoster: posterImage
                })
              } }
              id={ backgroundMedia }
              focalPoint={ {
                x: backgroundX,
                y: backgroundY
              } }
              posterImage={ backgroundVideoPoster }
            />
            { backgroundMedia && (
              <>
                <SelectControl
                  label={ __('Image/Video Position', 'ws') }
                  options={ [
                    { label: 'Cover', value: 'cover' },
                    { label: 'Contain', value: 'contain' },
                    { label: 'Left Half', value: 'left-half' },
                    { label: 'Right Half', value: 'right-half' }
                  ] }
                  onChange={ (newValue: string) => setAttributes({ backgroundSize: newValue }) }
                  value={ backgroundSize }
                />
                <ToggleControl
                  label={ __('Overlay', 'ws') }
                  onChange={ (newValue: boolean) => setAttributes({ backgroundOverlay: newValue }) }
                  checked={ backgroundOverlay }
                />
                <ToggleControl
                  label={ __('Parallax', 'ws') }
                  onChange={ (newValue: boolean) => setAttributes({ backgroundParallax: newValue }) }
                  checked={ backgroundParallax }
                />
              </>
            ) }
          </PanelBody>
        </InspectorControls>
      ) }
      <div className={ classes.join(' ') } style={ styles }>
        { !!backgroundMedia && (
          <div
            className={ mediaClasses.join(' ') }
            style={ {
              backgroundImage: mediaObject?.url ? `url(${mediaObject.url})` : '',
              backgroundPosition: backgroundX && backgroundY ? `${backgroundX * 100}% ${backgroundY * 100}%` : ''
            } }
          ></div>
        ) }
      </div>
    </>
  )
}
