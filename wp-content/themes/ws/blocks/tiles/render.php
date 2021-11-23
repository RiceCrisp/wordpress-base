<?php
function _ws_block_tiles($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-tiles', ($a['className'] ?? '')];
  $gutters = !empty($a['gutters']) ? 'has-gutters' : '';
  $a['className'][] = $gutters;
  ob_start(); ?>
    <?= $content; ?>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
