import React from 'react'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
  arrayMove
} from 'react-sortable-hoc'

declare const wp: any

const { Button, Icon } = wp.components
const { __ } = wp.i18n

const DragHandle = sortableHandle(() => (
  <div
    className="sortable-handle"
    draggable="true"
  >
    <Icon icon={ () => (
      <svg width="20" height="20" viewBox="0 0 18 18">
        <path d="M13,8c0.6,0,1-0.4,1-1s-0.4-1-1-1s-1,0.4-1,1S12.4,8,13,8z M5,6C4.4,6,4,6.4,4,7s0.4,1,1,1s1-0.4,1-1S5.6,6,5,6z M5,10 c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S5.6,10,5,10z M13,10c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S13.6,10,13,10z M9,6 C8.4,6,8,6.4,8,7s0.4,1,1,1s1-0.4,1-1S9.6,6,9,6z M9,10c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S9.6,10,9,10z"></path>
      </svg>
    ) } />
  </div>
))

const SortableItemHOC = sortableElement((props: Record<string, any>) => {
  const {
    className = '',
    children,
    i,
    onDelete
  } = props
  return (
    <li className={ `sortable-item ${className}` }>
      <div className="sortable-header">
        <DragHandle />
        <Button
          icon="trash"
          label={ __('Delete', 'ws') }
          className="sortable-delete"
          onClick={ (e: Event) => {
            e.preventDefault()
            onDelete(i)
          } }
        />
      </div>
      { children }
    </li>
  )
})

const SortableItem = (props: Record<string, any>) => {
  const {
    children,
    className,
    i,
    onDelete
  } = props
  return (
    <SortableItemHOC
      index={ i }
      i={ i }
      onDelete={ onDelete }
      className={ className }
    >
      { children }
    </SortableItemHOC>
  )
}

const SortableContainerHOC = sortableContainer(({ children }: { children: any }) => (
  <ul className="sortable-container">{ children }</ul>
))

const SortableContainer = (props: Record<string, any>) => {
  const {
    children,
    onSortEnd
  } = props
  return (
    <SortableContainerHOC
      onSortStart={ () => {
        document.body.classList.add('grabbing')
      } }
      onSortEnd={ ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
        document.body.classList.remove('grabbing')
        onSortEnd(oldIndex, newIndex)
      } }
      helperClass="editor-styles-wrapper editor-block-list__block sortable-help"
      useDragHandle
      axis="xy"
    >
      { children }
    </SortableContainerHOC>
  )
}

function deleteItem(attr: any[], index: number) {
  return [
    ...attr.filter((v, i) => {
      return i !== index
    })
  ]
}

function updateItem(attr: any[], index: number, key: string, newValue: string) {
  return [
    ...attr.map((v, i) => {
      if (i === index) {
        v[key] = newValue
      }
      return v
    })
  ]
}

export {
  SortableContainer,
  SortableItem,
  deleteItem,
  updateItem,
  arrayMove
}
