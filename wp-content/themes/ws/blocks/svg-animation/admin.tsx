import React, { useEffect, useRef } from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import lottie from 'lottie-web/build/player/lottie'

declare const wp: any

const { BlockControls, InspectorControls, useBlockProps } = wp.blockEditor
const {
  Button,
  FormFileUpload,
  PanelBody,
  Placeholder,
  ToggleControl,
  ToolbarGroup
} = wp.components
const { __ } = wp.i18n

export const svgAnimation = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M17 8.8C17.9941 8.8 18.8 7.99411 18.8 7C18.8 6.00589 17.9941 5.2 17 5.2C16.0059 5.2 15.2 6.00589 15.2 7C15.2 7.99411 16.0059 8.8 17 8.8ZM17 10C18.6569 10 20 8.65685 20 7C20 5.34315 18.6569 4 17 4C15.3431 4 14 5.34315 14 7C14 8.65685 15.3431 10 17 10Z"/>
        <path d="M9.52026 8.71679C10.3181 7.42023 11.4467 6.4 13 6.4V7.6C12.0533 7.6 11.2444 8.20477 10.5422 9.34571C9.84273 10.4824 9.32922 12.0334 8.95963 13.6349C8.59217 15.2272 8.37664 16.8257 8.25312 18.03C8.19147 18.6311 8.15298 19.1315 8.12995 19.4809C8.11844 19.6555 8.11079 19.7922 8.10605 19.8847C8.10368 19.931 8.10203 19.9662 8.10099 19.9895L8.09986 20.0155L8.09961 20.0216L8.09956 20.0229L8.09805 20.0231L6.90324 20.0374C6.90118 20.0375 6.90118 20.0375 6.90118 20.0376L6.90091 20.0334L6.89988 20.0181L6.89533 19.955C6.89114 19.8991 6.88453 19.816 6.87503 19.7096C6.85603 19.4968 6.82551 19.1914 6.77963 18.8244C6.68763 18.0884 6.53505 17.1141 6.29291 16.1455C6.04856 15.1681 5.72319 14.2392 5.3037 13.568C4.87869 12.888 4.44359 12.6 4 12.6V11.4C5.05641 11.4 5.80881 12.112 6.3213 12.932C6.78394 13.6722 7.12225 14.6057 7.3714 15.5253C7.4834 14.8302 7.62118 14.0982 7.79037 13.3651C8.17078 11.7166 8.71977 10.0176 9.52026 8.71679Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { json, loop } = props.attributes
      const animationElement = useRef<HTMLDivElement>(null)
      useEffect(() => {
        if (json && animationElement.current) {
          // useRef is null on first render and it's difficult to assign a callback so we just use setTimeout to wait for the second render
          setTimeout(() => {
            if (animationElement.current) {
              lottie.loadAnimation({
                container: animationElement.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: JSON.parse(json)
              })
            }
          }, 0)
        }
      }, [json])
      const blockProps = useBlockProps()
      return (
        <div { ...blockProps }>
          { json ? (
            <>
              <InspectorControls>
                <PanelBody
                  title={ __('SVG Animation Options', 'ws') }
                >
                  <ToggleControl
                    label={ __('Loop', 'ws') }
                    onChange={ (newValue: boolean) => setAttributes({ loop: newValue }) }
                    checked={ loop }
                  />
                </PanelBody>
              </InspectorControls>
              <BlockControls>
                <ToolbarGroup>
                  <Button
                    className="components-toolbar__control"
                    label={ __('Remove Animation', 'ws') }
                    icon="trash"
                    onClick={ () => setAttributes({ json: '' }) }
                  />
                </ToolbarGroup>
              </BlockControls>
              <div
                className="svg-animation"
                ref={ animationElement }
              ></div>
            </>
          ) : (
            <Placeholder
              icon="marker"
              label={ __('SVG Animation', 'ws') }
              instructions={ __('Import the JSON file from your lottie animation.', 'ws') }
            >
              <FormFileUpload
                isPrimary
                accept=".json"
                onChange={ (e: Event & { target: HTMLInputElement & EventTarget }) => {
                  const reader = new FileReader()
                  reader.onload = () => {
                    try {
                      const result = reader.result
                      if (typeof result === 'string') {
                        setAttributes({ json: result.replace(/[\n\t\r]+/g, '') })
                      }
                    }
                    catch (err) {
                      console.error(err)
                    }
                  }
                  if (e.target.files?.length) {
                    reader.readAsText(e.target.files[0])
                  }
                } }
              >
                Upload JSON
              </FormFileUpload>
            </Placeholder>
          ) }
        </div>
      )
    },
    save: () => {
      return (
        null
      )
    }
  }
}
