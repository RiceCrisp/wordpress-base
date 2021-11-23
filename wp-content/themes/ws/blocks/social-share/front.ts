const shareButtons = document.querySelectorAll<HTMLElement>('.wp-block-ws-social-share a')
for (let i = 0; i < shareButtons.length; i++) {
  const shareButton = shareButtons[i]
  shareButton.addEventListener('click', e => {
    e.preventDefault()
    window.open(shareButton.getAttribute('href') || '', shareButton.getAttribute('target') || '', 'resizeable,width=550,height=520')
  })
}
