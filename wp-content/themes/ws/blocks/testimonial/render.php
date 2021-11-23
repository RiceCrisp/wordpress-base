<?php
function _ws_block_testimonial($a = []) {
  $a['className'] = ['wp-block-ws-testimonial', ($a['className'] ?? '')];
  $image = $a['image'] ?? '';
  $quote = $a['quote'] ?? '';
  $citation = $a['citation'] ?? '';
  ob_start(); ?>
    <blockquote>
      <?= $image ? _ws_image($image, ['class' => 'quote-image', 'size' => 'thumbnail']) : ''; ?>
      <p class="quote"><?= $quote; ?></p>
      <?= $citation ? '<cite class="citation">' . $citation . '</cite>' : ''; ?>
    </blockquote>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
