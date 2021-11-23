const cacheName = 'WSv1'
const cachedFiles = [
  '/',
  '/offline/',
  '/404/', // 404 Resource can't return 404 itself
  '/manifest.json',
  '/wp-content/themes/ws/dist/css/wp/wp.css',
  '/wp-content/themes/ws/dist/js/wp/wp.js',
  'https://fonts.googleapis.com/css?family=Open+Sans:300,400,700'
]
const networkFirst = true
console.log = () => {} // Disable for status logging

self.addEventListener('install', e => {
  console.log('Installing Service Worker')
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(cachedFiles)
      })
      .then(() => {
        return self.skipWaiting()
      })
      .catch(err => {
        console.log('Cache Failed', err)
      })
  )
})

self.addEventListener('activate', e => {
  console.log('Service Worker Activated')
  e.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== cacheName) {
            console.log('Removing Old Cache', key)
            return caches.delete(key)
          }
        }))
      })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', e => {
  console.log('Fetch Event', e.request.url)
  // Network first pattern
  if (networkFirst) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          return caches.open(cacheName).then(cache => {
            // Don't cache POST or browser-sync requests
            if (e.request.method === 'POST' || e.request.url.includes('browser-sync/socket.io')) {
              return res
            }
            console.log('Adding request to cache')
            cache.put(e.request, res.clone())
            return res
          })
        })
        .catch(function() {
          console.log('Fetch request failed.')
          return caches.match(e.request).then(res => {
            if (res) {
              console.log('Found ' + e.request.url + ' in cache')
              return res
            }
            console.log('Offline')
            return caches.match('/offline/')
          })
        })
    )
  }
  // Cache first pattern
  else {
    e.respondWith(
      caches.match(e.request)
        .then(res => {
          if (res) {
            console.log('Found ' + e.request.url + ' in cache')
            return res
          }
          console.log('Network request for ' + e.request.url)
          return fetch(e.request).then(res => {
            console.log(res)
            if (res.status == 404) {
              console.log('404')
              return caches.match('/404/')
            }
            return caches.open(cacheName).then(cache => {
              // Don't cache POST or browser-sync requests
              if (e.request.method === 'POST' || e.request.url.includes('browser-sync/socket.io')) {
                return res
              }
              console.log('Adding new request to cache')
              cache.put(e.request, res.clone())
              return res
            })
          })
        })
        .catch(function() {
          console.log('Offline')
          return caches.match('/offline/')
        })
    )
  }
})

// self.addEventListener('notificationclose', e => {
//   console.log(e.notification.data)
//   e.notification.close()
// })

// self.addEventListener('push', e => {
//   console.log('Push Message Received')
//   e.waitUntil(f
//     self.registration.showNotification('Test Notification')
//   )
// })
