<?php
function _ws_block_accordion($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-accordion', ($a['className'] ?? '')];
  $heading = $a['heading'] ?? '';
  $id = uniqid();
  ob_start(); ?>
    <h3>
      <button
        id="accordion-button-<?= $id; ?>"
        class="accordion-button closed"
        aria-expanded="false"
        aria-controls="accordion-panel-<?= $id; ?>"
      >
        <span class="accordion-heading"><?= $heading; ?></span>
        <svg class="accordion-icon" viewBox="0 0 24 24">
          <path class="down" d="M12 0 L12 24Z"></path>
          <path class="across" d="M0 12 L24 12Z"></path>
        </svg>
      </button>
    </h3>
    <div
      id="accordion-panel-<?= $id; ?>"
      class="accordion-panel closed"
      role="region"
      aria-labelledby="accordion-button-<?= $id; ?>"
      hidden="hidden"
    >
      <div>
        <?php
        // Lazy loaded images can alter the height, so we disable lazy load for accordion content
        $content = preg_replace('/<img([^>]*?)class=["\'](.*?)["\'](.*?)>/', '<img$1 class="$2 no-lazy"$3>', $content);
        $content = preg_replace('/<img(?![^>]*class[^>]*>)([^>]*?)>/', '<img class="no-lazy"$1>', $content);
        echo $content; ?>
      </div>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
