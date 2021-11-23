<?php
function _ws_block_select_content($a = []) {
  $a['className'] = ['wp-block-ws-select-content', ($a['className'] ?? '')];
  $sideScroll = !empty($a['sideScroll']) ? 'side-scroll' : '';
  $ids = $a['ids'] ?? [];
  $ids = array_values(array_filter($ids, function($id) {
    $post = get_post($id);
    return $post && $post->post_status === 'publish';
  }));
  $type = isset($a['type']) && $a['type'] !== 'default' ? $a['type'] : (isset($ids[0]) ? get_post_type($ids[0]) : 'none');
  ob_start();
  global $post;
  foreach ($ids as $id) {
    $post = get_post($id);
    setup_postdata($post);
    get_template_part('parts/archive', $type);
  }
  wp_reset_postdata();
  $output = ob_get_clean();
  ob_start(); ?>
    <div class="row <?= $type; ?>-row row-count-<?= count($ids); ?> <?= $sideScroll; ?>">
      <?= $output; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
