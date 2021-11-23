<?php
// Get the terms for a post's given taxonomy
function _ws_get_terms($id, $taxonomy) {
  if (!$id || !$taxonomy) {
    return false;
  }
  if (!taxonomy_exists($taxonomy)) {
    return false;
  }
  $terms = get_the_terms($id, $taxonomy);
  return $terms && count($terms) > 0 ? $terms : false;
}

// Get the archive page url for a post type
function _ws_get_archive_url($postType) {
  $postTypeObject = get_post_type_object($postType);
  if (!$postTypeObject) {
    return;
  }
  if ($postTypeObject->rewrite) {
    return esc_url(home_url('/')) . $postTypeObject->rewrite['slug'] . '/';
  }
  else {
    return esc_url(home_url()) . str_replace('%postname%/', '', get_option('permalink_structure'));
  }
}

// Get the post type label
function _ws_get_post_label($postType, $options = []) {
  $postTypeObject = get_post_type_object($postType);
  if (!$postTypeObject) {
    return;
  }
  $output = !empty($options['plural']) ? $postTypeObject->label : $postTypeObject->labels->singular_name;
  switch ($postType) {
    case 'post':
      $output = !empty($options['plural']) ? __('Blog Posts', 'ws') : __('Blog Post', 'ws');
      break;
    case 'person':
      $output = __('Leadership', 'ws');
      break;
  }
  return !empty($options['lowercase']) ? strtolower($output) : $output;
}

// Get the post link with external/lightbox code if needed
function _ws_get_link($post = 0, $text = '') {
  $post = get_post($post);
  $id = 'lightbox-' . $post->ID;
  $url = get_post_meta($post->ID, '_link_url', true);
  $type = get_post_meta($post->ID, '_link_type', true);
  $text = $text ?: get_the_title($post->ID);
  $output = '';
  if ($type === 'lightbox') {
    $output = '<button class="lightbox-button" aria-controls="' . $id . '">' . $text . '</button>';
    $output .= '<div id="' . $id . '" class="lightbox" role="dialog" aria-modal="true">
      <div class="container">
        <div class="row">
          <div class="lightbox-inner">
            <button class="lightbox-close" aria-label="' . __('Close Lightbox', 'ws') . '">
              <svg viewBox="0 0 24 24" fill-rule="evenodd">
                <title>Close</title>
                <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/>
              </svg>
            </button>
            <div class="lightbox-content">' . $post->post_content . '</div>
          </div>
        </div>
      </div>
    </div>';
  }
  else {
    $output = '<a class="post-link" ' . ($url && $type === 'new-tab' ? 'target="_blank" rel="noopener noreferrer" ' : '') . 'href="' . ($url ?: get_permalink($post->ID)) . '" ' . ($url && $type === 'download' ? 'download' : '') . '>' . $text . '</a>';
  }
  return $output;
}

// Convert hex (or linear-gradient) to array of classes and styles
function _ws_hex_to_classes_styles_array($hex, $args = []) {
  $classes = $args['classes'] ?? [];
  $styles = $args['styles'] ?? [];
  $type = $args['type'] ?? 'color';
  $themeJson = json_decode(file_get_contents(get_template_directory() . '/theme.json'), true);
  $colors = $themeJson['settings']['color'][$type === 'gradient' ? 'gradients' : 'palette'];
  $slug = '';
  foreach ($colors as $c) {
    if ($c[$type === 'gradient' ? 'gradient' : 'color'] === $hex) {
      $slug = $c['slug'];
    }
  }
  if ($hex) {
    $classes[] = $type === 'color' ? 'has-color' : 'has-background';
    if ($slug) {
      switch ($type) {
        case 'color':
          $classes[] = 'has-' . $slug . '-color';
          break;
        case 'background-color':
          $classes[] = 'has-' . $slug . '-background-color';
          break;
        case 'gradient':
          $classes[] = 'has-' . $slug . '-gradient-background';
          break;
      }
    }
    else {
      switch ($type) {
        case 'color':
          $styles[] = 'color:' . $hex;
          break;
        case 'background-color':
          $styles[] = 'background-color:' . $hex;
          break;
        case 'gradient':
          $styles[] = 'background-image:' . $hex;
          break;
      }
    }
  }
  return [
    'classes' => array_unique($classes),
    'styles' => array_unique($styles)
  ];
}

