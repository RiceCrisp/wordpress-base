import React, { useState } from 'react'
import { CheckboxGroup } from '@ws/components'
import { Select, Post } from '@ws/types'
import { treeMap, unflattenWPData } from '@ws/utils'

declare const wp: any

const {
  Button,
  Modal,
  RadioControl,
  TextControl
} = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

type ComponentProps = {
  className?: string,
  buttonText?: string,
  onChange: (newValue: number[]) => void,
  single?: boolean
}

export function PostPicker(props: ComponentProps) {
  const {
    buttonText = __('Add Posts', '_ws'),
    className = '',
    onChange,
    single
  } = props
  const [filter, setFilter] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [postType, setPostType] = useState('')
  const [selection, setSelection] = useState<number[]>([])
  const { postTypes, posts } = useSelect((select: Select) => {
    const pts = select('core').getPostTypes()
    let ps = select('core').getEntityRecords('postType', postType, { per_page: -1 })
    if (ps) {
      ps = treeMap(node => ({
        value: String(node.id),
        label: node.title.rendered
      }), unflattenWPData<Post>(ps))
    }
    return {
      postTypes: pts ? pts.filter((pt: { viewable: boolean, slug: string }) => pt.viewable && pt.slug !== 'attachment') : [],
      posts: ps
    }
  }, [postType])
  return (
    <>
      <Button
        isSecondary
        className={ className }
        onClick={ () => setModalVisible(true) }
      >
        { buttonText }
      </Button>
      { modalVisible &&
        <Modal
          title={ __('Select Posts', '_ws') }
          onRequestClose={ () => {
            setModalVisible(false)
            setSelection([])
            setFilter('')
          } }
        >
          <div className="post-selector">
            { !!postTypes &&
              <div className="button-list post-type-list">
                <RadioControl
                  label={ __('Post Type', '_ws') }
                  selected={ postType }
                  options={ postTypes.map((p: { name: string, slug: string }) => ({
                    label: p.name,
                    value: p.slug
                  })) }
                  onChange={ (newValue: string) => setPostType(newValue) }
                />
              </div>
            }
            <div className="button-list post-list">
              <fieldset
                className={ filter !== '' ? 'filtered' : '' }
              >
                { !!postTypes &&
                  <legend>{ __('Posts', '_ws') }</legend>
                }
                <TextControl
                  aria-label={ __('Filter', '_ws') }
                  className="post-filter"
                  placeholder="Filter..."
                  onChange={ (newValue: string) => setFilter(newValue) }
                  value={ filter }
                />
                { !!posts && (
                  <CheckboxGroup
                    filter={ (label: string) => label.toUpperCase().includes(filter.toUpperCase()) }
                    options={ posts }
                    onChange={ (newValue: string[]) => {
                      const numbers = newValue.map(Number)
                      if (single) {
                        setSelection([numbers[numbers.length - 1]])
                      }
                      else {
                        setSelection(numbers)
                      }
                    } }
                    value={ selection.map(String) }
                  />
                ) }
              </fieldset>
            </div>
          </div>
          <div className="modal-buttons">
            <Button
              isPrimary
              disabled={ !selection.length }
              onClick={ () => {
                onChange([...selection])
                setModalVisible(false)
                setSelection([])
                setFilter('')
              } }
            >
              { __('Select Posts', '_ws') }
            </Button>
          </div>
        </Modal>
      }
    </>
  )
}
