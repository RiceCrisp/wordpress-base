import React, { useState } from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'

declare const wp: any

const { BlockControls, InnerBlocks, useBlockProps } = wp.blockEditor
const {
  Button,
  Placeholder,
  TextareaControl,
  ToolbarButton,
  ToolbarGroup
} = wp.components
const { __ } = wp.i18n

export const form = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M3.2 14.2V20.8H9.8V14.2H3.2ZM3 13C2.44772 13 2 13.4477 2 14V21C2 21.5523 2.44772 22 3 22H10C10.5523 22 11 21.5523 11 21V14C11 13.4477 10.5523 13 10 13H3Z"/>
        <path d="M14.2 3.2V9.8H20.8V3.2H14.2ZM14 2C13.4477 2 13 2.44772 13 3V10C13 10.5523 13.4477 11 14 11H21C21.5523 11 22 10.5523 22 10V3C22 2.44772 21.5523 2 21 2H14Z"/>
        <path d="M3.2 4.04853V8.95147L5.65147 6.5L3.2 4.04853ZM6.5 5.65147L4.04853 3.2H8.95147L6.5 5.65147ZM6.5 7.34853L4.04853 9.8H8.95147L6.5 7.34853ZM9.8 8.95147L7.34853 6.5L9.8 4.04853V8.95147ZM3.125 2C2.50368 2 2 2.50368 2 3.125V9.875C2 10.4963 2.50368 11 3.125 11H9.875C10.4963 11 11 10.4963 11 9.875V3.125C11 2.50368 10.4963 2 9.875 2H3.125Z"/>
        <path d="M14.2 15.0485V19.9515L16.6515 17.5L14.2 15.0485ZM17.5 16.6515L15.0485 14.2H19.9515L17.5 16.6515ZM17.5 18.3485L15.0485 20.8H19.9515L17.5 18.3485ZM20.8 19.9515L18.3485 17.5L20.8 15.0485V19.9515ZM14 13C13.4477 13 13 13.4477 13 14V21C13 21.5523 13.4477 22 14 22H21C21.5523 22 22 21.5523 22 21V14C22 13.4477 21.5523 13 21 13H14Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { form } = props.attributes
      const [view, setView] = useState(form ? 'preview' : 'edit')
      const blockProps = useBlockProps()
      let output
      switch (view) {
        case 'thanks':
          output = (
            <fieldset className="thank-you-message">
              <legend>{ __('Thank you message', 'ws') }</legend>
              <InnerBlocks />
            </fieldset>
          )
          break
        case 'preview':
          output = (
            <>
              { form && (form.startsWith('http') || form.startsWith('<iframe')) ? (
                <div
                  className="form-html"
                  dangerouslySetInnerHTML={ { __html: form.startsWith('http') ? `<iframe src="${form}"></iframe>` : form } }
                />
              ) : (
                <div>
                  <p className="form-warning"><i>{ __('Only iframe forms are previewable in the editor. Please view the page to confirm the embed is correct.', 'ws') }</i></p>
                </div>
              ) }
            </>
          )
          break
        default:
          output = (
            <Placeholder
              icon="forms"
              label={ __('Form', 'ws') }
              instructions={ __('Paste your form embed code.', 'ws') }
            >
              <form
                className="edit-form"
                onSubmit={ e => {
                  e.preventDefault()
                  setView('preview')
                } }
              >
                <TextareaControl
                  label={ __('Embed Code', 'ws') }
                  placeholder={ __('Paste script/iframe here...', 'ws') }
                  onChange={ (newValue: string) => setAttributes({ form: newValue }) }
                  value={ form }
                />
                <div className="edit-form-buttons">
                  <Button
                    isPrimary
                    type="submit"
                  >
                    { __('Embed', 'ws') }
                  </Button>
                </div>
              </form>
            </Placeholder>
          )
          break
      }
      return (
        <>
          <BlockControls>
            { view !== 'edit' && (
              <ToolbarGroup>
                <ToolbarButton
                  label={ __('Edit Embed', 'ws') }
                  icon="edit"
                  onClick={ () => setView('edit') }
                />
              </ToolbarGroup>
            ) }
            { !!form && (
              <ToolbarGroup>
                <ToolbarButton
                  onClick={ () => setView(view === 'thanks' ? 'preview' : 'thanks') }
                >
                  { view === 'thanks' ? __('View Form', 'ws') : __('View Completion Message', 'ws') }
                </ToolbarButton>
              </ToolbarGroup>
            ) }
          </BlockControls>
          <div { ...blockProps }>
            { output }
          </div>
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

function receiveMessage(e: MessageEvent) {
  if (e.data.height && (e.data.name || e.data.url)) {
    const form = document.querySelector<HTMLElement>(`iframe[name^="${e.data.name || e.data.url}"]`)
    if (form) {
      form.style.height = `${e.data.height}px`
    }
  }
}
window.addEventListener('message', receiveMessage, false)
