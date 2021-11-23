import React, { useEffect, useState } from 'react'
import metadata from './block.json'
import { Props } from '@ws/types'
import { Chips, PostPicker } from '@ws/components'
import { arraysMatch } from '@ws/utils'
import classnames from 'classnames'

declare const wp: any

const apiFetch = wp.apiFetch
const {
  BlockControls,
  InnerBlocks,
  InspectorControls,
  useBlockProps
} = wp.blockEditor
const {
  Button,
  PanelBody,
  Placeholder,
  ToggleControl,
  ToolbarButton,
  ToolbarGroup
} = wp.components
const { __ } = wp.i18n

export const selectContent = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M21.9971 14.6377V14.5249C21.9971 13.8529 21.4966 13.3062 20.8814 13.3062C20.7424 13.3062 20.6095 13.3343 20.4866 13.3852C20.3823 12.8307 19.9319 12.4125 19.3938 12.4125C19.2477 12.4125 19.1082 12.4436 18.9802 12.4997C18.8452 11.9879 18.3968 11.6 17.8814 11.6C17.7427 11.6 17.6089 11.6293 17.4847 11.6821V10.2187C17.4847 9.5467 16.9842 9 16.3691 9C15.7539 9 15.2534 9.5467 15.2534 10.2187V13.8077C15.0581 13.5353 14.8233 13.2979 14.5508 13.1756C14.2467 13.0391 13.9266 13.0554 13.6252 13.2228C13.0707 13.5308 12.8421 14.273 13.1156 14.8775L14.5015 17.9413C14.5407 18.0253 15.4799 20 17.1803 20H19.1637C20.7277 20 22 18.6028 22 16.8851L21.9985 14.6377H21.9971ZM19.1638 19.1875H17.1803C15.9555 19.1875 15.1924 17.6309 15.1649 17.5736L13.7824 14.5175C13.687 14.3067 13.766 14.0561 13.9623 13.947C14.0705 13.8869 14.1647 13.8808 14.2677 13.9269C14.6783 14.1108 15.0814 14.997 15.2389 15.5121L15.3584 15.9053L15.9972 15.6583V10.2187C15.9972 9.99471 16.164 9.81249 16.3691 9.81249C16.5742 9.81249 16.741 9.99471 16.741 10.2187V14.9041H17.4915V12.8458C17.4915 12.619 17.6774 12.4125 17.8815 12.4125C18.0928 12.4125 18.2782 12.6023 18.2782 12.8187V15.0395H19.022V13.6312C19.022 13.4072 19.1888 13.225 19.3939 13.225C19.5989 13.225 19.7657 13.4072 19.7657 13.6312V15.4187H20.5095V14.5249C20.5095 14.3009 20.6763 14.1187 20.8814 14.1187C21.0865 14.1187 21.2533 14.3009 21.2533 14.5249V15.106H21.2551L21.2563 16.8854C21.2563 18.1548 20.3175 19.1875 19.1638 19.1875Z"/>
        <path d="M3 5C2.44772 5 2 5.44772 2 6V10C2 10.5523 2.44772 11 3 11H7C7.55228 11 8 10.5523 8 10V6C8 5.44772 7.55228 5 7 5H3ZM7 6H3L3 10H7V6Z"/>
        <path d="M10 5C9.44772 5 9 5.44772 9 6V10C9 10.5523 9.44772 11 10 11H14C14.0875 11 14.1724 10.9888 14.2534 10.9676V10.2187C14.2534 9.5732 14.5317 8.94693 15 8.52531V6C15 5.44772 14.5523 5 14 5H10ZM14 6H10V10H14V6Z"/>
        <path d="M19.0991 11H21C21.5523 11 22 10.5523 22 10V6C22 5.44772 21.5523 5 21 5H17C16.4477 5 16 5.44772 16 6V8.03249C16.1187 8.01118 16.2419 7.99999 16.3691 7.99999C16.5925 7.99999 16.8038 8.03456 17 8.09785V6H21V10H18.4741C18.4812 10.0725 18.4847 10.1455 18.4847 10.2187V10.6903C18.7088 10.7594 18.9152 10.8657 19.0991 11Z"/>
        <path d="M14.2534 12.0324C14.1724 12.0112 14.0875 12 14 12H10C9.44772 12 9 12.4477 9 13V17C9 17.5523 9.44772 18 10 18H13.4305L12.9782 17H10V13H12.4175C12.6008 12.7384 12.8428 12.5135 13.1397 12.3485C13.4888 12.1546 13.8705 12.0645 14.2534 12.0874V12.0324Z"/>
        <path d="M3 12C2.44772 12 2 12.4477 2 13V17C2 17.5523 2.44772 18 3 18H7C7.55228 18 8 17.5523 8 17V13C8 12.4477 7.55228 12 7 12H3ZM7 13H3L3 17H7V13Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const { type, ids, sideScroll } = props.attributes
      const loadingString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('Loading...', 'ws')}</i></p></div>`
      const errorString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('There was an error retrieving the data.', 'ws')}</i></p></div>`
      const noPostsString = `<div class="col-xs-12 has-text-align-center"><i>${__('No posts selected/found.', 'ws')}</i></div>`
      const [view, setView] = useState(ids.length > 0 ? 'preview' : 'edit')
      const [postType, setPostType] = useState('none')
      const [count, setCount] = useState(0)
      const [output, setOutput] = useState(loadingString)
      const [posts, setPosts] = useState<Record<string, any>[]>([])
      useEffect(() => {
        setOutput(loadingString)
        let url = `/ws/archive?include=${ids.join(',')}&orderby=post__in`
        if (type && type !== 'default') {
          url += `&type=${type}`
        }
        apiFetch({ path: url })
          .then((res: any) => {
            const tempOutput = res && res.output ? res.output : noPostsString
            const count = res && res.count ? res.count : 0
            setCount(count)
            setOutput(tempOutput.replaceAll(/data-src="([^"]*?)"/g, 'style="background-image:url($1)"'))
          })
          .catch((err: string) => {
            setOutput(errorString)
            setCount(0)
            console.error('error', err)
          })
        apiFetch({ path: `/ws/all/?include=${ids.length > 0 ? ids.join(',') : 'none'}&orderby=post__in` })
          .then((res: any) => {
            const resIds = res.map((p: any) => p.ID)
            if (!arraysMatch(resIds, ids)) {
              setAttributes({ ids: resIds })
            }
            setPosts(res)
            if (res.length > 0 && res.every((v: any) => v.post_type === res[0].post_type)) {
              setPostType(res[0].post_type)
            }
            else {
              setPostType('default')
            }
            if (res.length === 0) {
              setPostType('none')
            }
          })
          .catch((err: string) => {
            setPostType('none')
            setPosts([])
            console.error('error', err)
          })
      }, [ids, type])
      const rowClasses = classnames(
        'row',
        `${type && type !== 'default' ? type : postType}-row`,
        `row-count-${count}`,
        {
          'side-scroll': sideScroll
        }
      )
      const blockProps = useBlockProps()
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Select Content Options', 'ws') }
            >
              <ToggleControl
                label={ __('Side scroll', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ sideScroll: newValue }) }
                checked={ sideScroll }
              />
            </PanelBody>
          </InspectorControls>
          { view !== 'edit' && (
            <BlockControls>
              <ToolbarGroup>
                <ToolbarButton
                  label={ __('Edit Posts', 'ws') }
                  icon="edit"
                  onClick={ () => setView('edit') }
                />
              </ToolbarGroup>
            </BlockControls>
          ) }
          <div { ...blockProps }>
            { view === 'edit' && (
              <Placeholder
                icon="screenoptions"
                label={ __('Select Content', 'ws') }
                instructions={ __('Click a post name to move or delete it (use the block editor controls). Click "Add Posts" to add new posts.', 'ws') }
              >
                <form
                  className="edit-form"
                  onSubmit={ e => {
                    e.preventDefault()
                    setView('preview')
                  } }
                >
                  <Chips
                    chips={ posts.map(p => ({
                      id: p.ID,
                      name: p.post_title
                    })) }
                    onChange={ (newValue: number[]) => {
                      setAttributes({ ids: newValue })
                    } }
                    controls
                  />
                  <div className="edit-form-buttons">
                    <PostPicker
                      onChange={ (newValue: number[]) => {
                        setAttributes({ ids: [...ids, ...newValue] })
                      } }
                    />
                    <Button
                      isPrimary
                      type="submit"
                    >
                      { __('Preview', 'ws') }
                    </Button>
                  </div>
                </form>
              </Placeholder>
            ) }
            { view === 'preview' && (
              <div
                className={ rowClasses }
                dangerouslySetInnerHTML={ { __html: output } }
              />
            ) }
          </div>
        </>
      )
    },
    save: () => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  variations: [
    {
      name: 'select-content-default',
      isDefault: true,
      title: __('Default', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'default'
      }
    },
    {
      name: 'select-content-featured',
      title: __('Featured', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'featured'
      }
    },
    {
      name: 'select-content-cards',
      title: __('Cards', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'cards'
      }
    },
    {
      name: 'select-content-tiles',
      title: __('Tiles', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'tiles'
      }
    },
    {
      name: 'select-content-list',
      title: __('List', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'list'
      }
    }
  ]
}
