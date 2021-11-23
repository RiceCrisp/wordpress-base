import React from 'react'
import { arrayMove } from '@ws/utils'

type ComponentProps = {
  chips: { id: number, name: string }[],
  controls?: boolean,
  onChange: (newValue: number[]) => void
}

export function Chips(props: ComponentProps) {
  const {
    chips,
    controls,
    onChange
  } = props
  const ids = chips.map(chip => chip.id)
  return (
    <ul className="components-chips">
      { !!chips && chips.map((chip, index) => (
        <li key={ chip.id } className="chip">
          <span>{ chip.name }</span>
          <div className="controls">
            { !!controls && (
              <>
                <button
                  className="move-up-button"
                  disabled={ index <= 0 }
                  onClick={ e => {
                    e.preventDefault()
                    const newArray = [...arrayMove(ids, index, index - 1)]
                    onChange(newArray)
                  } }
                >
                  <svg viewBox="0 0 10 10">
                    <path d="M3 6 L5 4 L7 6" />
                  </svg>
                </button>
                <button
                  className="move-down-button"
                  disabled={ index >= chips.length - 1 }
                  onClick={ e => {
                    e.preventDefault()
                    const newArray = [...arrayMove(ids, index, index + 1)]
                    onChange(newArray)
                  } }
                >
                  <svg viewBox="0 0 10 10">
                    <path d="M3 4 L5 6 L7 4" />
                  </svg>
                </button>
              </>
            ) }
            { !!onChange && (
              <button
                className="remove-button"
                onClick={ e => {
                  e.preventDefault()
                  if (!!chips && chips.length > 1) {
                    const newArray = [...ids.filter((v, i) => i !== index)]
                    onChange(newArray)
                  }
                  else {
                    onChange([])
                  }
                } }
              >
                <svg viewBox="0 0 10 10">
                  <path d="M3 3 L7 7" />
                  <path d="M7 3 L3 7" />
                </svg>
              </button>
            ) }
          </div>
        </li>
      )) }
    </ul>
  )
}
