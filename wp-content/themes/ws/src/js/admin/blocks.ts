import theme from '@ws/theme'
import * as blocks from '../../../blocks'
import * as filters from './filters'
import * as formats from './formats'
import * as plugins from './plugins'
import * as stores from './stores'
import { removeStyles, styles } from './styles'

declare const wp: any
declare const locals: any

const {
  registerBlockStyle,
  registerBlockType,
  registerBlockVariation,
  unregisterBlockType
} = wp.blocks
const { createReduxStore, register } = wp.data
const { registerPlugin } = wp.plugins
const { registerFormatType } = wp.richText

// Add filters (must come before block registration)
for (const prop in filters) {
  const filter = (filters as Record<string, any>)[prop]
  const { hook, name, func } = filter
  wp.hooks.addFilter(hook, name, func)
}

// Register blocks
for (const prop in blocks) {
  const block = (blocks as Record<string, any>)[prop]
  const { name, settings, variations } = block
  registerBlockType(name, settings)
  if (variations) {
    registerBlockVariation(name, variations)
  }
}

// Register formats
for (const prop in formats) {
  const format = (formats as Record<string, any>)[prop]
  const { name, args } = format
  registerFormatType(name, args)
}

// Register plugins
if (wp.editPost) {
  for (const prop in plugins) {
    const plugin = (plugins as Record<string, any>)[prop]
    const { name, args } = plugin
    registerPlugin(name, args)
  }
}

// Register stores
for (const prop in stores) {
  const store = (stores as Record<string, any>)[prop]
  const {
    name,
    reducer,
    actions,
    selectors
  } = store
  const reduxStore = createReduxStore(name, {
    reducer,
    actions,
    selectors
  })
  register(reduxStore)
}

// Remove/modify some default styles and add our own
wp.domReady(() => {
  removeStyles()
  styles.forEach(v => {
    registerBlockStyle(v.name, v.args)
  })
})

// Remove some default blocks
wp.domReady(() => {
  theme.unregisterBlocks.forEach(block => {
    unregisterBlockType(block)
  })
  if (['post', 'case_study', 'event', 'job', 'news', 'person', 'resource'].includes(locals.postType)) {
    unregisterBlockType('ws/section')
  }
})
