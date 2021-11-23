import React from 'react'
import metadata from './block.json'
import { Props, Location } from '@ws/types'
import { LocationPicker } from '@ws/components'

declare const wp: any

const { InspectorControls, useBlockProps } = wp.blockEditor
const { PanelBody, TextareaControl } = wp.components
const { __ } = wp.i18n

export const googleMap = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M12.8094 21.0467L17.6103 13.75C17.9103 13.2631 18.1742 12.7547 18.3999 12.2289C18.7548 11.3702 18.9579 10.456 19 9.52732C18.9979 7.66557 18.2604 5.88056 16.9491 4.56336C15.6377 3.24617 13.8595 2.50419 12.0039 2.5C10.147 2.5021 8.36676 3.24315 7.05372 4.56057C5.74067 5.87799 5.00209 7.6642 5 9.52732C5.05465 10.4584 5.2711 11.3727 5.63959 12.2289C5.86526 12.7547 6.12918 13.2631 6.42922 13.75L11.2301 21.0467C11.311 21.1847 11.4264 21.2992 11.5649 21.3787C11.7034 21.4582 11.8602 21.5 12.0197 21.5C12.1793 21.5 12.3361 21.4582 12.4746 21.3787C12.6131 21.2992 12.7285 21.1847 12.8094 21.0467ZM7.69498 12.9448L12.0197 19.5178L16.3445 12.9448C16.5996 12.5289 16.8245 12.0951 17.0174 11.6467C17.2992 10.9622 17.4623 10.2342 17.4999 9.49445C17.4892 8.04054 16.9093 6.64949 15.8861 5.62166C14.8555 4.58645 13.4592 4.00396 12.0031 4C10.5459 4.00232 9.14808 4.58408 8.11614 5.61946C7.09387 6.64514 6.51345 8.03314 6.50023 9.48453C6.5489 10.2261 6.72383 10.9537 7.01742 11.636L7.018 11.6373C7.21188 12.089 7.43814 12.526 7.69498 12.9448Z"/>
        <path d="M12 11.5C13.1046 11.5 14 10.6046 14 9.5C14 8.39543 13.1046 7.5 12 7.5C10.8954 7.5 10 8.39543 10 9.5C10 10.6046 10.8954 11.5 12 11.5ZM12 13C13.933 13 15.5 11.433 15.5 9.5C15.5 7.567 13.933 6 12 6C10.067 6 8.5 7.567 8.5 9.5C8.5 11.433 10.067 13 12 13Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { location, styles } = props.attributes
      const blockProps = useBlockProps()
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Google Map Options', 'ws') }
            >
              <TextareaControl
                label={ __('JSON Styles', 'ws') }
                onChange={ (newValue: string) => setAttributes({ styles: newValue }) }
                value={ styles }
                help={ <>Overrides <a href="/wp-admin/options-general.php?page=site_options" target="_blank">global styles</a></> }
              />
            </PanelBody>
          </InspectorControls>
          <div { ...blockProps }>
            <LocationPicker
              styles={ styles }
              onChange={ (newValue: Location) => setAttributes({ location: newValue }) }
              location={ location }
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
