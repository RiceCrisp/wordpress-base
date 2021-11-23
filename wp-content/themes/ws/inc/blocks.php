<?php
// Add/remove theme support
function _ws_blocks_setup() {
  add_theme_support('responsive-embeds');
  remove_theme_support('core-block-patterns');
}
add_action('after_setup_theme', '_ws_blocks_setup');

// Unregister core blocks
function _ws_unregister_blocks() {
  $themeJson = json_decode(file_get_contents(get_template_directory() . '/theme.json'), true);
  $unregisterBlocks = $themeJson['unregisterBlocks'];
  foreach ($unregisterBlocks as $block) {
    WP_Block_Type_Registry::get_instance()->unregister($block);
  }
}
add_action('init', '_ws_unregister_blocks');

// Add admin menu item for reusable blocks
function _ws_reusable_blocks_admin_menu() {
  add_menu_page('Reusable Blocks', 'Reusable Blocks', 'edit_posts', 'edit.php?post_type=wp_block', '', 'dashicons-editor-table', 40);
}
add_action('admin_menu', '_ws_reusable_blocks_admin_menu');

// Setup custom block categories
function _ws_block_categories($categories) {
  return array_merge(
    $categories,
    [
      [
        'slug' => 'ws-layout',
        'title' => __('Layout (WS)', 'ws')
      ],
      [
        'slug' => 'ws-dynamic',
        'title' => __('Dynamic (WS)', 'ws')
      ],
      [
        'slug' => 'ws-bit',
        'title' => __('Bits (WS)', 'ws')
      ],
      [
        'slug' => 'ws-meta',
        'title' => __('Metas (WS)', 'ws')
      ],
      [
        'slug' => 'ws-calculator',
        'title' => __('Calculator (WS)', 'ws')
      ]
    ]
  );
}
add_filter('block_categories_all', '_ws_block_categories', 10, 2);

// Wraps blocks in consistent markup
function _ws_block_wrapping($a, $content, $element = 'div') {
  $a['className'] = array_filter($a['className']);
  $anchor = !empty($a['anchor']) ? 'id="' . $a['anchor'] . '"' : '';
  $classesArray = _ws_block_build_classes($a);
  $stylesArray = _ws_block_build_styles($a);
  $classes = count($classesArray) > 0 ? 'class="' . implode(' ', $classesArray) . '"' : '';
  $styles = count($stylesArray) > 0 ? 'style="' . implode('', $stylesArray) . '"' : '';
  ob_start(); ?>
    <<?= $element . ' ' . $anchor . ' ' . $classes . ' ' . $styles; ?>>
      <?= $content; ?>
    </<?= $element; ?>>
  <?php
  return ob_get_clean();
}

// Returns array of classes for the block
function _ws_block_build_classes($a) {
  $output = $a['className'];
  $hasThemeTextColor = !empty($a['textColor']);
  $hasCustomTextColor = isset($a['style']) && isset($a['style']['color']) && isset($a['style']['color']['text']);
  if ($hasThemeTextColor || $hasCustomTextColor) {
    $output[] = 'has-text-color';
    if ($hasThemeTextColor) {
      $output[] = 'has-' . $a['textColor'] . '-color';
    }
  }
  $hasThemeBackgroundColor = !empty($a['backgroundColor']);
  $hasCustomBackgroundColor = isset($a['style']) && isset($a['style']['color']) && isset($a['style']['color']['background']);
  $hasThemeBackgroundGradient = !empty($a['gradient']);
  $hasCustomBackgroundGradient = isset($a['style']) && isset($a['style']['color']) && isset($a['style']['color']['gradient']);
  $hasBackgroundMedia = !empty($a['backgroundMedia']);
  if ($hasThemeBackgroundColor || $hasCustomBackgroundColor || $hasThemeBackgroundGradient || $hasCustomBackgroundGradient || $hasBackgroundMedia) {
    $output[] = 'has-background';
  }
  return $output;
}

// Returns array of inline styles for the block
function _ws_block_build_styles($a) {
  $output = [];
  if (isset($a['style']) && isset($a['style']['color']) && isset($a['style']['color']['text'])) {
    $output[] = 'color:' . $a['style']['color']['text'] . ';';
  }
  return $output;
}

