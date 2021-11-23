<?php
function _ws_block_latest_upcoming($a = []) {
  $a['className'] = ['wp-block-ws-latest-upcoming', ($a['className'] ?? '')];
  $postTypes = $a['postTypes'] ?? [];
  $type = isset($a['type']) && $a['type'] !== 'default' ? $a['type'] : ($postTypes[0] ?? 'none');
  $numPosts = $a['numPosts'] ?? 3;
  $numPosts = !empty($a['allPosts']) ? -1 : $numPosts;
  $taxTerms = $a['taxTerms'] ?? [];
  $horizontalScroll = !empty($a['sideScroll']) ? 'side-scroll' : '';
  ob_start(); ?>
    <div class="row <?= $type; ?>-row row-count-<?= $numPosts; ?> <?= $horizontalScroll; ?>">
      <?php
      $posts = get_posts(_ws_latest_upcoming_build_args($postTypes, $numPosts, $taxTerms));
      global $post;
      foreach ($posts as $i=>$post) {
        setup_postdata($post);
        get_template_part('parts/archive', $type);
      }
      wp_reset_postdata(); ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}

function _ws_latest_upcoming_build_args($postTypes, $numPosts, $taxTerms) {
  global $post;
  $args = [
    'post_type' => $postTypes,
    'posts_per_page' => $numPosts,
    'omit_no_index' => true,
    'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC'],
    'post_status' => 'publish'
  ];
  if (in_array(get_post_type(), $postTypes)) {
    $args['post__not_in'] = [get_the_ID()];
  }
  // Tax query
  $queries = [];
  foreach ($taxTerms as $tax=>$terms) {
    if (!empty($terms)) {
      $queries[] = [
        'taxonomy' => $tax,
        'field' => 'id',
        'terms' => $terms
      ];
    }
  }
  if (!empty($queries)) {
    $queries['relation'] = 'OR';
    $args['tax_query'] = $queries;
  }
  // Event ordering
  if (count($postTypes) === 1 && $postTypes[0] === 'event') {
    $args['meta_query'] = [
      [
        'key' => '_event_start_date',
        'value' => date('Y-m-d\TH:i:s'),
        'compare' => '>='
      ]
    ];
    $args['orderby'] = 'meta_value';
    $args['meta_key'] = '_event_start_date';
    $args['order'] = 'DESC';
  }
  return $args;
}
