import React from 'react'
import { Select } from '@ws/types'
import { CheckboxGroupControl } from '@ws/components'

declare const wp: any

const { SelectControl } = wp.components
const { useSelect } = wp.data

type ComponentProps = {
  [index: string]: any,
  multiple: boolean,
  onChange: (arg: string[]) => void
  value: string[]
}

export function PostTypeControl(props: ComponentProps) {
  const {
    multiple,
    ...lastProps
  } = props
  const postTypes: Record<string, any>[] = useSelect((select: Select) => {
    const postTypes = select('core').getPostTypes({ per_page: -1 }) || []
    return postTypes.filter((postType: Record<string, any>) => {
      return !['attachment', 'wp_block', 'nav_menu_item'].includes(postType.slug)
    })
  })
  if (multiple) {
    return (
      <CheckboxGroupControl
        { ...lastProps }
        options={ [...postTypes.map(postType => {
          return { label: postType.name, value: postType.slug }
        })] }
      />
    )
  }
  else {
    return (
      <SelectControl
        { ...lastProps }
        options={ [...postTypes.map(postType => {
          return { label: postType.name, value: postType.slug }
        })] }
      />
    )
  }
}