// Creates consistent block background element
function _ws_block_background($a) {
  $classesArray = _ws_block_build_background_classes($a);
  $stylesArray = _ws_block_build_background_styles($a);
  $classes = count($classesArray) > 0 ? 'class="' . implode(' ', $classesArray) . '"' : '';
  $styles = count($stylesArray) > 0 ? 'style="' . implode('', $stylesArray) . '"' : '';
  if (count($classesArray) > 0) : ?>
    <div <?= $classes . ' ' . $styles; ?>>
      <?php
      $backgroundMediaUrl = false;
      if (!empty($a['backgroundMedia'])) {
        $backgroundMediaUrl = wp_get_attachment_image_src($a['backgroundMedia'], 'full')[0] ?: wp_get_attachment_url($a['backgroundMedia']);
      }
      $backgroundPosition = isset($a['backgroundX']) || isset($a['backgroundY']) ? ($a['backgroundX'] ?? 0.5) * 100 . '% ' . ($a['backgroundY'] ?? 0.5) * 100 . '%' : '';
      if ($backgroundMediaUrl) :
        $parallax = $a['backgroundParallax'] ?? false;
        if (substr($backgroundMediaUrl, -4) === '.mp4') :
          $backgroundVideoPoster = $a['backgroundVideoPoster'] && $a['backgroundVideoPoster'] ? 'poster="' . $a['backgroundVideoPoster'] . '"' : ''; ?>
          <div class="block-background-media <?= $parallax ? 'parallax-bg' : ''; ?>">
            <video class="block-background-video" autoplay loop muted playsinline <?= $backgroundVideoPoster; ?>>
              <source src="<?= $backgroundMediaUrl; ?>" type="video/mp4" />
            </video>
          </div>
          <?php
        else: ?>
          <div <?= _ws_image_background($backgroundMediaUrl,
            [
              'class' => 'block-background-media' . ($parallax ? ' parallax-bg' : ''),
              'backgroundPosition' => $backgroundPosition,
              'lazy' => isset($a['order']) && $a['order'] === 1 ? false : true
            ]
          ); ?>></div>
          <?php
        endif;
      endif; ?>
    </div>
    <?php
  endif;
}

// Returns array of classes for the block background
function _ws_block_build_background_classes($a) {
  $output = ['block-background'];
  $hasThemeBackgroundColor = !empty($a['backgroundColor']);
  $hasCustomBackgroundColor = isset($a['style']) && isset($a['style']['color']) && isset($a['style']['color']['background']);
  if ($hasThemeBackgroundColor || $hasCustomBackgroundColor) {
    $output[] = 'has-background-color';
    if ($hasThemeBackgroundColor) {
      $output[] = 'has-' . $a['backgroundColor'] . '-background-color';
    }
  }
  $hasThemeGradient = !empty($a['gradient']);
  $hasCustomGradient = isset($a['style']) && isset($a['style']['color']) && isset($a['style']['color']['gradient']);
  if ($hasThemeGradient || $hasCustomGradient) {
    $output[] = 'has-background-gradient';
    if ($hasThemeGradient) {
      $output[] = 'has-' . $a['gradient'] . '-gradient-background';
    }
  }
  if (!empty($a['backgroundSize'])) {
    $output[] = 'has-' . $a['backgroundSize'] . '-background-size';
  }
  if (!empty($a['backgroundOverlay'])) {
    $output[] = 'has-background-overlay';
  }
  return $output;
}

// Returns array of inline styles for the block background
function _ws_block_build_background_styles($a) {
  $output = [];
  if (isset($a['style']) && isset($a['style']['color']) && isset($a['style']['color']['background'])) {
    $output[] = 'background-color:' . $a['style']['color']['background'] . ';';
  }
  if (isset($a['style']) && isset($a['style']['color']) && isset($a['style']['color']['gradient'])) {
    $output[] = 'background-image:' . $a['style']['color']['gradient'] . ';';
  }
  return $output;
}

// Registers render functions for blocks (render.php)
function _ws_register_dynamic_blocks() {
  foreach (glob(get_template_directory() . '/blocks/*', GLOB_ONLYDIR) as $filename) {
    $fileparts = explode('/', $filename);
    $blockname = $fileparts[count($fileparts) - 1];
    register_block_type(
      $filename,
      [
        'render_callback' => '_ws_block_' . str_replace('-', '_', $blockname)
      ]
    );
  }
}
add_action('init', '_ws_register_dynamic_blocks');
