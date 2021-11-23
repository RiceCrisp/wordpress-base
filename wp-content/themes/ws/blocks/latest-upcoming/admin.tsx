import React, { useEffect, useState } from 'react'
import metadata from './block.json'
import {
  Props,
  Select,
  Taxonomy,
  Term
} from '@ws/types'
import { treeMap, unflattenWPData } from '@ws/utils'
import { CheckboxGroupControl, PostTypeControl } from '@ws/components'
import classnames from 'classnames'

declare const wp: any

const apiFetch = wp.apiFetch
const { BlockControls, InspectorControls, useBlockProps } = wp.blockEditor
const {
  Button,
  PanelBody,
  Placeholder,
  RangeControl,
  ToggleControl,
  ToolbarButton,
  ToolbarGroup
} = wp.components
const { select, useSelect } = wp.data
const { __ } = wp.i18n

export const latestUpcoming = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M20.8889 10H13.1111C12.5 10 12 10.5 12 11.1111V18.8889C12 19.5 12.5 20 13.1111 20H20.8889C21.5 20 22 19.5 22 18.8889V11.1111C22 10.5 21.5 10 20.8889 10ZM21.1667 18.8889C21.1667 19.0556 21.0556 19.1667 20.8889 19.1667H13.1111C12.9444 19.1667 12.8333 19.0556 12.8333 18.8889V12.2222H21.1667V18.8889ZM15.3333 13.8889H14.2222V15H15.3333V13.8889ZM15.3333 16.1111H14.2222V17.2222H15.3333V16.1111ZM17.5556 13.8889H16.4444V15H17.5556V13.8889ZM19.7778 13.8889H18.6667V15H19.7778V13.8889ZM17.5556 16.1111H16.4444V17.2222H17.5556V16.1111ZM19.7778 16.1111H18.6667V17.2222H19.7778V16.1111Z"/>
        <path d="M7 6H3V10H7V6ZM3 5C2.44772 5 2 5.44772 2 6V10C2 10.5523 2.44772 11 3 11H7C7.55228 11 8 10.5523 8 10V6C8 5.44772 7.55228 5 7 5H3ZM14 6H10V10H11.317C11.1345 10.2934 11.022 10.6346 11.0029 11H10C9.44772 11 9 10.5523 9 10V6C9 5.44772 9.44772 5 10 5H14C14.5523 5 15 5.44772 15 6V9H14V6ZM22 9.31702V6C22 5.44772 21.5523 5 21 5H17C16.4477 5 16 5.44772 16 6V9H17V6H21V9.00289C21.3654 9.02196 21.7066 9.13452 22 9.31702ZM11 12H10C9.44772 12 9 12.4477 9 13V17C9 17.5523 9.44772 18 10 18H11V17H10V13H11V12ZM7 13H3V17H7V13ZM3 12C2.44772 12 2 12.4477 2 13V17C2 17.5523 2.44772 18 3 18H7C7.55228 18 8 17.5523 8 17V13C8 12.4477 7.55228 12 7 12H3Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const {
        type,
        postTypes,
        taxTerms,
        allPosts,
        numPosts,
        sideScroll
      } = props.attributes
      const loadingString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('Loading...', 'ws')}</i></p></div>`
      const errorString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('There was an error retrieving the data.', 'ws')}</i></p></div>`
      const noPostsString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('No posts selected/found.', 'ws')}</i></p></div>`
      const [view, setView] = useState(postTypes.length > 0 ? 'preview' : 'edit')
      const [posts, setPosts] = useState(loadingString)
      const [postID] = useState(select('core/editor').getCurrentPostId())

      useEffect(() => {
        setPosts(loadingString)
        let url = `/ws/archive?post_type=${postTypes.length > 0 ? postTypes.join(',') : 'none'}`
        if (Object.keys(taxTerms).length > 0) {
          url += '&terms='
          for (const taxonomy in taxTerms) {
            const terms = taxTerms[taxonomy]
            url += `${taxonomy}~~${terms.join('~')},`
          }
          url = url.slice(0, -1)
        }
        if (!allPosts) {
          url += `&posts_per_page=${numPosts}`
        }
        if (type && type !== 'default') {
          url += `&type=${type}`
        }
        url += `&post__not_in=${postID}`
        apiFetch({ path: url })
          .then((res: any) => {
            setPosts(res && res.output ? res.output : noPostsString)
          })
          .catch((err: string) => {
            setPosts(errorString)
            console.error('error', err)
          })
      }, [postTypes, taxTerms, allPosts, numPosts, type])

      const { taxonomies }: { taxonomies: Taxonomy[] } = useSelect((select: Select) => {
        let taxonomies: Taxonomy[] = select('core').getTaxonomies({ per_page: -1 }) || []
        if (taxonomies && postTypes.length > 0) {
          taxonomies = taxonomies.filter(taxonomy => {
            return postTypes.every((postType: string) => {
              return taxonomy.types.indexOf(postType) !== -1
            })
          })
          taxonomies = taxonomies.map(taxonomy => {
            const terms = select('core').getEntityRecords('taxonomy', taxonomy.slug, { per_page: -1 })
            return {
              ...taxonomy,
              terms: unflattenWPData<Term>(terms)
            }
          })
        }
        return {
          taxonomies: taxonomies
        }
      }, [postTypes])

      const rowClasses = classnames(
        'row',
        `${type && type !== 'default' ? type : postTypes[0]}-row`,
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
              title={ __('Latest & Upcoming Options', 'ws') }
            >
              <ToggleControl
                label={ __('Show All Posts', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ allPosts: newValue }) }
                checked={ allPosts }
              />
              { !allPosts && (
                <RangeControl
                  label={ __('Number of Posts', 'ws') }
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
                icon="warning"
                label={ __('Latest & Upcoming', 'ws') }
                instructions={ __('Select 1 or more post types and taxonomies from which to pull the latest posts.', 'ws') }
              >
                <form
                  className="edit-form"
                  onSubmit={ e => {
                    e.preventDefault()
                    setView('preview')
                  } }
                >
                  <PostTypeControl
                    label={ __('Post Types', 'ws') }
                    help={ __('Post types with start dates will ordered by "upcoming" instead of "latest"', 'ws') }
                    onChange={ (newValue: string[]) => setAttributes({ postTypes: newValue, taxTerms: [] }) }
                    value={ postTypes }
                    multiple
                  />
                  { !!taxonomies && taxonomies.length > 0 && (
                    taxonomies.map(tax => {
                      if (tax.terms && tax.terms.length > 0) {
                        return (
                          <CheckboxGroupControl
                            legend={ tax.name }
                            options={ treeMap(node => ({
                              value: node.id,
                              label: node.name
                            }), tax.terms) }
                            onChange={ (newValue: string[]) => setAttributes({ taxTerms: { ...taxTerms, [tax.slug]: newValue } }) }
                            value={ taxTerms[tax.slug] || [] }
                          />
                        )
                      }
                      return null
                    })
                  ) }
                  <div className="edit-form-buttons">
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
                dangerouslySetInnerHTML={ { __html: posts } }
              />
            ) }
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
      name: 'latest-upcoming-default',
      isDefault: true,
      title: __('Default', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'default'
      }
    },
    {
      name: 'latest-upcoming-featured',
      title: __('Featured', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'featured'
      }
    },
    {
      name: 'latest-upcoming-cards',
      title: __('Cards', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'cards'
      }
    },
    {
      name: 'latest-upcoming-tiles',
      title: __('Tiles', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'tiles'
      }
    },
    {
      name: 'latest-upcoming-list',
      title: __('List', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'list'
      }
    }
  ]
}
