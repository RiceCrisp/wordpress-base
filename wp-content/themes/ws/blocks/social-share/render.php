<?php
function _ws_block_social_share($a = []) {
  $a['className'] = ['wp-block-ws-social-share', ($a['className'] ?? '')];
  $pdf = $a['pdf'] ?? '';
  ob_start(); ?>
    <?= $pdf ? '<a class="share-button" href="' . wp_get_attachment_url($pdf) . '" target="_blank" rel="noopener noreferrer">' . do_shortcode('[svg id="download"]') . '</a>' : ''; ?>
    <a class="share-button" href="mailto:?subject=<?= urlencode(get_the_title()); ?>&amp;body=<?= get_permalink(); ?>" target="_blank" rel="noopener noreferrer">
      <?= do_shortcode('[svg id="mail"]'); ?>
    </a>
    <a class="share-button" href="https://www.linkedin.com/sharing/share-offsite/?url=<?= urlencode(get_permalink()); ?>" target="_blank" rel="noopener noreferrer">
      <?= do_shortcode('[svg id="linkedin"]'); ?>
    </a>
    <a class="share-button" href="https://www.facebook.com/sharer/sharer.php?u=<?= urlencode(get_permalink()); ?>" target="_blank" rel="noopener noreferrer">
      <?= do_shortcode('[svg id="facebook"]'); ?>
    </a>
    <a class="share-button" href="https://twitter.com/intent/tweet?url=<?= urlencode(get_permalink()); ?>" target="_blank" rel="noopener noreferrer">
      <?= do_shortcode('[svg id="twitter"]'); ?>
    </a>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
