<?php
function _ws_block_spacer($a = []) {
  $a['className'] = ['wp-block-ws-spacer', ($a['className'] ?? '')];
  $height = $a['height'] ?? '';
  $a['className'][] = $height;
  return _ws_block_wrapping($a, '', 'div');
}
