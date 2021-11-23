<?php
function _ws_setup() {
  // Make theme available for translation.
  load_theme_textdomain('ws', get_template_directory() . '/languages');

  add_theme_support('html5', [
    'search-form',
    'comment-form',
    'comment-list',
    'gallery',
    'caption'
  ]);

  // Add excerpt support for pages
  add_post_type_support('page', 'excerpt');

  // Register nav locations
  register_nav_menus([
    'header-primary' => __('Primary Header', 'ws'),
    'header-secondary' => __('Secondary Header', 'ws')
  ]);

  // Remove junk from head
  remove_action('wp_head', 'wp_generator'); // Wordpress version
  remove_action('wp_head', 'rsd_link'); // Really Simple Discovery
  remove_action('wp_head', 'wlwmanifest_link'); // Windows Live Writer
  remove_action('wp_head', 'print_emoji_detection_script', 7); // Emojis :(
  remove_action('wp_print_styles', 'print_emoji_styles'); // Emojis :(
  add_filter('emoji_svg_url', '__return_false'); // Emojis :(
  remove_action('wp_head', 'wp_shortlink_wp_head'); // Page shortlink
  remove_action('wp_head', 'parent_post_rel_link'); // Navigation links
  remove_action('wp_head', 'rest_output_link_wp_head'); // JSON
  remove_action('wp_head', 'wp_oembed_add_discovery_links'); // JSON
  remove_action('wp_head', 'rel_canonical'); // If there's more than one canonical, neither will work, so we remove the default one and use ours

  // Enable shortcodes in widgets
  add_filter('widget_text', 'do_shortcode');
}
add_action('after_setup_theme', '_ws_setup');

// Remove trackback/pingback support
function _ws_remove_post_support() {
  remove_post_type_support('post', 'trackbacks');
}
add_action('init', '_ws_remove_post_support');

// Disable author archives
function _ws_disable_author_archives() {
  if (is_author()) {
    global $wp_query;
    $wp_query->set_404();
    status_header(404);
  }
  else {
    redirect_canonical();
  }
}
remove_filter('template_redirect', 'redirect_canonical');
add_action('template_redirect', '_ws_disable_author_archives');

// Exclude password protected pages from frontend
function _ws_exclude_protected_posts($where = '') {
  if (!is_single() && !is_admin()) {
    $where .= ' AND post_password = ""';
  }
  return $where;
}
add_filter('posts_where', '_ws_exclude_protected_posts');

// Register widget areas
function _ws_register_widget_areas() {
  register_sidebar([
    'name' => __('Footer 1', 'ws'),
    'id' => 'footer-1',
    'description' => __('Widgets in this area will appear in the footer', 'ws')
  ]);
  register_sidebar([
    'name' => __('Footer 2', 'ws'),
    'id' => 'footer-2',
    'description' => __('Widgets in this area will appear in the footer', 'ws')
  ]);
  register_sidebar([
    'name' => __('Legal', 'ws'),
    'id' => 'legal',
    'description' => __('Widgets in this area will appear below the footer', 'ws')
  ]);
}
add_action('widgets_init', '_ws_register_widget_areas');

// Set excerpt word length
function _ws_excerpt_length() {
  return 30; // Default = 55
}
add_filter('excerpt_length', '_ws_excerpt_length', 999);

// General content filters
function _ws_content_filter($content) {
  $content = force_balance_tags($content);
  $content = preg_replace('/<p><\/p>/', '', $content);

  // Fix Vue transition-group elements
  $content = preg_replace(
    '/<transition -group/',
    '<transition-group',
    $content
  );

  // Give iframe's unique name attributes for iframe communcation
  $count = 0;
  $content = preg_replace_callback(
    '/<iframe(?![^>]+name=)/',
    function($matches) use (&$count) {
      $count++;
      return '<iframe name="iframe-' . $count . '"';
    },
    $content
  );

  return $content;
}
add_filter('the_content', '_ws_content_filter');

// Remove any content within meta blocks
function _ws_meta_content_filter($content) {
  $content = preg_replace(
    '/<!-- wp:ws\/meta-[^\/]+?-->.*?<!-- \/wp:ws\/meta-.+?-->/s',
    '',
    $content
  );

  return $content;
}
add_filter('the_content', '_ws_meta_content_filter', 1);

function _ws_add_headers($headers) {
  $headers['X-XSS-Protection'] = '1; mode=block';
  $headers['X-Frame-Options'] = 'deny';
  $headers['X-Content-Type-Options'] = 'nosniff';
  $headers['Referrer-Policy'] = 'origin-when-cross-origin';
  $headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  return $headers;
}
add_filter('wp_headers', '_ws_add_headers');

// Remove custom css from Customizer
function _ws_remove_customizer_css($wp_customize) {
  $wp_customize->remove_control('custom_css');
}
add_action('customize_register', '_ws_remove_customizer_css');

// PHP files
foreach (glob(get_template_directory() . '/blocks/**/*.php') as $filename) {
  include_once $filename;
}
foreach (glob(get_template_directory() . '/inc/*.php') as $filename) {
  include_once $filename;
}
foreach (glob(get_template_directory() . '/inc/classes/*.php') as $filename) {
  include_once $filename;
}
foreach (glob(get_template_directory() . '/inc/options/*.php') as $filename) {
  include_once $filename;
}
foreach (glob(get_template_directory() . '/post-types/*.php') as $filename) {
  include_once $filename;
}
