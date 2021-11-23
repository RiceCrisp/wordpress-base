<?php
// Do not create user or taxonomy sitemaps
function _ws_sitemap_remove_sitemaps($provider, $name) {
  if ($name === 'users' || $name === 'taxonomies') {
    return false;
  }
  return $provider;
}
add_filter('wp_sitemaps_add_provider', '_ws_sitemap_remove_sitemaps', 10, 2);

// Do not create media sitemaps
function _ws_sitemap_remove_post_types($post_types) {
  $publics = get_post_types(['public' => true]);
  unset($publics['attachment']);
  return $publics;
}
add_filter('wp_sitemaps_post_types', '_ws_sitemap_remove_post_types');

// Do not include no-index pages or external pages in sitemaps
function _ws_sitemap_remove_posts($args) {
  $args['meta_query'] = [
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
    ],
    [
      'relation' => 'OR',
      [
        'key' => '_link_type',
        'compare' => '=',
        'value' => ''
      ],
      [
        'key' => '_link_type',
        'compare' => 'NOT EXISTS'
      ]
    ]
  ];
  return $args;
}
add_filter('wp_sitemaps_posts_query_args', '_ws_sitemap_remove_posts');
