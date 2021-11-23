<?php
function _ws_block_icon_list($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-icon-list', ($a['className'] ?? '')];
  ob_start();
    echo $content;
  return _ws_block_wrapping($a, ob_get_clean(), 'ul');
}
