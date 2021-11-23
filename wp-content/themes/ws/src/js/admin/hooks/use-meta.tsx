import { useEffect } from 'react'

export function useMeta(
  setAttributes: (metas: Record<string, any>) => void,
  attributes: Record<string, any>
) {
  useEffect(() => {
    return () => {
      const metas: Record<string, any> = {}
      for (const attribute in attributes) {
        const metaType = attributes[attribute].type
        metas[attribute] = metaType === 'boolean' ? false : (metaType === 'number' ? 0 : '')
      }
      setAttributes(metas)
    }
  }, [])
}
