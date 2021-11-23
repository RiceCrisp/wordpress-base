<?php
function _ws_block_children($a = []) {
  $a['className'] = ['wp-block-ws-children', ($a['className'] ?? '')];
  $parent = $a['parent'] ?? get_the_ID();
  $type = isset($a['type']) && $a['type'] !== 'default' ? $a['type'] : get_post_type($parent);
  $numPosts = $a['numPosts'] ?? 3;
  $numPosts = !empty($a['allPosts']) ? -1 : $numPosts;
  $sideScroll = !empty($a['sideScroll']) ? 'side-scroll' : '';
  ob_start(); ?>
    <div class="row <?= $type; ?>-row row-count-<?= $numPosts; ?>  <?= $sideScroll; ?>">
      <?php
      $ps = get_posts([
        'post_type' => 'any',
        'posts_per_page' => $numPosts,
        'post_parent' => $parent,
        'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC'],
        'post_status' => 'publish'
      ]);
      if ($parent === get_post_parent()) {
        $args['post__not_in'] = [get_the_ID()];
      }
      global $post;
      foreach ($ps as $post) {
        setup_postdata($post);
        get_template_part('parts/archive', $type);
      }
      wp_reset_postdata(); ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
