import React from 'react'

declare const wp: any

const { RichTextToolbarButton } = wp.blockEditor
const { __ } = wp.i18n
const { toggleFormat } = wp.richText

type FormatProps = {
  isActive: boolean,
  onChange: (args: any) => void,
  value: string
}

const formatLabel = {
  name: 'ws/format-label',
  args: {
    title: __('Label', 'ws'),
    tagName: 'span',
    className: 'is-style-label',
    edit: (props: FormatProps) => {
      const {
        isActive,
        onChange,
        value
      } = props
      return (
        <RichTextToolbarButton
          title={ __('Label', 'ws') }
          icon={ <svg viewBox="0 0 24 24"><path d="M10.3,4.5l8.5,8.5L13,18.9l-8.5-8.5V4.5C4.5,4.5,10.3,4.5,10.3,4.5z M11,3H3v8l10,10l8-8L11,3z M8.6,8.6  C8,9.1,7,9.1,6.4,8.6C5.9,8,5.9,7,6.4,6.4C7,5.9,8,5.9,8.6,6.4C9.1,7,9.1,8,8.6,8.6z"/></svg> }
          onClick={ () => onChange(toggleFormat(
            value,
            { type: 'ws/format-label' }
          )) }
          isActive={ isActive }
        />
      )
    }
  }
}

const formatSmall = {
  name: 'ws/format-small',
  args: {
    title: __('Small', 'ws'),
    tagName: 'small',
    className: null,
    edit: (props: FormatProps) => {
      const {
        isActive,
        onChange,
        value
      } = props
      return (
        <RichTextToolbarButton
          title={ __('Small', 'ws') }
          icon={ <svg viewBox="0 0 20 20"><path d="M11.3,5v1.8h-3V15H6.2V6.7h-3V5H11.3z"/><path d="M16.9,8.6v1.1h-1.9V15h-1.4V9.7h-1.9V8.6H16.9z"/></svg> }
          onClick={ () => onChange(toggleFormat(
            value,
            { type: 'ws/format-small' }
          )) }
          isActive={ isActive }
        />
      )
    }
  }
}

export { formatLabel, formatSmall }
