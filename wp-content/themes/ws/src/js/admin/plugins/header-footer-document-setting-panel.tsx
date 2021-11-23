import React from 'react'
import { Select } from '@ws/types'

declare const wp: any

const { ToggleControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { PluginDocumentSettingPanel } = wp.editPost || {}
const { __ } = wp.i18n

export const headerFooterDocumentSettingPanel = wp.editPost ? {
  name: 'ws-header-footer-document-setting-panel',
  args: {
    render: () => {
      const { meta } = useSelect((select: Select) => ({
        meta: select('core/editor').getEditedPostAttribute('meta')
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
          title={ __('Header & Footer', 'ws') }
        >
          <p>{ __('These options modify the appearance of the page\'s header and footer.', 'ws') }</p>
          <ToggleControl
            label={ __('Light Header Nav', 'ws') }
            onChange={ (newValue: boolean) => setMeta({ _header_footer_light_header: newValue }) }
            checked={ meta._header_footer_light_header }
          />
          <ToggleControl
            label={ __('Hide Header Nav', 'ws') }
            onChange={ (newValue: boolean) => setMeta({ _header_footer_hide_header: newValue }) }
            checked={ meta._header_footer_hide_header }
          />
          <ToggleControl
            label={ __('Hide Footer', 'ws') }
            onChange={ (newValue: boolean) => setMeta({ _header_footer_hide_footer: newValue }) }
            checked={ meta._header_footer_hide_footer }
          />
        </PluginDocumentSettingPanel>
      )
    }
  }
} : null
