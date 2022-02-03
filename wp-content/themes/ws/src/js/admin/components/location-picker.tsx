import React, { useEffect, useRef, useState } from 'react'
import { Location } from '@ws/types'
import { useSettings } from '@ws/hooks'

declare const wp: any
declare const google: any

const { BlockControls } = wp.blockEditor
const {
  Button,
  Placeholder,
  TextControl,
  ToolbarButton,
  ToolbarGroup
} = wp.components
const { __ } = wp.i18n

type ComponentProps = {
  className?: string,
  styles?: Record<string, any>,
  onChange: (arg: Location) => void,
  location: Location
}

export function LocationPicker(props: ComponentProps) {
  const {
    className = '',
    styles,
    onChange,
    location
  } = props
  const [map, setMap] = useState(null)
  const [geocoder, setGeocoder] = useState(null)
  const [marker, setMarker] = useState([])
  const [statusText, setStatusText] = useState('Loading...')
  const [view, setView] = useState('edit')
  const googleMap = useRef(null)

  const [mapStyles] = useSettings({ google_maps_styles: '' })
  const [mapKey] = useSettings({ google_maps_key: '' })

  useEffect(() => {
    const mapLoad = () => {
      const mapInstance = new google.maps.Map(googleMap.current, {
        zoom: 3,
        center: { lat: 37, lng: 95 },
        styles: styles || mapStyles ? JSON.parse(styles || mapStyles) : []
      })
      const geocoderInstance = new google.maps.Geocoder()
      const markerInstance = new google.maps.Marker()
      setMap(mapInstance)
      setGeocoder(geocoderInstance)
      setMarker(markerInstance)
      updateMap(mapInstance, geocoderInstance, markerInstance)
    }
    const scriptElement = document.querySelector('[src*="https://maps.googleapis.com/maps/api/js?key="]')
    if (scriptElement) {
      scriptElement.addEventListener('load', mapLoad)
    }
    else if (mapKey) {
      const googleMapScript = document.createElement('script')
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}`
      window.document.body.appendChild(googleMapScript)
      googleMapScript.addEventListener('load', mapLoad)
    }
  }, [mapKey])

  useEffect(() => {
    if (map && geocoder && marker) {
      updateMap(map, geocoder, marker)
    }
  }, [view, styles])

  function updateMap(map: any, geocoder: any, marker: any) {
    const locationString = `${location?.name || ''} ${location?.street || ''} ${location?.city || ''} ${location?.state || ''} ${location?.zip || ''}`
    if (!locationString) {
      setStatusText(__('Location Not Found', 'ws'))
    }
    else {
      geocoder.geocode({ address: locationString }, (results: any, status: string) => {
        switch (status) {
          case 'OK': {
            const position = results[0].geometry.location
            onChange({ ...location, coordinates: `${position.lat()},${position.lng()}` })
            marker.setPosition(position)
            marker.setMap(map)
            map.setCenter(position)
            map.setZoom(12)
            setStatusText('OK')
            break
          }
          case 'ZERO_RESULTS': {
            setStatusText(__('Location Not Found', 'ws'))
            onChange({ ...location, coordinates: '' })
            break
          }
          case 'REQUEST_DENIED': {
            setStatusText(__('Missing Google Maps API Key', 'ws'))
            onChange({ ...location, coordinates: '' })
            break
          }
          default: {
            setStatusText(__('Google Maps API Error', 'ws'))
            onChange({ ...location, coordinates: '' })
          }
        }
      })
    }
  }

  return (
    <div className={ `components-location-picker ${className}` }>
      <div
        className="google-map"
        ref={ googleMap }
        style={ { display: view === 'preview' && statusText === 'OK' ? 'block' : 'none' } }
      ></div>
      { view === 'edit' && (
        <Placeholder
          icon="location-alt"
          label={ __('Google Map', 'ws') }
          instructions={ __('Enter a location and click "Preview" to test that Google Maps can find it.', 'ws') }
        >
          <form
            className="edit-form"
            onSubmit={ e => {
              e.preventDefault()
              setView('preview')
            } }
          >
            <TextControl
              placeholder={ __('Name (Optional)', 'ws') }
              onChange={ (newValue: string) => onChange({ ...location, name: newValue }) }
              value={ location?.name }
            />
            <TextControl
              placeholder={ __('Street', 'ws') }
              onChange={ (newValue: string) => onChange({ ...location, street: newValue }) }
              value={ location?.street }
            />
            <TextControl
              placeholder={ __('City', 'ws') }
              onChange={ (newValue: string) => onChange({ ...location, city: newValue }) }
              value={ location?.city }
            />
            <TextControl
              placeholder={ __('State', 'ws') }
              onChange={ (newValue: string) => onChange({ ...location, state: newValue }) }
              value={ location?.state }
            />
            <TextControl
              placeholder={ __('Zip Code', 'ws') }
              onChange={ (newValue: string) => onChange({ ...location, zip: newValue }) }
              value={ location?.zip }
            />
            { location && (
              <Button
                isPrimary
                type="submit"
              >
                { __('Preview', 'ws') }
              </Button>
            ) }
          </form>
        </Placeholder>
      ) }
      { view === 'preview' && (
        <>
          <BlockControls>
            <ToolbarGroup>
              <ToolbarButton
                label={ __('Edit Location', 'ws') }
                icon="edit"
                onClick={ () => setView('edit') }
              />
            </ToolbarGroup>
          </BlockControls>
          { statusText !== 'OK' && (
            <Placeholder
              icon="location-alt"
              label={ statusText }
            />
          ) }
        </>
      ) }
    </div>
  )
}
