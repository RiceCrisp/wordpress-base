import React from 'react'

declare const wp: any

const { CheckboxControl } = wp.components

type Option = {
  label: string,
  value: string,
  children?: Option[]
}

type ComponentProps = {
  filter?: (label: string) => boolean,
  label?: string,
  legend?: string,
  onChange: (newValue: string[]) => void,
  options: Option[],
  value: string[]
}

export function CheckboxGroup(props: ComponentProps) {
  const {
    filter,
    onChange,
    options,
    value
  } = props
  return (
    <ul className="components-checkbox-group">
      { options.map((option, index) => (
        <li
          key={ index }
        >
          <CheckboxControl
            label={ option.label }
            className={ filter && !filter(option.label) ? 'hide' : '' }
            onChange={ (newValue: string) => {
              if (newValue) {
                onChange([...value, option.value])
              }
              else {
                const index = value.indexOf(option.value)
                const temp = [...value]
                temp.splice(index, 1)
                onChange(temp)
              }
            } }
            checked={ value.includes(option.value) }
          />
          { option.children && !!option.children.length && (
            <CheckboxGroup { ...props } options={ option.children } />
          ) }
        </li>
      ))}
    </ul>
  )
}

export function CheckboxGroupControl(props: ComponentProps) {
  const {
    label,
    legend
  } = props
  return (
    <fieldset className="components-checkbox-group-control">
      { (!!legend || !!label) && (
        <legend>{ legend || label }</legend>
      ) }
      <CheckboxGroup { ...props } />
    </fieldset>
  )
}
