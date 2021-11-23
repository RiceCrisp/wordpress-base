import React from 'react'
import { MediaSelect } from '@ws/components'
import { Select } from '@ws/types'

declare const wp: any

const { BaseControl, TextareaControl, TextControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { PluginDocumentSettingPanel } = wp.editPost || {}
const { __ } = wp.i18n

export const socialDocumentSettingPanel = wp.editPost ? {
  name: 'ws-social-document-setting-panel',
  args: {
    render: () => {
      const { meta, title, excerpt } = useSelect((select: Select) => ({
        meta: select('core/editor').getEditedPostAttribute('meta'),
        title: select('core/editor').getEditedPostAttribute('title'),
        excerpt: select('core/editor').getEditedPostAttribute('excerpt')
      }))
      const { editPost } = useDispatch('core/editor')
      const setMeta = (keyAndValue: Record<string, any>) => {
        editPost({ meta: keyAndValue })
      }
      // Prevent reusable block editor from crashing
      if (!meta) {
        return null
      }
      return (
        <PluginDocumentSettingPanel
          title={ __('Social', 'ws') }
        >
          <p>{ __('This information is placed in meta tags and used by social networks to create rich sharable objects.', 'ws') }</p>
          <TextControl
            label={ __('Title', 'ws') }
            onChange={ (newValue: string) => setMeta({ _social_title: newValue }) }
            value={ meta._social_title }
            placeholder={ meta._seo_title || title }
          />
          <TextareaControl
            label={ __('Description', 'ws') }
            onChange={ (newValue: string) => setMeta({ _social_description: newValue }) }
            value={ meta._social_description }
            placeholder={ meta._seo_description || excerpt }
          />
          <MediaSelect
            label={ __('Image', 'ws') }
            onChange={ ({ id }: { id: number }) => setMeta({ _social_image: id }) }
            id={ meta._social_image }
          />
          <BaseControl
            id="twitter-username"
            className="twitter-username"
            label={ __('Twitter Username', 'ws') }
          >
            <span>@</span>
            <TextControl
              id="twitter-username"
              className="field-container"
              onChange={ (newValue: string) => setMeta({ _social_twitter: newValue }) }
              value={ meta._social_twitter }
            />
          </BaseControl>
        </PluginDocumentSettingPanel>
      )
    }
  }
} : null
