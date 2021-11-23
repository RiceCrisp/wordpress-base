<?php
function _ws_block_tabbed_panel($a = [], $content = '') {
  $heading = $a['heading'] ?? '';
  ob_start(); ?>
    <div
      id="panel-<?= uniqid() ?>"
      class="panel"
      data-heading="<?= $heading; ?>"
    >
      <?= $content; ?>
    </div>
  <?php
  return ob_get_clean();
}
