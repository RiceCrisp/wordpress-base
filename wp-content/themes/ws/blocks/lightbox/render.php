<?php
function _ws_block_lightbox($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-lightbox', ($a['className'] ?? '')];
  $id = $a['anchor'] ?? 'lightbox-' . uniqid();
  $variation = $a['variation'] ?? 'button';
  $buttonText = $a['buttonText'] ?? '';
  $preview = $a['preview'] ?? '';
  $width = !empty($a['width']) ? 'width-' . $a['width'] : '';
  $a['className'][] = 'variation-' . $variation;
  ob_start();
    if ($variation === 'button') : ?>
      <button class="lightbox-button" aria-controls="<?= $id; ?>">
        <?= $buttonText; ?>
      </button>
      <?php
    else : ?>
      <?= _ws_image($preview, ['class' => 'preview-image', 'size' => 'full']); ?>
      <button class="lightbox-button" aria-label="<?= __('Open Lightbox', 'ws'); ?>" aria-controls="<?= $id; ?>">
        <span class="lightbox-button-icon">
          <svg viewBox="0 0 24 24" fillRule="evenodd"><path d="M5 2 L22 12 L5 22 Z"/></svg>
        </span>
      </button>
      <?php
    endif; ?>
    <div id="<?= $id; ?>" class="lightbox <?= $width; ?>" role="dialog" aria-modal="true">
      <div class="container">
        <div class="row">
          <div class="lightbox-inner">
            <button class="lightbox-close" aria-label="<?= __('Close Lightbox', 'ws'); ?>">
              <svg viewBox="0 0 24 24" fillRule="evenodd">
                <title>Close</title>
                <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/>
              </svg>
            </button>
            <div class="lightbox-content">
              <?= $content; ?>
            </div>
          </div>
        </div>
      </div>
    </div>
    <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
