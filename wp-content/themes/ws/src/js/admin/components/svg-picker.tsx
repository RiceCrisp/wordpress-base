import React, { useState } from 'react'
import theme from '@ws/theme'
import { SVG } from '@ws/types'
import { SVGPreview } from '@ws/components'

declare const wp: any

const apiFetch = wp.apiFetch
const { Button, Dropdown, ExternalLink } = wp.components
const { __ } = wp.i18n

type ComponentProps = {
  className?: string,
  onChange?: (id: string) => void,
  style?: Record<string, any>,
  value: string
}

export function SVGPicker(props: ComponentProps) {
  const {
    className = '',
    onChange,
    style,
    value
  } = props

  if (style?.color && !style.color.startsWith('#')) {
    const colorObj = theme.settings.color.palette.find(color => color.slug === style.color)
    if (colorObj) {
      style.color = colorObj.color
    }
  }
  if (style?.backgroundColor && !style.backgroundColor.startsWith('#')) {
    const colorObj = theme.settings.color.palette.find(color => color.slug === style.backgroundColor)
    if (colorObj) {
      style.backgroundColor = colorObj.color
    }
  }
  if (style?.backgroundImage && !style.backgroundImage.startsWith('linear-gradient')) {
    const gradientObj = theme.settings.color.gradients.find(gradient => gradient.slug === style.backgroundImage)
    if (gradientObj) {
      style.backgroundImage = gradientObj.gradient
    }
  }

  const [icon, setIcon] = useState<string>(value)
  const [icons, setIcons] = useState<boolean | []>([])

  return (
    <Dropdown
      { ...props }
      className={ `components-svg-picker ${props.className}` }
      renderToggle={ ({ isOpen, onToggle }: { isOpen: boolean, onToggle: () => void }) => (
        <Button
          isSecondary
          style={ style }
          className={ `icon-svg ${className} ${style && style.color ? 'has-color' : ''} ${style && (style.backgroundColor || style.backgroundImage) ? 'has-background' : ''} ${icon ? 'has-icon' : ''}` }
          onClick={ () => onToggle() }
          aria-expanded={ isOpen }
        >
          { icon ? (
            <SVGPreview
              id={ icon }
            />
          ) : (
            <>
              { __('Select Icon', 'ws') }
            </>
          ) }
        </Button>
      ) }
      onToggle={ (isOpen: boolean) => {
        if (isOpen && !icons) {
          apiFetch({ path: '/ws/svgs/' })
            .then((res: any) => {
              setIcons(res || [])
            })
            .catch((err: string) => {
              setIcons([])
              console.error('error', err)
            })
        }
      } }
      renderContent={ ({ onClose }: { onClose: () => void }) => {
        return (
          <div className="svg-select">
            <Button
              className={ !value ? 'selected' : '' }
              onClick={ () => {
                if (onChange) {
                  onChange('')
                }
                setIcon('')
                onClose()
              } }
            >
              <svg
                viewBox="0 0 24 24"
                fillRule="evenodd"
              >
                <text x="6" y="10" style={ { font: '10px sans-serif' } }>No</text>
                <text x="3" y="21" style={ { font: '10px sans-serif' } }>Icon</text>
              </svg>
            </Button>
            { Array.isArray(icons) && icons.map((i: SVG) => {
              return (
                <Button
                  key={ i.id }
                  className={ value === i.id ? 'selected' : '' }
                  title={ i.id }
                  onClick={ () => {
                    if (onChange) {
                      onChange(i.id)
                    }
                    setIcon(i.id)
                    onClose()
                  } }
                >
                  <svg
                    viewBox={ i.viewbox }
                    fillRule="evenodd"
                    dangerouslySetInnerHTML={ { __html: i.path } }
                  >
                  </svg>
                </Button>
              )
            }) }
            <div className="svg-manager-link">
              <ExternalLink
                href="/wp-admin/options-general.php?page=svg"
              >
                { __('SVG Manager', 'ws') }
              </ExternalLink>
            </div>
          </div>
        )
      } }
    />
  )
}
