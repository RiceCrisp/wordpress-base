// Service worker logic for PWA's
function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(res => {
        console.log('ServiceWorker registration successful with scope: ', res.scope)
        if ('PushManager' in window) {
          console.log('Notifications supported.')
          console.log(Notification.permission)
          if (Notification.permission === 'default') {
            Notification.requestPermission((status) => {
              console.log('Notification status: ', status)
              if (status === 'granted') {
                // subscribeUser(res)
              }
            })
          }
          // notify('Test Notification', {
          //   body: 'This is the body content.',
          //   // icon: '',
          //   data: {
          //     timestamp: Date.now(),
          //     loc: '/'
          //   },
          //   actions: [
          //     { action: 'go', title: 'Go Now' }
          //   ]
          // })
        }
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err)
      })
  }
}

// function subscribeUser(res) {
//   console.log('Subscribing user')
//   const applicationServerKey = urlBase64ToUint8Array('BHdr03Mr4ZU7A2C0kfLCtFQ_Dsl3vFVZL251jtAwVJC_bwKm9p8XIPD38x0BR7mgKjVACAhuCi6LTWWa1gMfOqM=')
//   const options = { userVisibleOnly: true, applicationServerKey: applicationServerKey }
//   return res.pushManager.subscribe(options)
//     .then(subscription => {
//       sendSubscriptionToBackEnd(subscription)
//     })
//     .catch(err => {
//       console.log('Failed to subscribe the user: ', err)
//     })
// }
//
// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4)
//   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
//   const rawData = window.atob(base64)
//   const outputArray = new Uint8Array(rawData.length)
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i)
//   }
//   return outputArray
// }
//
// function sendSubscriptionToBackEnd(subscription) {
//   console.log(subscription)
// }
//
// function notify(title, options) {
//   if (Notification.permission === 'granted') {
//     navigator.serviceWorker.ready.then(registration => {
//       registration.showNotification(title, options)
//     })
//   }
// }

export { init }
