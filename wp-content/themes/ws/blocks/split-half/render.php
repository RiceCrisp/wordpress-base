<?php
function _ws_block_split_half($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-split-half', ($a['className'] ?? '')];
  $extendTop = !empty($a['extendTop']) ? 'extend-top' : '';
  $extendBottom = !empty($a['extendBottom']) ? 'extend-bottom' : '';
  $width = !empty($a['width']) ? 'col-' . $a['width'] : '';
  $sticky = !empty($a['sticky']) ? 'sticky' : '';
  $verticalAlignment = !empty($a['verticalAlignment']) ? 'align-self-' . $a['verticalAlignment'] : '';
  $a['className'][] = $extendTop;
  $a['className'][] = $extendBottom;
  $a['className'][] = $width;
  $a['className'][] = $sticky;
  $a['className'][] = $verticalAlignment;
  ob_start(); ?>
    <div class="split-half-inner">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
