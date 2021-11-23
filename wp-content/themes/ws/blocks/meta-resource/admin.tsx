import React, { useEffect } from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'
import { useMeta } from '@ws/hooks'

declare const wp: any

const { InnerBlocks, useBlockProps } = wp.blockEditor
const { serialize } = wp.blocks
const { TextareaControl, TextControl, ToggleControl } = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

export const metaResource = {
  name: metadata.name,
  settings: {
    edit: (props: Props) => {
      const { setAttributes } = props
      const { gated, formHeading, form } = props.attributes
      const { blocks } = useSelect((select: Select) => ({
        blocks: select('core/block-editor').getBlocks(props.clientId)
      }))
      useEffect(() => {
        setAttributes({ completionMessage: serialize(blocks) })
      }, [blocks])
      const blockProps = useBlockProps()
      useMeta(setAttributes, metadata.attributes)
      return (
        <div { ...blockProps }>
          <div className="row">
            <div className="col-xs-12">
              <ToggleControl
                label={ __('Gated Resource') }
                onChange={ (newValue: boolean) => setAttributes({ gated: newValue }) }
                checked={ gated }
              />
            </div>
            { gated && (
              <>
                <div className="col-sm-6">
                  <TextControl
                    label={ __('Form Heading', 'ws') }
                    placeholder={ __('Download Now', 'ws') }
                    onChange={ (newValue: string) => setAttributes({ formHeading: newValue }) }
                    value={ formHeading }
                  />
                  <TextareaControl
                    label={ __('Form', 'ws') }
                    placeholder={ __('Paste script/iframe here...', 'ws') }
                    onChange={ (newValue: string) => setAttributes({ form: newValue }) }
                    value={ form }
                  />
                  <fieldset>
                    <legend>Completion Message</legend>
                    <InnerBlocks />
                  </fieldset>
                </div>
              </>
            ) }
          </div>
        </div>
      )
    },
    save: () => {
      return <InnerBlocks.Content />
    }
  }
}
