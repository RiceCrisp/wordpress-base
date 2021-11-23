function init() {
  function receiveMessage(e: MessageEvent) {
    if (e.data.height && (e.data.name || e.data.url)) {
      const form = e.data.name ? document.querySelector<HTMLElement>(`iframe[name^="${e.data.name}"]`) : document.querySelector<HTMLElement>(`iframe[src="${e.data.url}"]`)
      if (form) {
        form.style.height = `${e.data.height}px`
      }
    }
  }
  window.addEventListener('message', receiveMessage, false)

  // Don't use this function here, use it in the iframe
  // window.addEventListener('load', function() {
  //   sendMessage()
  // })
  // window.addEventListener('resize', function() {
  //   sendMessage()
  // })
  // function sendMessage() {
  //   var docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight)
  //   if (window.location.href) {
  //     window.parent.postMessage({ 'url': window.location.href, 'height': docHeight }, '*')
  //   }
  // }
}

export { init }
