import * as options from './options/index'

for (const option in options) {
  const init = (options as Record<string, any>)[option]
  init()
}
