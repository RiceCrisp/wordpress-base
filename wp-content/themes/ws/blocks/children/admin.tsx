import React, { useEffect, useState } from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'
import { Chips, PostPicker } from '@ws/components'
import classnames from 'classnames'

declare const wp: any

const apiFetch = wp.apiFetch
const { InspectorControls, useBlockProps } = wp.blockEditor
const {
  BaseControl,
  PanelBody,
  RangeControl,
  ToggleControl
} = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

export const children = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M10 4.5V7.5H14V4.5H10ZM9.5 3C8.94772 3 8.5 3.44772 8.5 4V8C8.5 8.55228 8.94772 9 9.5 9H11.25V11.25H5.75V15H4C3.44772 15 3 15.4477 3 16V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V16C10 15.4477 9.55228 15 9 15H7.25V12.75H16.75V15H15C14.4477 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V16C21 15.4477 20.5523 15 20 15H18.25V11.25H12.75V9H14.5C15.0523 9 15.5 8.55228 15.5 8V4C15.5 3.44772 15.0523 3 14.5 3H9.5ZM4.5 16.5V19.5H8.5V16.5H4.5ZM15.5 19.5V16.5H19.5V19.5H15.5Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const {
        type,
        parent,
        allPosts,
        numPosts,
        sideScroll
      } = props.attributes
      const loadingString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('Loading...', 'ws')}</i></p></div>`
      const errorString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('There was an error retrieving the data.', 'ws')}</i></p></div>`
      const noPostsString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('No posts selected/found.', 'ws')}</i></p></div>`
      const [posts, setPosts] = useState(loadingString)
      const [parentTitle, setParentTitle] = useState('')
      const [parentPostType, setParentPostType] = useState('none')
      const { currentPostId } = useSelect((select: Select) => ({
        currentPostId: select('core/editor').getCurrentPostId()
      }))
      useEffect(() => {
        setPosts(loadingString)
        let url = `/ws/archive?post_parent=${parent || currentPostId}`
        if (!allPosts) {
          url += `&posts_per_page=${numPosts}`
        }
        if (type && type !== 'default') {
          url += `&type=${type}`
        }
        apiFetch({ path: url })
          .then((res: any) => {
            setPosts(res && res.output ? res.output : noPostsString)
          })
          .catch((err: string) => {
            setPosts(errorString)
            console.error('error', err)
          })
      }, [currentPostId, type, parent, allPosts, numPosts])
      useEffect(() => {
        apiFetch({ path: `/ws/all/?include=${parent || currentPostId}` })
          .then((res: any) => {
            setParentPostType(res[0].post_type)
            setParentTitle(res[0].post_title)
          })
          .catch((err: string) => {
            setParentPostType('none')
            setParentTitle('')
            console.error('error', err)
          })
      }, [parent, currentPostId])
      const rowClasses = classnames(
        'row',
        `${type && type !== 'default' ? type : parentPostType}-row`,
        `row-count-${numPosts}`,
        {
          'side-scroll': sideScroll
        }
      )
      const blockProps = useBlockProps()
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Child Pages Options', 'ws') }
            >
              <BaseControl
                label={ __('Parent Page/Post', 'ws') }
              >
                { parent ? (
                  <Chips
                    chips={ [{ id: parent, name: parentTitle }] }
                    onChange={ (newValue: number[]) => setAttributes({ parent: newValue[0] || 0 }) }
                  />
                ) : (
                  <PostPicker
                    buttonText={ __('Select Parent', 'ws') }
                    single={ true }
                    onChange={ (newValue: number[]) => setAttributes({ parent: newValue[0] || 0 }) }
                  />
                ) }
              </BaseControl>
              <ToggleControl
                label={ __('Show All Child Pages', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ allPosts: newValue }) }
                checked={ allPosts }
              />
              { !allPosts && (
                <RangeControl
                  label={ __('Number of Child Pages', 'ws') }
                  min="1"
                  max="8"
                  onChange={ (newValue: number) => setAttributes({ numPosts: newValue }) }
                  value={ numPosts }
                />
              ) }
              <ToggleControl
                label={ __('Side scroll', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ sideScroll: newValue }) }
                checked={ sideScroll }
              />
            </PanelBody>
          </InspectorControls>
          <div { ...blockProps }>
            <div
              className={ rowClasses }
              dangerouslySetInnerHTML={ { __html: posts } }
            />
          </div>
        </>
      )
    },
    save: () => {
      return null
    }
  },
  variations: [
    {
      name: 'children-default',
      isDefault: true,
      title: __('Default', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'default'
      }
    },
    {
      name: 'children-featured',
      title: __('Featured', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'featured'
      }
    },
    {
      name: 'children-cards',
      title: __('Cards', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'cards'
      }
    },
    {
      name: 'children-tiles',
      title: __('Tiles', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'tiles'
      }
    },
    {
      name: 'children-list',
      title: __('List', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'list'
      }
    }
  ]
}
