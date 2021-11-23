declare const google: any
declare const locals: any

(window as any).initMap = function() {
  const options = {
    styles: locals.googleMapsStyles ? JSON.parse(locals.googleMapsStyles) : [],
    zoom: 14,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    controlSize: 30
  }
  initMaps(options)
}

function initMaps(options: { styles: Record<string, any>, zoom: number }) {
  document.querySelectorAll('div.google-map').forEach(el => {
    const locations = JSON.parse(decodeURIComponent(el.getAttribute('data-locations') || ''))
    const styles = JSON.parse(decodeURIComponent(el.getAttribute('data-styles') || ''))
    options.styles = styles || options.styles
    const map = new google.maps.Map(el, options)
    const bounds = new google.maps.LatLngBounds()
    const locationMarkers = []
    locations.forEach((location: { [index: string]: string }) => {
      if (location.coordinates) {
        const position = {
          lat: Number(location.coordinates.split(',')[0]),
          lng: Number(location.coordinates.split(',')[1])
        }
        locationMarkers.push({
          ...location,
          ...createMarker(
            map,
            position,
            `<p>${location.name ? `<b>${location.name}</b><br />` : ''}${location.street ? location.street.replace(/\n/g, '<br />') : ''}<br />${location.city}, ${location.state} ${location.zip}</p><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.street + ', ' + location.city + ', ' + location.state + ', ' + location.zip)}" target="_blank" rel="noopener">Get Directions</a>`
          )
        })
        bounds.extend(position)
      }
    })
    map.fitBounds(bounds)
    if (locations.length === 1) {
      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        map.setZoom(options.zoom)
      })
    }
  })
}

function createMarker(map: HTMLElement, position: { lat: number, lng: number }, html: string) {
  const marker = new google.maps.Marker({
    map: map,
    position: position
  })
  const infoWindow = new google.maps.InfoWindow({
    content: `<div class="google-map-info-window">${html}</div>`
  })
  marker.addListener('click', () => {
    infoWindow.open(map, marker)
  })

  return {
    marker: marker,
    infoWindow: infoWindow
  }
}
