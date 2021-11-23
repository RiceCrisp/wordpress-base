<?php
function _ws_block_card($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-card', ($a['className'] ?? '')];
  $clickable = !empty($a['clickable']) ? 'card-link' : '';
  $padding = !empty($a['padding']) ? 'extra-padding' : '';
  $image = $a['image'] ?? '';
  $imageX = $a['imageX'] ?? '';
  $imageY = $a['imageY'] ?? '';
  $objectPosition = $imageX && $imageY ? ($imageX * 100) . '% ' . ($imageY * 100) . '%' : '';
  $imagePosition = !empty($a['imagePosition']) ? 'image-' . $a['imagePosition'] : '';
  $cardClasses = ['card'];
  $cardClasses[] = $imagePosition;
  $cardClasses[] = $clickable;
  $cardClasses[] = $padding;
  ob_start(); ?>
    <div class="<?= implode(' ', array_filter($cardClasses)); ?>">
      <?= _ws_block_background($a); ?>
      <?php
      if ($image) : ?>
        <!-- <div class="object-fit-container card-image"> -->
          <?= _ws_image($image, ['objectPosition' => $objectPosition, 'class' => 'card-image']); ?>
        <!-- </div> -->
        <?php
      endif; ?>
      <div class="card-body">
        <?= $content; ?>
      </div>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
