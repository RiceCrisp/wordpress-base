<?php
function _ws_block_layout_column($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-layout-column', ($a['className'] ?? '')];
  $width = !empty($a['width']) ? 'col-' . $a['width'] : '';
  $verticalAlignment = !empty($a['verticalAlignment']) ? 'align-self-' . $a['verticalAlignment'] : '';
  $a['className'][] = $width;
  $a['className'][] = $verticalAlignment;
  ob_start(); ?>
    <?= $content; ?>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
