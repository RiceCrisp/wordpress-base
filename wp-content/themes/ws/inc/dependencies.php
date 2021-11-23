<?php
add_filter('should_load_separate_core_block_assets', '__return_true');

function _ws_enqueue_block_styles() {
  $dist = get_template_directory() . '/dist/assets.json';
  $manifest = file_exists($dist) ? json_decode(file_get_contents($dist, true), true) : false;
  if ($manifest) {
    $blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
    $coreBlocks = array_filter(array_keys($blocks), function($block) use($manifest) {
      return substr($block, 0, 4) === 'core' && isset($manifest['front-css-' . substr($block, 5)]);
    });
    foreach ($coreBlocks as $block) {
      $blockName = substr($block, 5);
      $handle = wp_should_load_separate_core_block_assets() ? 'wp-block-' . $blockName : 'wp-block-library';
      $filename = $manifest['front-css-' . $blockName]['css'];
      $styles = file_get_contents(get_theme_file_path('dist/' . $filename));
      wp_add_inline_style($handle, $styles);
    }
  }
}
add_action('wp_enqueue_scripts', '_ws_enqueue_block_styles');
add_action('admin_init', '_ws_enqueue_block_styles');

// Register scripts/styles
function _ws_register_scripts() {
  $dist = get_template_directory() . '/dist/assets.json';
  $manifest = file_exists($dist) ? json_decode(file_get_contents($dist, true), true) : false;
  if ($manifest) {
    // CSS
    wp_register_style(
      'front-css',
      get_template_directory_uri() . '/dist/' . $manifest['front-css']['css'],
      [],
      null
    );
    $frontCSS = array_filter($manifest, function($key) {
      return substr($key, 0, 10) === 'front-css-';
    }, ARRAY_FILTER_USE_KEY);
    foreach ($frontCSS as $name => $files) {
      wp_register_style(
        $name,
        get_template_directory_uri() . '/dist/' . $files['css'],
        [],
        null
      );
    }
    wp_register_style(
      'admin-css',
      get_template_directory_uri() . '/dist/' . $manifest['admin-css']['css'],
      [],
      null
    );

    // JS
    wp_register_script(
      'front-js',
      get_template_directory_uri() . '/dist/' . $manifest['front-js']['js'],
      [],
      null
    );
    $frontJS = array_filter($manifest, function($key) {
      return substr($key, 0, 9) === 'front-js-';
    }, ARRAY_FILTER_USE_KEY);
    foreach ($frontJS as $name => $files) {
      wp_register_script(
        $name,
        get_template_directory_uri() . '/dist/' . $files['js'],
        [],
        null
      );
    }
    wp_register_script(
      'google-charts',
      'https://www.gstatic.com/charts/loader.js',
      [],
      null
    );
    wp_register_script(
      'google-maps',
      'https://maps.googleapis.com/maps/api/js?key=' . get_option('google_maps_key') . '&callback=initMap',
      ['front-js-google-map']
    );
    wp_register_script(
      'options-js',
      get_template_directory_uri() . '/dist/' . $manifest['options-js']['js'],
      ['wp-blocks', 'wp-components', 'wp-editor', 'wp-element', 'wp-edit-post'],
      null,
      true
    );
    wp_register_script(
      'blocks-js',
      get_template_directory_uri() . '/dist/' . $manifest['blocks-js']['js'],
      ['wp-blocks', 'wp-element', 'wp-plugins'],
      null,
      true
    );
  }
}
add_action('wp_loaded', '_ws_register_scripts');

// Make frontend javascript defer and remove type attribute
function _ws_script_attribute($tag, $handle) {
  $tag = str_replace(' type=\'text/javascript\'', '', $tag);
  if (substr($handle, 0, 6) === 'front-' || $handle === 'google-maps') {
    return str_replace(' src', ' defer src', $tag);
  }
  return $tag;
}
add_filter('script_loader_tag', '_ws_script_attribute', 10, 2);

// Remove stylesheet type attribute
function _ws_style_attribute($tag) {
  $tag = str_replace(' type=\'text/css\'', '', $tag);
  return $tag;
}
add_filter('style_loader_tag', '_ws_style_attribute', 10, 2);

