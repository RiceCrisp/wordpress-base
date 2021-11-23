const initialState = {
  tabbedPanels: {}
}

export const tabbedPanels: Record<string, any> = {
  name: 'ws/tabbed-panels',
  reducer: (state: Record<string, any> = initialState, action: Record<string, any>) => {
    switch (action.type) {
      case 'ADD_TABBED_PANELS': {
        return {
          ...state,
          tabbedPanels: {
            ...state.tabbedPanels,
            [action.tabbedPanelId]: {
              current: action.currentId || ''
            }
          }
        }
      }
      case 'REMOVE_TABBED_PANELS': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [action.tabbedPanelId]: value, ...tabbedPanels } = state.tabbedPanels
        return {
          ...state,
          tabbedPanels: tabbedPanels
        }
      }
      case 'SET_CURRENT_PANEL': {
        return {
          ...state,
          tabbedPanels: {
            ...state.tabbedPanels,
            [action.tabbedPanelId]: {
              ...state.tabbedPanels[action.tabbedPanelId],
              current: action.currentId
            }
          }
        }
      }
    }
    return state
  },
  actions: {
    addTabbedPanel(tabbedPanelId: string, currentId: string) {
      return {
        type: 'ADD_TABBED_PANELS',
        tabbedPanelId: tabbedPanelId,
        currentId: currentId
      }
    },
    removeTabbedPanel(tabbedPanelId: string) {
      return {
        type: 'REMOVE_TABBED_PANELS',
        tabbedPanelId: tabbedPanelId
      }
    },
    setTabbedPanelCurrentId(tabbedPanelId: string, currentId: string) {
      return {
        type: 'SET_CURRENT_PANEL',
        tabbedPanelId: tabbedPanelId,
        currentId: currentId
      }
    }
  },
  selectors: {
    getTabbedPanels(state: Record<string, any>) {
      return Object.keys(state.tabbedPanels)
    },
    getTabbedPanelCurrentId(state: Record<string, any>, parentId: string) {
      if (state.tabbedPanels[parentId]) {
        const { current } = state.tabbedPanels[parentId]
        return current
      }
      return null
    }
  }
}
