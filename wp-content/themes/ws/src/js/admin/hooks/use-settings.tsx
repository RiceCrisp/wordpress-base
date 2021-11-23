import { useEffect, useState } from 'react'

declare const wp: any

const apiFetch = wp.apiFetch

export function useSettings(fields: Record<string, any>) {
  const keys = Object.keys(fields)
  const defaults = Object.values(fields)
  const [settings, setSettings] = useState(keys.length === 1 ? fields[keys[0]] : fields)
  useEffect(() => {
    apiFetch({ path: `/wp/v2/settings?_fields=${Object.keys(fields).join(',')}` })
      .then((res: any) => {
        if (keys.length === 1) {
          const result = res[keys[0]]
          setSettings(result === null ? defaults[0] : result)
        }
        else {
          setSettings(res)
        }
      })
      .catch((err: string) => {
        console.error('error', err)
      })
  }, [])
  return [settings, setSettings]
}
