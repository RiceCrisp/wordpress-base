export const buttonExample = {
  hook: 'blocks.registerBlockType',
  name: 'ws/with-button-example',
  func: (settings: any) => {
    if (settings.name === 'core/button') {
      return {
        ...settings,
        example: {
          attributes: {
            ...settings.example.attributes,
            backgroundColor: ''
          }
        }
      }
    }
    return settings
  }
}
