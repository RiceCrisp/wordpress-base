<?php
function _ws_block_svg_animation($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-svg-animation', ($a['className'] ?? '')];
  $json = $a['json'] ?? '';
  $loop = !empty($a['loop']) ? 'data-loop="1"' : '';
  ob_start(); ?>
    <div
      class="svg-animation"
      data-name="<?= uniqid('svg-animation-'); ?>"
      data-json="<?= urlencode($json); ?>"
      <?= $loop; ?>
    ></div>
    <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
