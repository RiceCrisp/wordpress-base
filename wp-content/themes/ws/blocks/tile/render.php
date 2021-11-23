<?php
function _ws_block_tile($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-tile', ($a['className'] ?? '')];
  $size = $a['size'] ?? '';
  $a['className'][] = $size;
  ob_start(); ?>
    <?= _ws_block_background($a); ?>
    <div class="inner-tile">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