// Get links to previous and next posts
function _ws_get_prev_next() {
  ob_start();
  if (get_next_post() || get_previous_post()) : ?>
    <div class="prev-next">
      <div class="left-link">
        <?= get_previous_post() ? '<p class="label">Previous:</p><a href="' . get_permalink(get_previous_post()->ID) . '" rel="prev">' . get_the_title(get_previous_post()->ID) . '</a>' : ''; ?>
      </div>
      <div class="right-link has-text-align-right">
        <?= get_next_post() ? '<p class="label">Next:</p><a href="' . get_permalink(get_next_post()->ID) . '" rel="next">' . get_the_title(get_next_post()->ID) . '</a>' : ''; ?>
      </div>
    </div>
    <?php
  endif;
  return ob_get_clean();
}

// Convert global color hex to slug name
function _ws_get_color_slug($hex) {
  $themeJson = json_decode(file_get_contents(get_template_directory() . '/theme.json'), true);
  $colors = $themeJson['global']['colors'];
  $slug = '';
  foreach ($colors as $c) {
    if ($c['color'] === $hex) {
      $slug = $c['slug'];
    }
  }
  return $slug;
}

// Get image by media id
function _ws_image($idOrUrl = false, $options = []) {
  if (!$idOrUrl) {
    return;
  }
  $id = is_numeric($idOrUrl) ? $idOrUrl : 0;
  $url = !is_numeric($idOrUrl) ? $idOrUrl : '';
  $lazy = $options['lazy'] ?? true;
  $size = $options['size'] ?? 'large';
  $attributes = [
    'loading' => $lazy ? 'lazy' : false,
    'class' => $options['class'] ?? false,
    'src' => $id ? wp_get_attachment_image_src($id, $size)[0] : $url,
    'width' => $options['width'] ?? wp_get_attachment_image_src($id, $size)[1],
    'height' => $options['height'] ?? wp_get_attachment_image_src($id, $size)[2],
    'alt' => $options['alt'] ?? get_post_meta($id, '_wp_attachment_image_alt', true),
    'style' => !empty($options['objectPosition']) ? 'object-position:' . $options['objectPosition'] : ''
  ];
  $output = '<img ';
  foreach ($attributes as $key => $value) {
    if ($value) {
      $output .= $key . '="' . trim($value) . '" ';
    }
  }
  $output .= '/>';
  return $output;
}

// Get background image by media id
function _ws_image_background($idOrUrl = false, $options = []) {
  $class = $options['class'] ?? '';
  if (!$idOrUrl) {
    return $class ? 'class="' . $class . '"' : '';
  };
  $id = is_numeric($idOrUrl) ? $idOrUrl : 0;
  $url = !is_numeric($idOrUrl) ? $idOrUrl : '';
  $lazy = $options['lazy'] ?? true;
  $size = $options['size'] ?? 'full';
  $attributes = [];
  if ($lazy) {
    $attributes = [
      'class' => 'lazy-load ' . ($options['class'] ?? ''),
      'data-src' => $id ? wp_get_attachment_image_src($id, $size)[0] : $url,
      'style' => !empty($options['backgroundPosition']) ? 'background-position:' . $options['backgroundPosition'] : ''
    ];
  }
  else {
    $attributes = [
      'class' => $options['class'] ?? '',
      'style' => 'background-image:url(' . ($id ? wp_get_attachment_image_src($id, $size)[0] : $url) . ');' . (!empty($options['backgroundPosition']) ? 'background-position:' . $options['backgroundPosition'] : '')
    ];
  }
  $output = '';
  foreach ($attributes as $key => $value) {
    if ($value) {
      $output .= $key . '="' . trim($value) . '" ';
    }
  }
  return trim($output);
}

