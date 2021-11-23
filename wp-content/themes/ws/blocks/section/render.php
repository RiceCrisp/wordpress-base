<?php
function _ws_block_section($a, $content) {
  $a['className'] = ['wp-block-ws-section', ($a['className'] ?? '')];
  $width = !empty($a['width']) ? 'width-' . $a['width'] : '';
  $fullScreen = !empty($a['fullScreen']) ? 'full-screen' : '';
  $autoPaddingTop = $a['autoPaddingTop'] ?? '';
  $autoPaddingBottom = $a['autoPaddingBottom'] ?? '';
  $manualPaddingTop = $a['manualPaddingTop'] ?? '';
  $manualPaddingBottom = $a['manualPaddingBottom'] ?? '';
  $paddingTop = $manualPaddingTop !== '' ? $manualPaddingTop : $autoPaddingTop;
  $paddingBottom = $manualPaddingBottom !== '' ? $manualPaddingBottom : $autoPaddingBottom;
  $a['className'][] = $width;
  $a['className'][] = $fullScreen;
  $a['className'][] = $paddingTop !== '' ? 'padding-top-' . $paddingTop : '';
  $a['className'][] = $paddingBottom !== '' ? 'padding-bottom-' . $paddingBottom : '';
  ob_start(); ?>
    <?= _ws_block_background($a); ?>
    <div class="container section-container">
      <div class="section-inner">
        <?= $content; ?>
      </div>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'section');
}
