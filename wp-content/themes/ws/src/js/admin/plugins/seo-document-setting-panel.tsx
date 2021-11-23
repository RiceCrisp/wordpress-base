import React from 'react'
import { Select } from '@ws/types'
import { useSettings } from '@ws/hooks'

declare const wp: any

const { TextareaControl, TextControl, ToggleControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { PluginDocumentSettingPanel } = wp.editPost || {}
const { __ } = wp.i18n

export const seoDocumentSettingPanel = wp.editPost ? {
  name: 'ws-seo-document-setting-panel',
  args: {
    render: () => {
      const {
        meta,
        url,
        title,
        excerpt
      } = useSelect((select: Select) => ({
        meta: select('core/editor').getEditedPostAttribute('meta'),
        url: select('core/editor').getPermalink(),
        title: select('core/editor').getEditedPostAttribute('title'),
        excerpt: select('core/editor').getEditedPostAttribute('excerpt')
      }))
      const { editPost } = useDispatch('core/editor')
      const setMeta = (keyAndValue: Record<string, any>) => {
        editPost({ meta: keyAndValue })
      }
      const [metaTitle] = useSettings({ seo_meta_title: '' })
      // Prevent reusable block editor from crashing
      if (!meta) {
        return null
      }
      return (
        <PluginDocumentSettingPanel
          title={ __('SEO', 'ws') }
        >
          <p>{ __('These options provide control over Search Engine Optimization via meta tags.', 'ws') }</p>
          <b>{ __('Example of Google Search Result') }</b>
          <div className="seo-preview">
            <p id="seo-preview-title">
              <span className="title">{ meta._seo_title || title }</span>
              <span className="appended">{ metaTitle ? ` ${metaTitle}` : '' }</span>
            </p>
            <p id="seo-preview-url">{ url }</p>
            <p id="seo-preview-description">{ meta._seo_description || excerpt }</p>
          </div>
          <TextControl
            label={ __('Title', 'ws') }
            onChange={ (newValue: string) => setMeta({ _seo_title: newValue }) }
            value={ meta._seo_title }
            placeholder={ title }
          />
          <TextareaControl
            label={ __('Description', 'ws') }
            onChange={ (newValue: string) => setMeta({ _seo_description: newValue }) }
            value={ meta._seo_description }
            placeholder={ excerpt }
          />
          <TextControl
            label={ __('Keywords', 'ws') }
            onChange={ (newValue: string) => setMeta({ _seo_keywords: newValue }) }
            value={ meta._seo_keywords }
          />
          <TextControl
            label={ __('Canonical', 'ws') }
            onChange={ (newValue: string) => setMeta({ _seo_canonical: newValue }) }
            value={ meta._seo_canonical }
            placeholder={ url }
          />
          <ToggleControl
            label={ __('No Index', 'ws') }
            onChange={ (newValue: boolean) => setMeta({ _seo_no_index: newValue }) }
            checked={ meta._seo_no_index }
          />
          <ToggleControl
            label={ __('No Follow', 'ws') }
            onChange={ (newValue: boolean) => setMeta({ _seo_no_follow: newValue }) }
            checked={ meta._seo_no_follow }
          />
        </PluginDocumentSettingPanel>
      )
    }
  }
} : null
