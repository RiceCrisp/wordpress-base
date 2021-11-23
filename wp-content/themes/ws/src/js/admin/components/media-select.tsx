import React, { useEffect, useState } from 'react'
import { Select } from '@ws/types'

declare const wp: any

const { MediaUpload } = wp.blockEditor
const {
  BaseControl,
  Button,
  FocalPointPicker,
  Spinner
} = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

type ComponentProps = {
  allowedTypes?: string[],
  buttonText?: string,
  className?: string,
  clearText?: string,
  fallback?: any,
  focalPoint?: { x: string, y: string },
  label?: string,
  posterImage?: number,
  size?: string,
  id: number,
  onChange: (arg: any) => void
}

// MediaUploadCheck doesn't work outside of posts, so we do our own permissions check
function CanUpload(props: Record<string, any>) {
  const {
    fallback = null
  } = props
  const canUpload = useSelect((select: Select) => {
    return select('core').canUser('create', 'media')
  })
  return canUpload ? props.children : fallback
}

export function MediaSelect(props: ComponentProps) {
  const {
    allowedTypes = [],
    buttonText = __('Select Image', 'ws'),
    className = '',
    clearText = __('Clear Media', '_ws'),
    fallback = null,
    focalPoint,
    label,
    posterImage,
    size,
    id,
    onChange
  } = props
  const [mediaObject, setMediaObject] = useState<Record<string, any> | null>(null)
  const [view, setView] = useState('loading')
  useEffect(() => {
    if (id) {
      setView('loading')
      wp.media.attachment(id).fetch()
        .then((data: any) => {
          setMediaObject(data)
          setView('preview')
        })
        .fail(() => {
          setMediaObject(null)
          setView('select')
        })
    }
    else {
      setMediaObject(null)
      setView('select')
    }
  }, [id])
  const attributes = {
    id: id,
    focalPoint: focalPoint || {
      x: '0.5',
      y: '0.5'
    },
    posterImage: posterImage
  }
  const component = []
  switch (view) {
    case 'loading': {
      component.push(
        <Spinner />
      )
      break
    }
    case 'select': {
      component.push(
        <CanUpload
          fallback={ fallback }
        >
          <MediaUpload
            onSelect={ (newValue: Record<string, any>) => onChange({ ...attributes, id: newValue.id }) }
            allowedTypes={ allowedTypes }
            render={ ({ open }: any) => (
              <Button
                isSecondary
                className="media-selector-button"
                onClick={ open }
              >
                { buttonText }
              </Button>
            ) }
          />
        </CanUpload>
      )
      break
    }
    case 'preview': {
      let url = mediaObject?.url
      switch (mediaObject?.type) {
        case 'image': {
          const dimensions = {
            width: mediaObject.width,
            height: mediaObject.height
          }
          if (size && mediaObject.sizes[size]) {
            url = mediaObject.sizes[size].url
            dimensions.width = mediaObject.sizes[size].width
            dimensions.height = mediaObject.sizes[size].height
          }
          if (focalPoint) {
            component.push(
              <FocalPointPicker
                url={ url }
                dimensions={ dimensions }
                onChange={ (newValue: { x: string, y: string }) => {
                  onChange({
                    ...attributes,
                    focalPoint: {
                      x: String(newValue.x),
                      y: String(newValue.y)
                    }
                  })
                } }
                value={ focalPoint }
              />
            )
          }
          else {
            component.push(
              <img src={ url } alt={ mediaObject.alt } />
            )
          }
          break
        }
        case 'video': {
          component.push(
            <>
              <span className="file-name">{ url.replace(/^.*[/]/, '') }</span>
              <MediaSelect
                buttonText={ __('Select Poster Image', 'ws') }
                clearText={ __('Remove Poster Image', 'ws') }
                onChange={ ({ id }: { id: number }) => onChange({ ...attributes, posterImage: id }) }
                allowedTypes={ ['image'] }
                id={ posterImage || 0 }
              />
            </>
          )
          break
        }
        default: {
          component.push(
            <span className="file-name">{ mediaObject ? __('File Not Found', '_ws') : url.replace(/^.*[/]/, '') }</span>
          )
          break
        }
      }
      component.push(
        <div className="clear-media-button">
          <Button
            isSecondary
            isSmall
            onClick={ () => {
              onChange({
                id: null,
                focalPoint: {
                  x: '0.5',
                  y: '0.5'
                },
                posterImage: null
              })
              setView('select')
              setMediaObject(null)
            } }
          >
            { clearText }
          </Button>
        </div>
      )
      break
    }
  }
  return (
    <>
      { label ? (
        <BaseControl
          label={ label }
          className={ `components-media-select ${className}` }
        >
          { component }
        </BaseControl>
      ) : (
        <div
          className={ `components-media-select ${className}` }
        >
          { component }
        </div>
      ) }
    </>
  )
}
