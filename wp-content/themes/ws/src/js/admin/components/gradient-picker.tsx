import React from 'react'
import { Gradient } from '@ws/types'

declare const wp: any

const {
  BaseControl,
  Button,
  Dashicon,
  Tooltip
} = wp.components
const { __ } = wp.i18n

type ComponentProps = {
  gradients: Gradient[],
  label?: string,
  onChange: (arg: string) => void,
  value: string
}

export function GradientPicker(props: ComponentProps) {
  const {
    gradients,
    label = __('Select a Gradient', 'ws'),
    onChange,
    value
  } = props
  return (
    <BaseControl
      className="editor-color-palette-control components-gradient-picker"
      label={ label }
    >
      <div className="components-circular-option-picker">
        { gradients && gradients.map(gradient => {
          return (
            <Tooltip
              key={ gradient.slug }
              text={ gradient.name }
            >
              <div className="components-circular-option-picker__option-wrapper">
                <button
                  type="button"
                  className={ `components-circular-option-picker__option ${value === gradient.slug ? 'is-pressed' : ''}` }
                  style={ { backgroundImage: gradient.gradient } }
                  onClick={ () => {
                    if (value === gradient.slug) {
                      onChange('')
                    }
                    else {
                      onChange(gradient.slug)
                    }
                  } }
                  aria-label={ gradient.name }
                  aria-pressed={ value === gradient.slug }
                />
                { value === gradient.slug && <Dashicon size={ 24 } icon="saved" /> }
              </div>
            </Tooltip>
          )
        }) }
        <div className="components-circular-option-picker__custom-clear-wrapper">
          <Button
            isSecondary
            isSmall
            onClick={ () => onChange('') }
          >
            Clear
          </Button>
        </div>
      </div>
    </BaseControl>
  )
}
