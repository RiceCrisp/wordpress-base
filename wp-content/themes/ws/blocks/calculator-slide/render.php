<?php
function _ws_block_calculator_slide($a = [], $content = '') {
  $position = $a['position'] ?? 0;
  $heading = $a['heading'] ?? '';
  $body = $a['body'] ?? '';
  ob_start(); ?>
    <div class="slide" v-show="step === <?= $position; ?>" ref="<?= $position; ?>" key="<?= $position; ?>">
      <h2><?= $heading; ?></h2>
      <?= $content; ?>
      <div class="row justify-content-between">
        <div class="col">
          <button class="button-arrow-back previous-button" @click.prevent="changeStep(<?= $position-1; ?>)">Previous</button>
        </div>
        <div class="col text-right">
          <button class="button-arrow next-button" @click.prevent="changeStep(<?= $position+1; ?>)">Next</button>
        </div>
      </div>
    </div>
  <?php
  return ob_get_clean();
}
