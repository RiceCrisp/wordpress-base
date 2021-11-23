<?php
function _ws_block_person($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-person', ($a['className'] ?? '')];
  $image = $a['image'] ?? '';
  ob_start(); ?>
    <?= _ws_image($image, ['size' => 'thumbnail']); ?>
    <div class="person-info">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
