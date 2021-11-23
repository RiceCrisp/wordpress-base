<?php
function _ws_block_kpi($a = []) {
  $a['className'] = ['wp-block-ws-kpi', ($a['className'] ?? '')];
  $value = $a['value'] ?? '';
  $label = $a['label'] ?? '';
  $animate = $a['animate'] ?? false;
  $classes = ['kpi-value'];
  if ($animate) {
    $classes[] = 'count';
  }
  $kpiClassesStyles = _ws_hex_to_classes_styles_array(
    $a['kpiColor'] ?? '',
    ['classes' => $classes]
  );
  ob_start(); ?>
    <p class="<?= implode(' ', $kpiClassesStyles['classes']); ?>" style="<?= implode(' ', $kpiClassesStyles['styles']); ?>" <?= $animate ? 'data-count="' . htmlspecialchars(str_replace(',', '', $value)) . '"' : ''; ?>>
      <?= $animate ? 0 : $value; ?>
    </p>
    <p class="kpi-label"><?= $label; ?></p>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
