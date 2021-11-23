import React from 'react'
import metadata from './block.json'
import { Props, Location } from '@ws/types'
import { LocationPicker } from '@ws/components'
import { useMeta } from '@ws/hooks'
import classnames from 'classnames'

declare const wp: any

const { useBlockProps } = wp.blockEditor
const {
  BaseControl,
  Button,
  DateTimePicker,
  Dropdown,
  TextareaControl,
  ToggleControl
} = wp.components
const { __ } = wp.i18n

type RenderToggle = {
  isOpen: boolean,
  onToggle: () => void
}

function to12Hour(h: number, m: number) {
  if (h > 12) {
    return h - 12 + ':' + ('0' + m).slice(-2) + ' PM'
  }
  return h + ':' + ('0' + m).slice(-2) + ' AM'
}

function dateString(date: string, hasTime: boolean) {
  const dateObject = date ? new Date(date) : false
  let output = dateObject ? `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear()}` : '--/--/--'
  output += dateObject && hasTime ? ' ' + to12Hour(dateObject.getHours(), dateObject.getMinutes()) : ''
  return output
}

export const metaEvent = {
  name: metadata.name,
  settings: {
    edit: (props: Props) => {
      const { setAttributes } = props
      const {
        dateTBD,
        noTime,
        startDate,
        endDate,
        hasLocation,
        locationName,
        locationStreet,
        locationCity,
        locationState,
        locationZip,
        locationOverride
      } = props.attributes
      const blockProps = useBlockProps()
      useMeta(setAttributes, metadata.attributes)
      return (
        <div { ...blockProps }>
          <div className="row">
            <div className="col">
              <BaseControl
                label={ __('Start Date', 'ws') }
                className={ classnames('components-date-time-picker', {
                  disabled: dateTBD
                }) }
              >
                <span className="date-display">{ `${dateString(startDate, !noTime)}` }</span>
                <Dropdown
                  renderToggle={ ({ isOpen, onToggle }: RenderToggle) => (
                    <Button
                      isSecondary
                      onClick={ onToggle }
                      aria-expanded={ isOpen }
                    >
                      { __('Edit', 'ws') }
                    </Button>
                  ) }
                  renderContent={ () => (
                    <DateTimePicker
                      is12Hour
                      currentDate={ startDate }
                      onChange={ (date: string) => setAttributes({ startDate: date }) }
                    />
                  ) }
                />
              </BaseControl>
            </div>
            <div className="col">
              <BaseControl
                label={ __('End Date', 'ws') }
                className={ classnames('components-date-time-picker', {
                  disabled: dateTBD
                }) }
              >
                <span className="date-display">{ `${dateString(endDate, !noTime)}` }</span>
                <Dropdown
                  renderToggle={ ({ isOpen, onToggle }: RenderToggle) => (
                    <Button
                      isSecondary
                      onClick={ onToggle }
                      aria-expanded={ isOpen }
                    >
                      { __('Edit', 'ws') }
                    </Button>
                  ) }
                  renderContent={ () => (
                    <DateTimePicker
                      is12Hour
                      currentDate={ endDate }
                      onChange={ (date: string) => setAttributes({ endDate: date }) }
                    />
                  ) }
                />
              </BaseControl>
            </div>
            <div className="col">
              <ToggleControl
                label={ __('No Specific Times', 'ws') }
                onChange={ (newValue: boolean) => setAttributes({ noTime: newValue }) }
                checked={ noTime }
              />
              <ToggleControl
                label={ __('Date TBD', 'ws') }
                checked={ dateTBD }
                onChange={ (newValue: boolean) => setAttributes({ dateTBD: newValue }) }
              />
            </div>
          </div>
          <hr />
          <ToggleControl
            label={ __('Location', 'ws') }
            checked={ hasLocation }
            onChange={ (newValue: boolean) => setAttributes({ hasLocation: newValue }) }
          />
          { hasLocation ? (
            <LocationPicker
              onChange={ (newValue: Location) => setAttributes({
                locationName: newValue.name, locationStreet: newValue.street, locationCity: newValue.city, locationState: newValue.state, locationZip: newValue.zip
              }) }
              location={ {
                name: locationName, street: locationStreet, city: locationCity, state: locationState, zip: locationZip
              } }
            />
          ) : (
            <TextareaControl
              placeholder={ __('Online, TBD, Multiple Locations, etc...') }
              label={ __('Location Alternative', 'ws') }
              onChange={ (newValue: string) => setAttributes({ locationOverride: newValue }) }
              value={ locationOverride }
            />
          ) }
        </div>
      )
    },
    save: () => {
      return null
    }
  }
}
