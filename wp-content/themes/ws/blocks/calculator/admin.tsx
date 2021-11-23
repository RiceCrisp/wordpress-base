import React from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'
import { arraysMatch, uniqid } from '@ws/utils'

declare const wp: any

const { InnerBlocks, useBlockProps } = wp.blockEditor
const { createBlock } = wp.blocks
const { Button, TextControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const calculator = {
  name: metadata.name,
  settings: {
    edit: (props: Props) => {
      const { clientId, setAttributes } = props
      const { headings, fields } = props.attributes
      const { insertBlock } = useDispatch('core/block-editor')
      const { getBlockCount, getBlocks } = useSelect((select: Select) => select('core/block-editor'))
      const slideHeadings = getBlocks(clientId).map((b: any) => b.attributes.heading)
      if (!arraysMatch(slideHeadings, headings)) {
        setAttributes({ headings: slideHeadings })
      }
      if (!fields.length) {
        setAttributes({ fields: [{ name: __('Seats', 'ws'), slug: 'seats', value: 0 }] })
      }
      const blockProps = useBlockProps()
      return (
        <div { ...blockProps }>
          <div className="block-row">
            <InnerBlocks
              allowedBlocks={ ['ws/calculator-slide'] }
              templateLock={ false }
              renderAppender={ () => (
                <Button
                  isSecondary
                  onClick={ () => {
                    insertBlock(createBlock('ws/calculator-slide'), getBlockCount(clientId), clientId)
                  } }
                >
                  { __('Add Slide', 'ws') }
                </Button>
              ) }
            />
          </div>
          <hr />
          <fieldset>
            <legend>Hidden Fields</legend>
            { fields.map((field: Record<string, any>) => {
              return (
                <TextControl
                  key={ field.slug }
                  label={ field.name }
                  type="number"
                  onChange={ (newValue: string) => setAttributes({
                    fields: [
                      ...fields.map((v: Record<string, any>, i: number) => {
                        if (i === 0) {
                          return {
                            uid: uniqid(),
                            name: v.name,
                            slug: v.slug,
                            value: newValue
                          }
                        }
                        return v
                      })
                    ]
                  }) }
                  value={ field.value }
                />
              )
            }) }
          </fieldset>
        </div>
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
