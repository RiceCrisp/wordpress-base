<?php
function _ws_block_layout_row($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-layout-row', ($a['className'] ?? '')];
  $verticalAlignment = !empty($a['verticalAlignment']) ? 'align-items-' . $a['verticalAlignment'] : '';
  $sideScroll = !empty($a['sideScroll']) ? 'side-scroll' : '';
  $a['className'][] = $verticalAlignment;
  $a['className'][] = $sideScroll;
  ob_start(); ?>
    <?= $content; ?>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
