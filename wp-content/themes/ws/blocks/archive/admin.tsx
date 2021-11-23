import React, { useEffect, useState } from 'react'
import metadata from './block.json'
import { Props, Select, Taxonomy } from '@ws/types'
import { CheckboxGroupControl, PostTypeControl, SVGPreview } from '@ws/components'

declare const wp: any

const apiFetch = wp.apiFetch
const { InspectorControls, useBlockProps } = wp.blockEditor
const { PanelBody, TextControl, ToggleControl } = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

export const archive = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M7 8H3L3 12H7V8ZM3 7C2.44772 7 2 7.44772 2 8V12C2 12.5523 2.44772 13 3 13H7C7.55228 13 8 12.5523 8 12V8C8 7.44772 7.55228 7 7 7H3Z" />
        <path d="M14 8H10V12H14V8ZM10 7C9.44772 7 9 7.44772 9 8V12C9 12.5523 9.44772 13 10 13H14C14.5523 13 15 12.5523 15 12V8C15 7.44772 14.5523 7 14 7H10Z" />
        <path d="M21 8H17V12H21V8ZM17 7C16.4477 7 16 7.44772 16 8V12C16 12.5523 16.4477 13 17 13H21C21.5523 13 22 12.5523 22 12V8C22 7.44772 21.5523 7 21 7H17Z" />
        <path d="M7 15H3L3 19H7V15ZM3 14C2.44772 14 2 14.4477 2 15V19C2 19.5523 2.44772 20 3 20H7C7.55228 20 8 19.5523 8 19V15C8 14.4477 7.55228 14 7 14H3Z" />
        <path d="M14 15H10V19H14V15ZM10 14C9.44772 14 9 14.4477 9 15V19C9 19.5523 9.44772 20 10 20H14C14.5523 20 15 19.5523 15 19V15C15 14.4477 14.5523 14 14 14H10Z" />
        <path d="M21 15H17V19H21V15ZM17 14C16.4477 14 16 14.4477 16 15V19C16 19.5523 16.4477 20 17 20H21C21.5523 20 22 19.5523 22 19V15C22 14.4477 21.5523 14 21 14H17Z" />
        <path d="M3 4C2.44772 4 2 4.44772 2 5C2 5.55228 2.44772 6 3 6H10C10.5523 6 11 5.55228 11 5C11 4.44772 10.5523 4 10 4H3Z" />
        <path d="M14 4C13.4477 4 13 4.44772 13 5C13 5.55228 13.4477 6 14 6H21C21.5523 6 22 5.55228 22 5C22 4.44772 21.5523 4 21 4H14Z" />
      </svg>
    ),
    edit: (props: Props) => {
      const { setAttributes } = props
      const {
        type,
        postTypes,
        loadMore,
        allPosts,
        numPosts,
        filters
      } = props.attributes
      const loadingString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('Loading...', 'ws')}</i></p></div>`
      const errorString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('There was an error retrieving the data.', 'ws')}</i></p></div>`
      const noPostsString = `<div class="col-xs-12 has-text-align-center"><p><i>${__('No posts selected/found.', 'ws')}</i></p></div>`
      const [posts, setPosts] = useState(loadingString)
      const [years, setYears] = useState([])
      const { defaultNumPosts } = useSelect((select: Select) => ({
        defaultNumPosts: select('core/block-editor').getSettings().postsPerPage
      }))
      useEffect(() => {
        let url = `/ws/archive?post_type=${postTypes.length > 0 ? postTypes.join(',') : 'none'}`
        if (!allPosts) {
          url += `&posts_per_page=${numPosts || defaultNumPosts}`
        }
        if (type) {
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
        url = `/ws/years?post_type=${postTypes.length > 0 ? postTypes.join(',') : 'none'}`
        apiFetch({ path: url })
          .then((res: any) => {
            setYears(res)
          })
          .catch((err: string) => {
            setYears([])
            console.error('error', err)
          })
      }, [postTypes, allPosts, numPosts, type])
      const { taxonomies, filterList } = useSelect((select: Select) => {
        let taxonomies: Taxonomy[] = select('core').getTaxonomies({ per_page: -1 })
        let filterList = [
          { label: 'Year', value: 'year' },
          { label: 'Search', value: 'search' }
        ]
        if (taxonomies && postTypes.length > 0) {
          taxonomies = taxonomies.filter(taxonomy => {
            return postTypes.every((postType: string) => {
              return taxonomy.types.indexOf(postType) !== -1
            })
          })
          taxonomies = taxonomies.map(taxonomy => {
            return {
              ...taxonomy,
              terms: select('core').getEntityRecords('taxonomy', taxonomy.slug)
            }
          })
          if (taxonomies.some(taxonomy => taxonomy.terms && taxonomy.terms.length)) {
            filterList = taxonomies.map(tax => {
              return { label: tax.name, value: tax.slug }
            }).concat(filterList)
          }
          if (postTypes.length > 1) {
            filterList = [{ label: __('Post Type', 'ws'), value: 'post_type' }, ...filterList]
          }
        }
        return {
          taxonomies: taxonomies,
          filterList: filterList
        }
      }, [postTypes])
      const rowClasses = `row ${!type || type === 'default' ? postTypes[0] : type}-row`
      const blockProps = useBlockProps()
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Archive Options', 'ws') }
            >
              <PostTypeControl
                label={ __('Post Type', 'ws') }
                onChange={ (newValue: string[]) => setAttributes({ postTypes: newValue, filters: [] }) }
                value={ postTypes }
                multiple
              />
              { filterList.length > 0 && (
                <CheckboxGroupControl
                  legend={ __('Filters', 'ws') }
                  options={ filterList }
                  onChange={ (newValue: string[]) => setAttributes({ filters: newValue }) }
                  value={ filters }
                />
              ) }
              <ToggleControl
                label={ <>{ __('Load More', 'ws') } <small>{ __('Negatively impacts SEO', 'ws') }</small></> }
                help={ __('Replaces pagination links with a "load more" button.', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ loadMore: newValue }) }
                checked={ loadMore }
              />
              <ToggleControl
                label={ __('Show All Posts', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ allPosts: newValue }) }
                checked={ allPosts }
              />
              { !allPosts && (
                <TextControl
                  label={ __('Posts Per Page', 'ws') }
                  help={ `Default: ${defaultNumPosts}` }
                  min="1"
                  max="99"
                  type="number"
                  onChange={ (newValue: string) => setAttributes({ numPosts: newValue }) }
                  value={ numPosts }
                />
              ) }
            </PanelBody>
          </InspectorControls>
          <div { ...blockProps }>
            <div className={ `archive-filters archive-filters-${filters.length}` }>
              <div className="row">
                { filters && filters.length > 0 && (
                  filters.map((filter: string) => {
                    if (filter === 'year') {
                      return (
                        <div className="col-xs-12 archive-filter">
                          <label htmlFor="archive-filter-year">
                            { __('Filter by Year', 'ws') }
                          </label>
                          <select id="archive-filter-year">
                            <option value="">All Years</option>
                            { years.map((year: string) => {
                              return (
                                <option key={ year }>{ year }</option>
                              )
                            }) }
                          </select>
                        </div>
                      )
                    }
                    if (filter === 'timeline') {
                      return (
                        <div className="col-xs-12 archive-filter">
                          <label htmlFor="archive-filter-timeline">
                            { __('Past & Upcoming', 'ws') }
                          </label>
                          <select id="archive-filter-timeline">
                            <option>All</option>
                            <option>Upcoming</option>
                            <option>Past</option>
                          </select>
                        </div>
                      )
                    }
                    if (filter === 'post_type') {
                      return (
                        <div className="col-xs-12 archive-filter">
                          <label htmlFor="archive-filter-post_type">
                            { __('Filter by Post Type', 'ws') }
                          </label>
                          <select id="archive-filter-post_type">
                            <option>All</option>
                            { postTypes.map((postType: string) => {
                              return (
                                <option
                                  key={ postType }
                                  style={ { textTransform: 'capitalize' } }
                                >
                                  { postType }
                                </option>
                              )
                            }) }
                          </select>
                        </div>
                      )
                    }
                    if (filter === 'search') {
                      return (
                        <div className="col-xs-12 archive-filter">
                          <label htmlFor="archive-filter-search">
                            { __('Search', 'ws') }
                          </label>
                          <input id="archive-filter-search" type="text" />
                          <SVGPreview id="search" className="search-icon" />
                        </div>
                      )
                    }
                    if (taxonomies) {
                      return taxonomies.map((tax: Taxonomy) => {
                        if (tax.slug === filter) {
                          return (
                            <div className="col-xs-12 archive-filter">
                              <label htmlFor={ `archive-filter-${tax.slug}` }>
                                { tax.name }
                              </label>
                              <select id={ `archive-filter-${tax.slug}` }>
                                <option>All {tax.name}</option>
                                { tax.terms && tax.terms.map(term => {
                                  return (
                                    <option key={ term.id } dangerouslySetInnerHTML={ { __html: term.name } }></option>
                                  )
                                }) }
                              </select>
                            </div>
                          )
                        }
                        return null
                      })
                    }
                    return null
                  })
                ) }
              </div>
            </div>
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
      name: 'archive-default',
      isDefault: true,
      title: __('Default', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'default'
      }
    },
    {
      name: 'archive-featured',
      title: __('Featured', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'featured'
      }
    },
    {
      name: 'archive-cards',
      title: __('Cards', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'cards'
      }
    },
    {
      name: 'archive-tiles',
      title: __('Tiles', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'tiles'
      }
    },
    {
      name: 'archive-list',
      title: __('List', 'ws'),
      scope: ['transform'],
      attributes: {
        type: 'list'
      }
    }
  ]
}
