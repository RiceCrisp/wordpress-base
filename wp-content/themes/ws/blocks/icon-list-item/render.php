<?php
function _ws_block_icon_list_item($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-icon-list-item', ($a['className'] ?? '')];
  $icon = $a['icon'] ?? '';
  $iconClassesStyles = _ws_hex_to_classes_styles_array(
    $a['iconColor'] ?? '',
    ['classes' => ['icon-svg']]
  );
  $text = $a['text'] ?? '';
  ob_start();
    echo '[svg id="' . $icon . '" class="' . implode(' ', $iconClassesStyles['classes']) . '" style="' . implode(';', $iconClassesStyles['styles']) . '"]<span>' . $text . '</span>';
  return _ws_block_wrapping($a, ob_get_clean(), 'li');
}