// Get featured image for images
function _ws_thumbnail($post = 0, $options = []) {
  $post = get_post($post);
  if (!has_post_thumbnail($post->ID)) {
    return;
  }
  $id = get_post_thumbnail_id($post->ID);
  $x = get_post_meta($post->ID, '_featured_image_x', true);
  $y = get_post_meta($post->ID, '_featured_image_y', true);
  if ($x !== '' && $y !== '') {
    $options['objectPosition'] = ($x * 100) . '% ' . ($y * 100) . '%';
  }
  return _ws_image($id, $options);
}

// Get featured image for background images
function _ws_thumbnail_background($post = 0, $options = []) {
  $post = get_post($post);
  $class = $options['class'] ?? '';
  if (!has_post_thumbnail($post->ID)) {
    return $class ? 'class="' . $class . '"' : '';
  }
  $id = get_post_thumbnail_id($post->ID);
  $x = get_post_meta($post->ID, '_featured_image_x', true);
  $y = get_post_meta($post->ID, '_featured_image_y', true);
  if ($x !== '' && $y !== '') {
    $options['backgroundPosition'] = ($x * 100) . '% ' . ($y * 100) . '%';
  }
  return _ws_image_background($id, $options);
}

// Get image url by slug
function _ws_get_attachment_url_by_slug($slug) {
  $args = [
    'post_type' => 'attachment',
    'name' => sanitize_title($slug),
    'posts_per_page' => 1,
    'post_status' => 'inherit'
  ];
  $_header = get_posts($args);
  $header = $_header ? array_pop($_header) : null;
  return $header ? wp_get_attachment_url($header->ID) : '';
}

// Get directions button
function _ws_directions_url($post = 0) {
  $post = get_post($post);
  $loc_readable = get_post_meta($post->ID, '_location-readable', true);
  $url = 'https://www.google.com/maps/dir/?api=1&destination=' . urlencode(str_replace(' <br>', ', ', $loc_readable));
  return $url;
}

// Function to determine if post is in menu
function _ws_in_menu($menu = null, $object_id = null) {
  $menu_object = wp_get_nav_menu_items(esc_attr($menu));
  if (!$menu_object) {
    return false;
  }
  $menu_items = wp_list_pluck($menu_object, 'object_id');
  if (!$object_id) {
    global $post;
    $object_id = get_queried_object_id();
  }
  return in_array((int)$object_id, $menu_items);
}

// Convert wp_get_nav_menu_items into something useful (turns flat array of menu items into hierarchical array)
function _ws_build_menu(array $elements, $parentId = 0) {
  $branch = [];
  foreach ($elements as $element) {
    if ((int)$element->menu_item_parent === $parentId) {
      $children = _ws_build_menu($elements, (int)$element->ID);
      if ($children) {
        $element->children = $children;
      }
      $branch[$element->ID] = $element;
      unset($element);
    }
  }
  return array_values($branch);
}

// cURL
function curlRequest($method, $url, $data = []) {
  $curl = curl_init();
  // POST
  if ($method === 'POST') {
    curl_setopt($curl, CURLOPT_POST, 1);
    if ($data) {
      curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    }
  }
  // PUT
  else if ($method === 'PUT') {
    curl_setopt($curl, CURLOPT_PUT, 1);
  }
  // GET
  else if ($method === 'GET' && !empty($data)) {
    $url = strpos($url, '?') !== false ? $url . '&' . http_build_query($data) : $url . '?' . http_build_query($data);
  }

  // Optional Authentication:
  // curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
  // curl_setopt($curl, CURLOPT_USERPWD, "username:password");

  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

  $result = curl_exec($curl);
  curl_close($curl);
  return $result;
}
