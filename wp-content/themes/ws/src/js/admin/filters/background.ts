export const backgroundAttributes = {
  hook: 'blocks.registerBlockType',
  name: 'ws/with-background-attributes',
  func: (props: Record<string, any>) => {
    if (props.supports && props.supports.backgroundMedia) {
      props.attributes = {
        ...props.attributes,
        backgroundMedia: {
          type: 'number'
        },
        backgroundVideoPoster: {
          type: 'number'
        },
        backgroundX: {
          type: 'string',
          default: '0.5'
        },
        backgroundY: {
          type: 'string',
          default: '0.5'
        },
        backgroundSize: {
          type: 'string'
        },
        backgroundOverlay: {
          type: 'boolean'
        },
        backgroundParallax: {
          type: 'boolean'
        }
      }
    }
    return props
  }
}
