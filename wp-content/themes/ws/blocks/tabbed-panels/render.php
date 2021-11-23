<?php
function _ws_block_tabbed_panels($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-tabbed-panels', ($a['className'] ?? '')];
  $orientation = $a['orientation'] ?? 'horizontal';
  $a['className'][] = $orientation;
  ob_start(); ?>
    <div class="col-xs-12 tabs"></div>
    <div class="col-xs-12 panels">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
