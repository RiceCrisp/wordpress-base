import React from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'
import { MediaSelect } from '@ws/components'
import { useMeta } from '@ws/hooks'

declare const wp: any

const { useBlockProps } = wp.blockEditor
const { TextControl } = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

export const metaAuthor = {
  name: metadata.name,
  settings: {
    edit: (props: Props) => {
      const { setAttributes } = props
      const { authorName, authorImage } = props.attributes
      const { author } = useSelect((select: Select) => {
        const currentAuthor = select('core/editor').getEditedPostAttribute('author')
        return {
          author: select('core').getAuthors().find((author: any) => currentAuthor === author.id)
        }
      })
      const blockProps = useBlockProps()
      useMeta(setAttributes, metadata.attributes)
      return (
        <div { ...blockProps }>
          <div className="row align-items-center">
            <div className="author-pic">
              <MediaSelect
                label={ __('Profile Image', 'ws') }
                buttonText={ __('Replace Image', 'ws') }
                size="thumbnail"
                onChange={ ({ id }: { id: number }) => setAttributes({ authorImage: id || 0 }) }
                id={ authorImage }
              />
              { author && !authorImage && (
                <img src={author.avatar_urls['96']} alt="Profile Pic" />
              ) }
            </div>
            <div className="author-name">
              <TextControl
                label={ __('Name', 'ws') }
                placeholder={ author ? author.name : '' }
                onChange={ (newValue: string) => setAttributes({ authorName: newValue }) }
                value={ authorName }
              />
            </div>
          </div>
        </div>
      )
    },
    save: () => {
      return null
    }
  }
}
