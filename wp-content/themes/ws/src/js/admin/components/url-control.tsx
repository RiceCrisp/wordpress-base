import React from 'react'

declare const wp: any

const { TextControl, ToggleControl } = wp.components
const { __ } = wp.i18n

type UrlObj = {
  url: string,
  opensInNewTab: boolean
}

type ComponentProps = {
  onChange: (arg: UrlObj) => void,
  value: UrlObj
}

export function URLControl(props: ComponentProps) {
  const {
    onChange,
    value
  } = props
  return (
    <div className="components-url-control">
      <TextControl
        label={ __('Link URL', 'ws') }
        onChange={ (newValue: string) => onChange({ ...value, url: newValue }) }
        value={ value.url }
      />
      <ToggleControl
        label={ __('Open in new tab', 'ws') }
        onChange={ (newValue: boolean) => onChange({ ...value, opensInNewTab: newValue }) }
        checked={ value.opensInNewTab }
      />
    </div>
  )
}
