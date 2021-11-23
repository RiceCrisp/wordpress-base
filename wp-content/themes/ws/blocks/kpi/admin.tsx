import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'

declare const wp: any

const {
  InspectorControls,
  RichText,
  useBlockProps,
  __experimentalColorGradientControl: ColorGradientControl
} = wp.blockEditor
const { PanelBody, CheckboxControl } = wp.components
const { __ } = wp.i18n

export const kpi = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M18.8292 5.66459L20.1708 6.33541L16.1708 14.3354L14.8292 13.6646L18.8292 5.66459ZM13.4697 14.5303L9.46967 10.5303L10.5303 9.46967L14.5303 13.4697L13.4697 14.5303ZM9.17082 10.3354L5.17082 18.3354L3.82918 17.6646L7.82918 9.66459L9.17082 10.3354Z"/>
        <path d="M4 19.8C4.44183 19.8 4.8 19.4418 4.8 19C4.8 18.5582 4.44183 18.2 4 18.2C3.55817 18.2 3.2 18.5582 3.2 19C3.2 19.4418 3.55817 19.8 4 19.8ZM4 21C5.10457 21 6 20.1046 6 19C6 17.8954 5.10457 17 4 17C2.89543 17 2 17.8954 2 19C2 20.1046 2.89543 21 4 21Z"/>
        <path d="M9 9.8C9.44183 9.8 9.8 9.44183 9.8 9C9.8 8.55817 9.44183 8.2 9 8.2C8.55817 8.2 8.2 8.55817 8.2 9C8.2 9.44183 8.55817 9.8 9 9.8ZM9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z"/>
        <path d="M15 15.8C15.4418 15.8 15.8 15.4418 15.8 15C15.8 14.5582 15.4418 14.2 15 14.2C14.5582 14.2 14.2 14.5582 14.2 15C14.2 15.4418 14.5582 15.8 15 15.8ZM15 17C16.1046 17 17 16.1046 17 15C17 13.8954 16.1046 13 15 13C13.8954 13 13 13.8954 13 15C13 16.1046 13.8954 17 15 17Z"/>
        <path d="M20 5.8C20.4418 5.8 20.8 5.44183 20.8 5C20.8 4.55817 20.4418 4.2 20 4.2C19.5582 4.2 19.2 4.55817 19.2 5C19.2 5.44183 19.5582 5.8 20 5.8ZM20 7C21.1046 7 22 6.10457 22 5C22 3.89543 21.1046 3 20 3C18.8954 3 18 3.89543 18 5C18 6.10457 18.8954 7 20 7Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const {
        value,
        label,
        kpiColor,
        animate
      } = props.attributes
      const blockProps = useBlockProps()
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('KPI Options', 'ws') }
            >
              <ColorGradientControl
                label={ __('KPI Color', 'ws') }
                onColorChange={ (newValue: string) => setAttributes({ kpiColor: newValue }) }
                colorValue={ kpiColor }
              />
              <CheckboxControl
                label={ __('Counting Animation', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ animate: newValue }) }
                checked={ animate }
              />
            </PanelBody>
          </InspectorControls>
          <div { ...blockProps }>
            <RichText
              placeholder={ __('??', 'ws') }
              style={ { color: kpiColor } }
              multiline={ false }
              className="kpi-value"
              onChange={ (newValue: string) => setAttributes({ value: newValue }) }
              value={ value }
            />
            <RichText
              placeholder={ __('KPI Label', 'ws') }
              multiline={ false }
              className="kpi-label"
              onChange={ (newValue: string) => setAttributes({ label: newValue }) }
              value={ label }
            />
          </div>
        </>
      )
    },
    save: () => {
      return null
    }
  }
}
