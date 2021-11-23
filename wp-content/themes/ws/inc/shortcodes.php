<?php
// Search field
function _ws_shortcode_search($atts) {
  $output = '<form class="search-shortcode" method="GET" action="/">
    <input name="s" type="search" />
    <button type="submit">[svg id="search"]</button>
  </form>';
  return do_shortcode($output);
}
add_shortcode('search', '_ws_shortcode_search');

// Menu
function _ws_shortcode_menu($atts) {
  $a = shortcode_atts([
    'name' => ''
  ], $atts);
  $output = '';
  if ($a['name']) {
    $menu = wp_get_nav_menu_object($a['name']);
    $output = wp_nav_menu([
      'menu' => $menu->slug,
      'menu_class' => 'shortcode-menu',
      'container' => false,
      'item_spacing' => 'discard',
      'echo' => false
    ]);
  }
  return $output;
}
add_shortcode('menu', '_ws_shortcode_menu');

// Social icons/links
function _ws_shortcode_social($atts) {
  $a = shortcode_atts([
    'icons' => ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin']
  ], $atts);
  if (!is_array($a['icons'])) {
    $a['icons'] = explode(',', $a['icons']);
    $a['icons'] = array_map(function($v) {
      return trim($v);
    }, $a['icons']);
  }
  $links = get_option('social_links');
  $output = '';
  foreach ($a['icons'] as $icon) {
    $url = $links[$icon] ?? false;
    if ($url) {
      $output .= _ws_block_social_link([
        'icon' => $icon,
        'link' => [
          'url' => $url,
          'opensInNewTab' => true
        ]
      ]);
    }
  }
  $output = do_shortcode(_ws_block_social_links([], $output));
  return $output;
}
add_shortcode('social_links', '_ws_shortcode_social');

// SVG icon
function _ws_shortcode_svg($atts) {
  $a = shortcode_atts([
    'id' => null,
    'class' => null,
    'style' => null
  ], $atts);
  $output = '';
  if ($a['id'] && get_option('svg')) {
    $svgs = get_option('svg');
    $i = array_search($a['id'], array_column($svgs, 'id'));
    if ($i !== false) {
      if (isset($svgs[$i]['type']) && $svgs[$i]['type'] === 'animation') {
        $output = '<div class="svg-animation-container svg-animation ' . $a['class'] . '" data-name="' . uniqid($svgs[$i]['id'] . '-') . '" data-src="' . urlencode($svgs[$i]['json']) . '"></div>';
      }
      else {
        $d = explode(' ', $svgs[$i]['viewbox']);
        $width = $d[2] - $d[0];
        $height = $d[3] - $d[1];
        $output = '<svg' . ($a['class'] ? ' class="' . $a['class'] . '"' : '') . ' width="' . $width . '" height="' . $height . '" viewBox="' . $svgs[$i]['viewbox'] . '"' . ($a['class'] ? ' style="' . $a['style'] . '"' : '') . ' fill-rule="evenodd"><title>' . $svgs[$i]['title'] . '</title>' . $svgs[$i]['path'] . '</svg>';
      }
    }
  }
  return $output;
}
add_shortcode('svg', '_ws_shortcode_svg');

// Year (useful for copyright)
function _ws_shortcode_year() {
  return date('Y');
}
add_shortcode('year', '_ws_shortcode_year');

