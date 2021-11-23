<?php
// Replacement for menu walker
function _ws_custom_menu_walker($location, $args = []) {
  if (!isset(get_nav_menu_locations()[$location])) {
    return;
  }
  $menuObject = get_term(get_nav_menu_locations()[$location], 'nav_menu');
  $menuItems = _ws_build_menu(wp_get_nav_menu_items($menuObject->name) ?: []);
  _wp_menu_item_classes_by_context($menuItems);
  $output = '<div class="' . $location . '"><ul class="menu">';
    foreach ($menuItems as $menuItem) {
      $depth = 0;
      $output .= isset($args->mobile) && $args->mobile ? _ws_custom_mobile_menu_output($menuItem, $depth) : _ws_custom_desktop_menu_output($menuItem, $depth);
    }
  $output .= '</ul></div>';
  return $output;
}

function _ws_column_classes($menuItem) {
  $childColumns = array_filter($menuItem->children, function($child) {
    return $child->url === '#custom_column';
  });
  return count($childColumns) > 0 ? ['has-columns', 'has-' . count($childColumns) . '-columns'] : [];
}

function _ws_custom_desktop_menu_output($menuItem, $depth) {
  $output = '';
  $submenuClasses = ['sub-menu'];
  // Column
  if ($menuItem->url === '#custom_column') {
    $output .= '<li class="menu-column"><ul class="' . implode(' ', _ws_column_classes($menuItem)) . '">';
      foreach ($menuItem->children as $child) {
        $output .= _ws_custom_desktop_menu_output($child, $depth);
      }
    $output .= '</ul></li>';
    return $output;
  }
  // Menu Item
  $output .= _ws_start_el($menuItem, $depth, (object)['item_spacing' => 'discard']);
  // Children
  if ($menuItem->children) {
    $depth++;
    $submenuClasses[] = 'depth-' . ($depth + 1);
    $submenuClasses = array_merge($submenuClasses, _ws_column_classes($menuItem));
    _wp_menu_item_classes_by_context($menuItem->children);
    $output .= '<ul class="' . implode(' ', $submenuClasses) . '">';
      foreach ($menuItem->children as $child) {
        $output .= _ws_custom_desktop_menu_output($child, $depth);
      }
    $output .= '</ul>';
  }
  return $output;
}

function _ws_custom_mobile_menu_output($menuItem, $depth) {
  $output = '';
  if ($menuItem->url === '#custom_column') {
    if ($menuItem->children) {
      foreach ($menuItem->children as $child) {
        $output .= _ws_custom_mobile_menu_output($child, $depth);
      }
    }
    return $output;
  }
  $output .= _ws_start_el($menuItem, $depth, (object)['item_spacing' => 'discard']);
  if ($menuItem->children) {
    $depth++;
    $submenuClasses = ['sub-menu', 'depth-' . ($depth + 1)];
    $output .= do_shortcode('<button class="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="' . __('Toggle Sub Menu', 'ws') . '">[svg id="caret-down"]</button>');
    $output .= '<ul class="' . implode(' ', $submenuClasses) . '">';
      foreach ($menuItem->children as $child) {
        $output .= _ws_custom_mobile_menu_output($child, $depth);
      }
    $output .= '</ul>';
  }
  return $output;
}

// Based off wp-includes/class-walker-nav-menu.php
function _ws_start_el($item, $depth = 0, $args = [], $id = 0) {
  $output = '';
  if (isset($args->item_spacing) && $args->item_spacing === 'discard') {
    $t = '';
    $n = '';
  }
  else {
    $t = "\t";
    $n = "\n";
  }
  $indent = ($depth) ? str_repeat($t, $depth) : '';
  $classes = empty($item->classes) ? [] : (array)$item->classes;
  $classes[] = 'menu-item depth-' . ($depth + 1) . ' menu-item-' . $item->ID;
  if ($item->children) {
    $classes[] = 'menu-item-has-children';
  }
  $args = apply_filters('nav_menu_item_args', $args, $item, $depth);
  $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));
  $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';
  $id = apply_filters('nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args, $depth);
  $id = $id ? ' id="' . esc_attr($id) . '"' : '';
  $output .= $indent . '<li' . $id . $class_names .'>';
  $atts = [];
  $atts['title'] = !empty($item->attr_title) ? $item->attr_title : '';
  $atts['target'] = !empty($item->target) ? $item->target : '';
  if ($item->target === '_blank' && empty($item->xfn)) {
    $atts['rel'] = 'noopener noreferrer';
  }
  else {
    $atts['rel'] = $item->xfn;
  }
  $atts['href'] = !empty($item->url) ? $item->url : '';
  $atts = apply_filters('nav_menu_link_attributes', $atts, $item, $args, $depth);
  $attributes = '';
  foreach ($atts as $attr => $value) {
    if (!empty($value)) {
      $value = $attr === 'href' ? esc_url($value) : esc_attr($value);
      $attributes .= ' ' . $attr . '="' . $value . '"';
    }
  }
  $title = apply_filters('the_title', $item->title, $item->ID);
  $title = apply_filters('nav_menu_item_title', $title, $item, $args, $depth);
  $item_output = $args->before ?? '';
  $image = get_post_meta($item->db_id, '_menu_image', true);
  $item_output .= $image ? '<img class="menu-image" loading="lazy" src="' . wp_get_attachment_image_src($image, 'small')[0] . '" alt="Menu Image" />' : '';
  $item_output .= '<a' . $attributes . (in_array('current_page_item', $classes) ? ' aria-current="page"' : '') . '>';
  $svgs = get_option('svg') ?: [];
  $icon = get_post_meta($item->db_id, '_menu_icon', true);
  $iconIndex = array_search($icon, array_column($svgs, 'id'));
  $item_output .= $iconIndex !== false ? '<div class="menu-icon"><svg viewbox="' . $svgs[$iconIndex]['viewbox'] . '">' . $svgs[$iconIndex]['path'] . '</svg></div>' : '';
  $item_output .= '<div class="title-description">';
  $item_output .= ($args->link_before ?? '') . $title . ($args->link_after ?? '');
  $item_output .= isset($item->description) && $item->description ? '<span class="menu-description">' . $item->description . '</span>' : '';
  $item_output .= '</div>';
  $item_output .= '</a>';
  $item_output .= $args->after ?? '';
  $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
  return $output;
}

// Create custom menu items' output
function _ws_walker_nav_menu_start_el($item_output, $item, $depth, $args) {
  if ($item->type !== 'custom') {
    return $item_output;
  }
  if ($item->url === '#custom_heading') {
    $item_output = '<p class="menu-heading ' . implode(' ', $item->classes) . '">' . $item->post_title . '</p>';
  }
  if ($item->url === '#custom_search') {
    $id = uniqid();
    $item_output = do_shortcode('<form class="menu-search-form" method="get" action="' . esc_url(home_url('/')) . '" role="search">
      <label for="menu-search-' . $id . '">[svg id="search"]<span class="screen-reader-text">Search</span></label>
      <input id="menu-search-' . $id . '" name="s" type="search" placeholder="Search..." />
    </form>');
  }
  if ($item->url === '#custom_column') {
    return '';
  }
  return $item_output;
}
add_filter('walker_nav_menu_start_el', '_ws_walker_nav_menu_start_el', 10, 4);

// Add depth class to sub-menu
function _ws_submenu_depth_class($classes, $args, $depth) {
  $classes[] = 'depth-' . ($depth + 1);
  return $classes;
}
add_filter('nav_menu_submenu_css_class', '_ws_submenu_depth_class', 10, 3);
