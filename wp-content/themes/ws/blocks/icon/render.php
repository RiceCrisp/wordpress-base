<?php
function _ws_block_icon($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-icon', ($a['className'] ?? '')];
  $icon = $a['icon'] ?? '';
  $size = $a['size'] ?? 'artboard';
  $text = $a['text'] ?? false;
  $iconClassesStyles = _ws_hex_to_classes_styles_array(
    $a['iconColor'] ?? '',
    [
      'type' => 'color',
      'classes' => ['icon-svg', 'size-' . $size]
    ]
  );
  $iconClassesStyles = _ws_hex_to_classes_styles_array(
    $a['iconBackgroundColor'] ?? '',
    [
      'type' => 'background-color',
      'classes' => $iconClassesStyles['classes'],
      'styles' => $iconClassesStyles['styles']
    ]
  );
  $iconClassesStyles = _ws_hex_to_classes_styles_array(
    $a['iconBackgroundGradient'] ?? '',
    [
      'type' => 'gradient',
      'classes' => $iconClassesStyles['classes'],
      'styles' => $iconClassesStyles['styles']
    ]
  );
  $a['className'][] = $text;
  ob_start(); ?>
    <div class="<?= implode(' ', $iconClassesStyles['classes']); ?>" style="<?= implode(';', $iconClassesStyles['styles']); ?>">
      <?= '[svg id="' . $icon . '"]'; ?>
    </div>
    <?php
    if ($text) : ?>
      <div class="icon-text">
        <?= $content; ?>
      </div>
      <?php
    endif; ?>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