// Print the logo
function _ws_shortcode_logo($atts = []) {
  $a = shortcode_atts([
    'link' => null,
    'class' => null,
    'light' => false,
    'src-only' => false
  ], $atts);
  $output = false;
  $logo = glob(get_template_directory() . ($a['light'] ? '/logo_light.*' : '/logo.*'));
  $class = $a['class'] ?? '';
  if (isset($logo[0])) {
    $parts = explode('/', $logo[0]);
    $src = get_template_directory_uri() . '/' . $parts[count($parts) - 1];
    $path = get_template_directory() . '/' . $parts[count($parts) - 1];
    if ($a['src-only']) {
      return $src;
    }
    $xml = simplexml_load_string(file_get_contents($path));
    $attrs = $xml->attributes();
    $width = ceil(explode(' ', $attrs->viewBox)[2]);
    $height = ceil(explode(' ', $attrs->viewBox)[3]);
    $output = '<img src="' . $src . '" alt="' . get_bloginfo('name') . '" width="' . $width . '" height="' . $height . '" />';
    if ($a['link']) {
      $output = '<a class="site-logo ' . $class . '" href="' . esc_url(home_url('/')) . '" rel="home">' . $output . '</a>';
    }
    else {
      $output = '<div class="site-logo ' . $class . '">' . $output . '</div>';
    }
  }
  return $output;
}
add_shortcode('logo', '_ws_shortcode_logo');

// Print the address
function _ws_shortcode_address($atts) {
  $a = shortcode_atts([
    'phone' => null
  ], $atts);
  $output = '<p class="address-shortcode">' . get_option('site_location_street') . '<br/>' . get_option('site_location_city') . ', ' . get_option('site_location_state') . ' ' . get_option('site_location_zip');
  if ($a['phone']) {
    $output .= '<br /><a href="tel:' . get_option('site_phone') . '" rel="home">' . get_option('site_phone') . '</a>';
  }
  $output .= '</p>';
  return $output;
}
add_shortcode('address', '_ws_shortcode_address');

// Question
function _ws_shortcode_question($atts, $content = null) {
  $a = shortcode_atts([
    'id' => '',
    'name' => '',
    'type' => 'number',
    'default' => '',
    'options' => ''
  ], $atts);
  $a['options'] = explode(',', $a['options']);
  $output = '';
  if ($a['type'] === 'number' || $a['type'] === 'text' || $a['type'] === 'email') {
    $output = '<label for="' . $a['id'] . '">' . $content . '</label>
    <input id="' . $a['id'] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '" type="' . $a['type'] . '" placeholder="' . $a['default'] . '" />';
  }
  else if ($a['type'] === 'textarea') {
    $output = '<label for="' . $a['id'] . '">' . $content . '</label>
    <textarea id="' . $a['id'] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '" placeholder="' . $a['default'] . '"></textarea>';
  }
  else if ($a['type'] === 'select') {
    $output = '<label for="' . $a['id'] . '">' . $content . '</label>
    <select id="' . $a['id'] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '">';
      foreach ($a['options'] as $option) {
        $option = explode('=', $option);
        $output .= '<option value="' . $option[1] . '" ' . ($a['default'] === $option[0] ? 'selected' : '') . '>' . $option[0] . '</option>';
      }
    $output .= '</select>';
  }
  else if ($a['type'] === 'radio') {
    $output = '<fieldset id="' . $a['id'] . '">
      <legend>' . $content . '</legend>';
      foreach ($a['options'] as $option) {
        $option = explode('=', $option);
        $output .= '<input id="' . $a['id'] . '-' . $option[1] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '" value="' . $option[1] . '" type="radio" ' . ($a['default'] === $option[0] ? 'checked' : '') . ' />
        <label for="' . $a['id'] . '-' . $option[1] . '">' . $option[0] . '</label>';
      }
    $output .= '</fieldset>';
  }
  else if ($a['type'] === 'checkbox') {
    $output = '<fieldset id="' . $a['id'] . '">
      <legend>' . $content . '</legend>';
      echo $a['default'];
      foreach ($a['options'] as $option) {
        $option = explode('=', $option);
        $output .= '<input id="' . $a['id'] . '-' . $option[1] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '" value="' . $option[1] . '" type="checkbox" ' . ($a['default'] === $option[0] ? 'checked' : '') . ' />
        <label for="' . $a['id'] . '-' . $option[1] . '">' . $option[0] . '</label>';
      }
    $output .= '</fieldset>';
  }
  return $output;
}
add_shortcode('question', '_ws_shortcode_question');
