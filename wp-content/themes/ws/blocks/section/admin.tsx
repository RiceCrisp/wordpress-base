import React, { useEffect } from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'
import { Background } from '@ws/components'
import classnames from 'classnames'

declare const wp: any

const {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { PanelBody, SelectControl, ToggleControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const section = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M8 8H16V16H8V8Z"/>
        <path d="M11.1 4.2H7.5V3H11.1V4.2Z"/>
        <path d="M12.9 4.2H16.5V3H12.9V4.2Z"/>
        <path d="M18.3 3V4.2H19.8V5.7H21V3H18.3Z"/>
        <path d="M19.8 11.1V7.5H21V11.1H19.8Z"/>
        <path d="M19.8 12.9V16.5H21V12.9H19.8Z"/>
        <path d="M21 18.3H19.8V19.8H18.3V21H21V18.3Z"/>
        <path d="M16.5 21V19.8H12.9V21H16.5Z"/>
        <path d="M11.1 21V19.8H7.5V21H11.1Z"/>
        <path d="M4.2 19.8H5.7V21H3V18.3H4.2V19.8Z"/>
        <path d="M4.2 16.5V12.9H3V16.5H4.2Z"/>
        <path d="M3 11.1H4.2V7.5H3V11.1Z"/>
        <path d="M4.2 5.7H3V3H5.7V4.2H4.2V5.7Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { attributes, clientId, setAttributes } = props
      const {
        width, fullScreen, autoPaddingTop, autoPaddingBottom, manualPaddingTop, manualPaddingBottom
      } = props.attributes
      const { updateBlockAttributes } = useDispatch('core/block-editor')
      const { blockOrder, getBlocks } = useSelect((select: Select) => ({
        blockOrder: select('core/block-editor').getBlockOrder(),
        getBlocks: select('core/block-editor').getBlocks
      }))
      useEffect(() => {
        const sections = getBlocks()
        for (let i = 0; i < sections.length - 1; i++) {
          const current = sections[i]
          const next = sections[i + 1]
          const bothSections =
            current.name === 'ws/section' &&
            next.name === 'ws/section'
          const samePresetBackground =
            current.attributes.backgroundColor &&
            current.attributes.backgroundColor === next.attributes.backgroundColor
          const sameCustomBackground =
            current.attributes.style?.color?.background &&
            current.attributes.style?.color?.background === next.attributes.style?.color?.background
          const sameEmptyBackground =
            !current.attributes.backgroundColor &&
            !next.attributes.backgroundColor &&
            !current.attributes.gradient &&
            !next.attributes.gradient &&
            !current.attributes.style &&
            !next.attributes.style &&
            !current.attributes.backgroundMedia &&
            !next.attributes.backgroundMedia
          if (
            bothSections && (
              samePresetBackground ||
              sameCustomBackground ||
              sameEmptyBackground
            )
          ) {
            updateBlockAttributes(current.clientId, { autoPaddingBottom: '50' })
            updateBlockAttributes(next.clientId, { autoPaddingTop: '50' })
          }
          else {
            updateBlockAttributes(current.clientId, { autoPaddingBottom: '100' })
            updateBlockAttributes(next.clientId, { autoPaddingTop: '100' })
          }
        }
      }, [
        attributes.backgroundMedia,
        attributes.gradient,
        attributes.backgroundColor,
        attributes.style,
        blockOrder
      ])
      useEffect(() => {
        setAttributes({ order: blockOrder.indexOf(clientId) + 1 })
      }, [blockOrder])
      const blockProps = useBlockProps({
        className: classnames({
          [`width-${width}`]: width,
          'full-screen': fullScreen,
          [`padding-top-${manualPaddingTop || autoPaddingTop}`]: manualPaddingTop || autoPaddingTop,
          [`padding-bottom-${manualPaddingBottom || autoPaddingBottom}`]: manualPaddingBottom || autoPaddingBottom
        })
      })
      const innerBlocksProps = useInnerBlocksProps({
        className: 'section-inner'
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Section Options', 'ws') }
            >
              <SelectControl
                label={ __('Width', 'ws') }
                options={ [
                  { label: __('Wide', 'ws'), value: 'wide' },
                  { label: __('Default', 'ws'), value: 'default' },
                  { label: __('Narrow', 'ws'), value: 'narrow' },
                  { label: __('Narrower', 'ws'), value: 'narrower' },
                  { label: __('Narrowest', 'ws'), value: 'narrowest' }
                ] }
                onChange={ (newValue: string) => setAttributes({ width: newValue }) }
                value={ width }
              />
              <ToggleControl
                label={ __('Full Screen Height', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ fullScreen: newValue }) }
                checked={ fullScreen }
              />
              <div className="padding">
                <SelectControl
                  label={ __('Top', 'ws') }
                  options={ [
                    { label: 'Auto', value: '' },
                    { label: '-100%', value: '-100' },
                    { label: '-50%', value: '-50' },
                    { label: '0%', value: '0' },
                    { label: '50%', value: '50' },
                    { label: '100%', value: '100' },
                    { label: '150%', value: '150' },
                    { label: '200%', value: '200' }
                  ] }
                  onChange={ (newValue: string) => setAttributes({ manualPaddingTop: newValue }) }
                  value={ manualPaddingTop }
                />
                <SelectControl
                  label={ __('Bottom', 'ws') }
                  options={ [
                    { label: 'Auto', value: '' },
                    { label: '200%', value: '200' },
                    { label: '150%', value: '150' },
                    { label: '100%', value: '100' },
                    { label: '50%', value: '50' },
                    { label: '0%', value: '0' },
                    { label: '-50%', value: '-50' },
                    { label: '-100%', value: '-100' }
                  ] }
                  onChange={ (newValue: string) => setAttributes({ manualPaddingBottom: newValue }) }
                  value={ manualPaddingBottom }
                />
              </div>
            </PanelBody>
          </InspectorControls>
          <section
            { ...blockProps }
            className={ blockProps.className.replace(/has-[^-]+?-background-color/, '') }
            style={ { ...blockProps.style, backgroundColor: '' } }
          >
            <Background { ...props } />
            <div className="container-fluid section-container">
              <div { ...innerBlocksProps } />
            </div>
          </section>
        </>
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
