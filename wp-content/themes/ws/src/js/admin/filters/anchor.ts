export const anchorAttributes = {
  hook: 'blocks.registerBlockType',
  name: 'ws/with-anchor-attributes',
  func: (props: Record<string, any>) => {
    if (props.supports && props.supports.anchor) {
      props.attributes = {
        ...props.attributes,
        anchor: {
          type: 'string'
        }
      }
    }
    return props
  }
}
