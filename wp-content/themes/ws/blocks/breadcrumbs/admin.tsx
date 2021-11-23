import React, { Fragment, useEffect, useState } from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'

declare const wp: any

const apiFetch = wp.apiFetch
const { InspectorControls, useBlockProps } = wp.blockEditor
const { PanelBody, TextControl, ToggleControl } = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

type Breadcrumb = {
  id: number,
  title: string
}

export const breadcrumbs = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M2 7C2 6.44772 2.44772 6 3 6H17.4648C17.7992 6 18.1114 6.1671 18.2969 6.4453L21.6302 11.4453C21.8541 11.7812 21.8541 12.2188 21.6302 12.5547L18.2969 17.5547C18.1114 17.8329 17.7992 18 17.4648 18H3C2.44772 18 2 17.5523 2 17V7ZM3.5 16.5V7.5H5.74738L8.61102 12L5.74739 16.5H3.5ZM7.52535 16.5H11.7474L14.611 12L11.7474 7.5H7.52534L10.389 12L7.52535 16.5ZM13.5253 7.5L16.389 12L13.5254 16.5H17.1972L20.1972 12L17.1972 7.5H13.5253Z" />
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { separator, includeCurrent } = props.attributes
      const [breadcrumbs, setBreadcrumbs] = useState([])
      const { currentPostId } = useSelect((select: Select) => ({
        currentPostId: select('core/editor').getCurrentPostId()
      }))
      useEffect(() => {
        if (currentPostId) {
          apiFetch({ path: `/ws/breadcrumbs/${currentPostId}${includeCurrent ? '?include_current=1' : ''}` })
            .then((res: any) => {
              setBreadcrumbs(res)
            })
            .catch((err: string) => {
              setBreadcrumbs([])
              console.error('error', err)
            })
        }
      }, [includeCurrent])
      const blockProps = useBlockProps()
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Children Pages Options', 'ws') }
            >
              <TextControl
                label={ __('Separator', 'ws') }
                onChange={ (newValue: string) => setAttributes({ separator: newValue }) }
                placeholder="/"
                value={ separator }
              />
              <ToggleControl
                label={ __('Include current page', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ includeCurrent: newValue }) }
                checked={ includeCurrent }
              />
            </PanelBody>
          </InspectorControls>
          <div { ...blockProps }>
            { breadcrumbs.map((b: Breadcrumb, i: number) => (
              <Fragment key={ b.id }>
                <span>{ b.title }</span>
                { i < breadcrumbs.length - 1 && (
                  <span className="separator">{ separator || '/' }</span>
                ) }
              </Fragment>
            )) }
            { breadcrumbs.length === 0 && (
              <i>No Parent Pages</i>
            ) }
          </div>
        </>
      )
    },
    save: () => {
      return null
    }
  }
}
