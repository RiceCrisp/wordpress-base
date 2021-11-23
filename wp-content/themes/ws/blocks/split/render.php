<?php
function _ws_block_split($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-split', ($a['className'] ?? '')];
  $verticalAlignment = !empty($a['verticalAlignment']) ? 'align-items-' . $a['verticalAlignment'] : '';
  $mobileReverse = !empty($a['mobileReverse']) ? 'row-reverse' : '';
  $a['className'][] = $verticalAlignment;
  $a['className'][] = $mobileReverse;
  ob_start(); ?>
    <?= $content; ?>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
