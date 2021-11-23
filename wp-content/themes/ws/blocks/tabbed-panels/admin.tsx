import React, { useEffect, useRef } from 'react'
import metadata from './block.json'
import { Props, Select } from '@ws/types'

declare const wp: any

const {
  InnerBlocks,
  RichText,
  useBlockProps,
  __experimentalUseInnerBlocksProps: useInnerBlocksProps
} = wp.blockEditor
const { createBlock } = wp.blocks
const { Button } = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const tabbedPanels = {
  name: metadata.name,
  settings: {
    icon: (
      <svg viewBox="0 0 24 24" fillRule="evenodd">
        <path d="M20 11H4C3.44772 11 3 11.4477 3 12V16C3 16.5523 3.44772 17 4 17H20C20.5523 17 21 16.5523 21 16V12C21 11.4477 20.5523 11 20 11ZM4 10C2.89543 10 2 10.8954 2 12V16C2 17.1046 2.89543 18 4 18H20C21.1046 18 22 17.1046 22 16V12C22 10.8954 21.1046 10 20 10H4Z"/>
        <path d="M7 6H3L3 8H7V6ZM3 5C2.44772 5 2 5.44772 2 6V8C2 8.55228 2.44772 9 3 9H7C7.55228 9 8 8.55228 8 8V6C8 5.44772 7.55228 5 7 5H3Z"/>
        <path d="M14 6H10V8H14V6ZM10 5C9.44772 5 9 5.44772 9 6V8C9 8.55228 9.44772 9 10 9H14C14.5523 9 15 8.55228 15 8V6C15 5.44772 14.5523 5 14 5H10Z"/>
        <path d="M21 6H17V8H21V6ZM17 5C16.4477 5 16 5.44772 16 6V8C16 8.55228 16.4477 9 17 9H21C21.5523 9 22 8.55228 22 8V6C22 5.44772 21.5523 5 21 5H17Z"/>
      </svg>
    ),
    edit: (props: Props) => {
      const { clientId } = props
      const { orientation } = props.attributes
      const {
        insertBlock,
        moveBlocksDown,
        moveBlocksUp,
        removeBlock,
        selectBlock,
        updateBlockAttributes
      } = useDispatch('core/block-editor')
      const {
        addTabbedPanel,
        removeTabbedPanel,
        setTabbedPanelCurrentId
      } = useDispatch('ws/tabbed-panels')
      const {
        blockCount,
        getChildBlockIds,
        currentPanelId,
        getNextBlockClientId,
        getPreviousBlockClientId,
        isSelected,
        panels
      } = useSelect((select: Select) => {
        const isSelected = select('core/block-editor').isBlockSelected(clientId, true)
        const hasInnerBlocksSelected = select('core/block-editor').hasSelectedInnerBlock(clientId, true)
        return {
          blockCount: select('core/block-editor').getBlockCount(clientId),
          getChildBlockIds: select('core/block-editor').getBlockOrder,
          currentPanelId: select('ws/tabbed-panels').getTabbedPanelCurrentId(clientId),
          getNextBlockClientId: select('core/block-editor').getNextBlockClientId,
          getPreviousBlockClientId: select('core/block-editor').getPreviousBlockClientId,
          isSelected: isSelected || hasInnerBlocksSelected,
          panels: select('core/block-editor').getBlocks(clientId)
        }
      })
      const previousBlockCount = useRef(blockCount)
      useEffect(() => {
        const childIds = getChildBlockIds(clientId)
        addTabbedPanel(clientId, childIds[0])
        return () => {
          removeTabbedPanel(clientId)
        }
      }, [])
      useEffect(() => {
        if (previousBlockCount.current > 0 && blockCount === 0) {
          removeBlock(clientId)
        }
        const childIds = getChildBlockIds(clientId)
        if (!childIds.includes(currentPanelId)) {
          setTabbedPanelCurrentId(clientId, childIds[0])
        }
      }, [blockCount])
      const blockProps = useBlockProps({
        className: orientation || 'horizontal'
      })
      const innerBlocksProps = useInnerBlocksProps(
        { className: 'col-xs-12 panels' },
        {
          allowedBlocks: ['ws/tabbed-panel'],
          template: [
            ['ws/tabbed-panel']
          ],
          renderAppender: false
        }
      )
      return (
        <div { ...blockProps }>
          <div className="col-xs-12 tabs">
            { panels.map((panel: Props) => {
              return (
                <div
                  className="tab-container"
                  key={ panel.clientId }
                >
                  { isSelected && (
                    <div className="controls">
                      <Button
                        label={ orientation === 'vertical' ? __('Move Up', 'ws') : __('Move Left', 'ws') }
                        onClick={ () => moveBlocksUp([panel.clientId], clientId) }
                        icon={ orientation === 'vertical' ? 'arrow-up-alt2' : 'arrow-left-alt2' }
                      />
                      <Button
                        label={ orientation === 'vertical' ? __('Move Down', 'ws') : __('Move Right', 'ws') }
                        onClick={ () => moveBlocksDown([panel.clientId], clientId) }
                        icon={ orientation === 'vertical' ? 'arrow-down-alt2' : 'arrow-right-alt2' }
                      />
                      <Button
                        className="remove-button"
                        label={ __('Remove Tab', 'ws') }
                        onClick={ () => {
                          const nextBlockId = getNextBlockClientId(panel.clientId)
                          const previousBlockId = getPreviousBlockClientId(panel.clientId)
                          removeBlock(panel.clientId)
                            .then(() => {
                              selectBlock(clientId)
                              if (currentPanelId === panel.clientId) {
                                setTabbedPanelCurrentId(clientId, nextBlockId || (previousBlockId || ''))
                              }
                            })
                        } }
                        icon="no-alt"
                      />
                    </div>
                  ) }
                  <button
                    className={ `tab ${currentPanelId === panel.clientId ? 'current' : ''}` }
                    onClick={ () => setTabbedPanelCurrentId(clientId, panel.clientId) }
                  >
                    <RichText
                      placeholder={ __('Tab Name', 'ws') }
                      keepPlaceholderOnFocus={ true }
                      onChange={ (newValue: string) => updateBlockAttributes(panel.clientId, { heading: newValue }) }
                      value={ panel.attributes.heading }
                    />
                  </button>
                </div>
              )
            }) }
            <div className="add-tab">
              <Button
                isSecondary
                onClick={ () => {
                  insertBlock(createBlock('ws/tabbed-panel'), blockCount, clientId)
                    .then((data: any) => {
                      selectBlock(clientId)
                      setTabbedPanelCurrentId(clientId, data.blocks[0].clientId)
                      const textField = document.querySelector<HTMLElement>(`#block-${clientId} .tab-container:nth-child(${data.index + 1}) .rich-text`)
                      if (textField) {
                        textField.focus()
                      }
                    })
                } }
              >
                Add Tab
              </Button>
            </div>
          </div>
          <div { ...innerBlocksProps } />
        </div>
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
      name: 'tabbed-panels-horizontal',
      title: __('Horizontal', 'ws'),
      description: __('Tabs shown in a row above the panels.', 'ws'),
      scope: ['transform'],
      attributes: {
        orientation: 'horizontal'
      }
    },
    {
      name: 'tabbed-panels-vertical',
      title: __('Vertical', 'ws'),
      description: __('Tabs shown in a column to the side of the panels.', 'ws'),
      scope: ['transform'],
      attributes: {
        orientation: 'vertical'
      }
    }
  ]
}