// Enqueue frontend scripts/styles
function _ws_wp_enqueue() {
  global $post;
  global $post_type;

  wp_deregister_script('wp-embed'); // Remove embed script

  // Global
  wp_enqueue_style('front-css');
  wp_enqueue_style('front-css-section');
  wp_enqueue_script('front-js');
  if ($post) {
    preg_match_all('/<!-- wp:block {"ref":\d+} \/-->/', $post->post_content, $matches);
    foreach ($matches as $match) {
      if (isset($match[0])) {
        $reusableBlock = apply_filters('the_content', $match[0]);
        _ws_enqueue_from_string($reusableBlock);
      }
    }
    _ws_enqueue_from_string($post->post_content);
  }

  // Templates
  if (is_single()) {
    ob_start();
    include_once get_template_directory() . '/parts/password.php';
    include_once get_template_directory() . '/parts/single.php';
    include_once get_template_directory() . '/parts/single-gated.php';
    _ws_enqueue_from_string(ob_get_clean());
  }
  if (is_search()) {
    wp_enqueue_style('front-css-archive');
    wp_enqueue_script('front-js-archive');
  }

}
add_action('wp_enqueue_scripts', '_ws_wp_enqueue');

// Enqueue admin scripts/styles
function _ws_admin_enqueue($hook) {
  global $post_type;
  wp_enqueue_style('admin-css');
  $dist = get_template_directory() . '/dist/assets.json';
  $manifest = file_exists($dist) ? json_decode(file_get_contents($dist, true), true) : false;
  if (in_array($hook, ['settings_page_analytics', 'settings_page_site_options', 'settings_page_svg', 'tools_page_bulk', 'profile.php', 'user-edit.php', 'nav-menus.php'])) {
    wp_enqueue_style('wp-edit-blocks');
    wp_enqueue_media();
    wp_enqueue_script('options-js');
  }
}
add_action('admin_enqueue_scripts', '_ws_admin_enqueue');

function _ws_block_editor_enqueue() {
  global $post_type;
  wp_localize_script('blocks-js', 'locals', [
    'postType' => $post_type
  ]);
  wp_enqueue_script('blocks-js');
}
add_action('enqueue_block_editor_assets', '_ws_block_editor_enqueue');

/* Remove wordpress version from css/js files to improve security */
function _ws_remove_wp_version($src) {
  $versionString = 'ver=' . get_bloginfo('version');
  if (strpos($src, $versionString) !== false) {
    $src = str_replace($versionString, 'ver=' . base64_encode(get_bloginfo('version')), $src);
  }
  return $src;
}
add_filter('style_loader_src', '_ws_remove_wp_version', 9999);
add_filter('script_loader_src', '_ws_remove_wp_version', 9999);

// Prefetch and preconnect unregistered scripts
function _ws_prefetch() {
  $themeJson = json_decode(file_get_contents(get_template_directory() . '/theme.json'), true);
  $fonts = $themeJson['fonts'];
  global $post;
  if ($post) :
    if (strpos($post->post_content, '<!-- wp:ws/form') !== false) : ?>
      <!-- <link rel="preconnect" href="https://js.hsforms.net/" />
      <link rel="dns-prefetch" href="https://js.hsforms.net/" /> -->
      <?php
    endif;
    if (get_option('tag_manager_id')) : ?>
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <?php
    endif;
  endif;
  foreach ($fonts as $font) : ?>
    <link rel="preload" href="<?= $font['src']; ?>" as="font" type="font/<?= pathinfo($font['src'])['extension']; ?>" crossorigin>
    <?php
  endforeach;
}
add_action('wp_head', '_ws_prefetch', 1);

// Enqueue block styles and scripts from input string
function _ws_enqueue_from_string($string, $decoded = false) {
  if (!$string) {
    return;
  }
  $dist = get_template_directory() . '/dist/assets.json';
  $manifest = file_exists($dist) ? json_decode(file_get_contents($dist, true), true) : false;
  if ($manifest) {
    $frontCSS = array_filter($manifest, function($key) {
      return substr($key, 0, 10) === 'front-css-';
    }, ARRAY_FILTER_USE_KEY);
    $frontJS = array_filter($manifest, function($key) {
      return substr($key, 0, 9) === 'front-js-';
    }, ARRAY_FILTER_USE_KEY);
    foreach ($frontCSS as $fileName => $files) {
      $blockName = substr($fileName, 10);
      if (blockIsPresent($blockName, $string)) {
        wp_enqueue_style($fileName);
      }
    }
    foreach ($frontJS as $fileName => $files) {
      $blockName = substr($fileName, 9);
      if (blockIsPresent($blockName, $string)) {
        wp_enqueue_script($fileName);
      }
    }
  }
  if (blockIsPresent('form', $string) && !$decoded) {
    _ws_enqueue_from_string(base64_decode($string, true));
  }
  if (blockIsPresent('google-map', $string)) {
    wp_localize_script('front-js-google-map', 'locals', [
      'googleMapsKey' => get_option('google_maps_key'),
      'googleMapsStyles' => get_option('google_maps_styles')
    ]);
    wp_enqueue_script('google-maps');
  }
}

function blockIsPresent($blockName, $content) {
  return strpos($content, 'ws/' . $blockName) !== false || strpos($content, 'wp-block-ws-' . $blockName) !== false;
}
