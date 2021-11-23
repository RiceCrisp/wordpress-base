import React from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { MediaSelect } from '@ws/components'

declare const wp: any

const { RichText, useBlockProps } = wp.blockEditor
const { __ } = wp.i18n

export const testimonial = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M9.75 17.6L12 21L14.25 17.6H18.75C19.875 17.6 21 16.4667 21 15.3333V6.26667C21 5.13333 19.875 4 18.75 4H5.25C4.125 4 3 5.13333 3 6.26667V15.3333C3 16.4667 4.125 17.6 5.25 17.6H9.75ZM12 18.8256L13.6052 16.4H18.75C18.9191 16.4 19.1909 16.3025 19.4452 16.0463C19.699 15.7906 19.8 15.5128 19.8 15.3333V6.26667C19.8 6.08716 19.699 5.80943 19.4452 5.55372C19.1909 5.29747 18.9191 5.2 18.75 5.2H5.25C5.08092 5.2 4.80914 5.29747 4.55478 5.55372C4.30096 5.80943 4.2 6.08716 4.2 6.26667V15.3333C4.2 15.5128 4.30096 15.7906 4.55478 16.0463C4.80914 16.3025 5.08092 16.4 5.25 16.4H10.3948L12 18.8256Z"/>
        <path d="M12 7.98689L11.3364 9.12619C11.1386 9.46583 10.8071 9.70667 10.423 9.78986L9.13436 10.0689L10.0128 11.0521C10.2747 11.3452 10.4013 11.7348 10.3618 12.1259L10.2289 13.4377L11.4355 12.906C11.7951 12.7475 12.2049 12.7475 12.5645 12.906L13.7711 13.4377L13.6382 12.1259C13.5987 11.7348 13.7253 11.3452 13.9872 11.0521L14.8656 10.0689L13.577 9.78986C13.1929 9.70667 12.8614 9.46583 12.6636 9.12619L12 7.98689ZM12.3456 6.59344C12.1914 6.32853 11.8086 6.32853 11.6544 6.59344L10.4723 8.62289C10.4158 8.71993 10.3211 8.78874 10.2113 8.81251L7.91592 9.30957C7.6163 9.37445 7.49804 9.73842 7.7023 9.96702L9.26715 11.7184C9.34197 11.8021 9.37815 11.9134 9.36684 12.0252L9.13025 14.3618C9.09937 14.6668 9.40898 14.8918 9.68952 14.7682L11.8387 13.8211C11.9415 13.7758 12.0585 13.7758 12.1613 13.8211L14.3105 14.7682C14.591 14.8918 14.9006 14.6668 14.8697 14.3618L14.6332 12.0252C14.6218 11.9134 14.658 11.8021 14.7329 11.7184L16.2977 9.96702C16.502 9.73842 16.3837 9.37445 16.0841 9.30957L13.7887 8.81251C13.6789 8.78874 13.5842 8.71993 13.5277 8.62289L12.3456 6.59344Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { image, quote, citation } = props.attributes
      const blockProps = useBlockProps()
      return (
        <div { ...blockProps }>
          <MediaSelect
            buttonText={ __('Logo', 'ws') }
            className="quote-image"
            size="logo"
            onChange={ ({ id }: { id: number }) => setAttributes({ image: id }) }
            id={ image }
          />
          <RichText
            placeholder={ __('Quote', 'ws') }
            keepPlaceholderOnFocus={ true }
            className="quote"
            onChange={ (newValue: string) => setAttributes({ quote: newValue }) }
            value={ quote }
          />
          <RichText
            placeholder={ __('Citation', 'ws') }
            keepPlaceholderOnFocus={ true }
            className="citation"
            onChange={ (newValue: string) => setAttributes({ citation: newValue }) }
            value={ citation }
          />
        </div>
      )
    },
    save: () => {
      return null
    }
  }
}
