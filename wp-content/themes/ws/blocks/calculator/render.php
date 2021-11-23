<?php
function _ws_block_calculator($a = [], $content = '') {
  // Replaced > with &gt; 🤷
  $a['className'] = ['wp-block-ws-calculator', ($a['className'] ?? '')];
  $headings = $a['headings'] ?? [];
  $fields = $a['fields'] ?? [];
  ob_start(); ?>
    <div class="container">
      <ul class="slides-nav">
        <?php
        foreach ($headings as $i=>$heading) : ?>
          <li>
            <button @click.prevent="changeStep(<?= $i; ?>)" :disabled="<?= $i; ?> &gt; step"><?= $heading; ?></button>
          </li>
          <?php
        endforeach; ?>
      </ul>
    </div>
    <div class="container">
      <?php
      foreach ($fields as $field) {
        echo '<input name="' . $field['slug'] . '" v-model="data.' . $field['slug'] . '" type="hidden" value="' . $field['value'] . '" />';
      } ?>
      <transition-group class="slides" name="fade" mode="out-in" tag="div">
        <?= $content; ?>
      </transition-group>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
