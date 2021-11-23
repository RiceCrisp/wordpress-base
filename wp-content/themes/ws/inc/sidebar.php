<?php
// 404 pages with different link behavior
function _ws_404_external_pages() {
  global $post;
  if ($post && is_singular() && get_post_meta($post->ID, '_link_type', true)) {
    global $wp_query;
    $wp_query->set_404();
    status_header(404);
  }
}
add_action('wp', '_ws_404_external_pages');

// Redirect page with external urls
function _ws_external_link($url, $post) {
  $linkType = get_post_meta($post->ID, '_link_type', true);
  $linkUrl = get_post_meta($post->ID, '_link_url', true);
  if (($linkType === 'download' || $linkType === 'new-tab') && $linkUrl) {
    return $linkUrl;
  }
  return $url;
}
add_filter('post_type_link', '_ws_external_link', 10, 2);
add_filter('post_link', '_ws_external_link', 10, 2);

// Exclude pages from internal search
function _ws_search_filter($query) {
  if ($query->is_search || (isset($query->query['omit_no_index']) && $query->query['omit_no_index'])) {
    $meta_query = $query->get('meta_query') ?: [];
    $meta_query[] = [
      [
        'relation' => 'OR',
        [
          'key' => '_seo_no_index',
          'compare' => '!=',
          'value' => '1'
        ],
        [
          'key' => '_seo_no_index',
          'compare' => 'NOT EXISTS'
        ]
      ]
    ];
    $query->set('meta_query', $meta_query);
    $query->set('has_password', false);
  }
  return $query;
}
add_action('pre_get_posts', '_ws_search_filter');
