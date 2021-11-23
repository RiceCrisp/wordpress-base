<?php
require_once ABSPATH . 'wp-admin/includes/nav-menu.php';

// Modify admin menu walker
class WS_Walker_Custom_Nav extends Walker_Nav_Menu_Edit {
  public function start_el(&$output, $item, $depth = 0, $args = [], $id = 0) {
    global $_wp_nav_menu_max_depth;
    $_wp_nav_menu_max_depth = $depth > $_wp_nav_menu_max_depth ? $depth : $_wp_nav_menu_max_depth;

    ob_start();
    $item_id = esc_attr($item->ID);
    $removed_args = [
      'action',
      'customlink-tab',
      'edit-menu-item',
      'menu-item',
      'page-tab',
      '_wpnonce'
    ];

    $original_title = false;
    if ($item->type === 'taxonomy') {
      $original_title = get_term_field('name', $item->object_id, $item->object, 'raw');
      if (is_wp_error($original_title)) {
        $original_title = false;
      }
    }
    elseif ($item->type === 'post_type') {
      $original_object = get_post($item->object_id);
      $original_title  = get_the_title($original_object->ID);
    }
    elseif ($item->type === 'post_type_archive') {
      $original_object = get_post_type_object($item->object);
      if ($original_object) {
        $original_title = $original_object->labels->archives;
      }
    }

    $classes = [
      'menu-item menu-item-depth-' . $depth,
      'menu-item-' . esc_attr($item->object),
      'menu-item-edit-' . ((isset($_GET['edit-menu-item']) && $item_id == $_GET['edit-menu-item']) ? 'active' : 'inactive'),
    ];

    $title = $item->title;

    if (!empty($item->_invalid)) {
      $classes[] = 'menu-item-invalid';
      /* translators: %s: title of menu item which is invalid */
      $title = sprintf(__('%s (Invalid)'), $item->title);
    }
    elseif (isset($item->post_status) && $item->post_status === 'draft') {
      $classes[] = 'pending';
      /* translators: %s: title of menu item in draft status */
      $title = sprintf(__('%s (Pending)'), $item->title);
    }

    $title = (!isset($item->label) || $item->label === '') ? $title : $item->label;

    $submenu_text = '';
    if ($depth === 0) {
      $submenu_text = 'style="display: none;"';
    } ?>

    <li id="menu-item-<?= $item_id; ?>" class="<?= implode(' ', $classes); ?>">
      <div class="menu-item-bar">
        <div class="menu-item-handle">
          <span class="item-title"><span class="menu-item-title"><?= esc_html($title); ?></span> <span class="is-submenu" <?= $submenu_text; ?>><?php _e('sub item'); ?></span></span>
          <span class="item-controls">
            <span class="item-type"><?= esc_html($item->type_label); ?></span>
            <span class="item-order hide-if-js">
              <?php
              $href = wp_nonce_url(
                add_query_arg(
                  ['action' => 'move-up-menu-item', 'menu-item' => $item_id],
                  remove_query_arg($removed_args, admin_url('nav-menus.php'))
                ),
                'move-menu_item'
              );
              $href2 = wp_nonce_url(
                add_query_arg(
                  ['action' => 'move-down-menu-item', 'menu-item' => $item_id],
                  remove_query_arg($removed_args, admin_url('nav-menus.php'))
                ),
                'move-menu_item'
              ); ?>
              <a href="<?= $href; ?>" class="item-move-up" aria-label="<?php esc_attr_e('Move up'); ?>">&#8593;</a>
              |
              <a href="<?= $href2; ?>" class="item-move-down" aria-label="<?php esc_attr_e('Move down'); ?>">&#8595;</a>
            </span>
            <a class="item-edit" id="edit-<?= $item_id; ?>" href="<?= (isset($_GET['edit-menu-item']) && $item_id == $_GET['edit-menu-item']) ? admin_url('nav-menus.php') : add_query_arg('edit-menu-item', $item_id, remove_query_arg($removed_args, admin_url('nav-menus.php#menu-item-settings-' . $item_id))); ?>" aria-label="<?php esc_attr_e('Edit menu item'); ?>">
              <span class="screen-reader-text"><?php _e('Edit'); ?></span>
            </a>
          </span>
        </div>
      </div>

      <div id="menu-item-settings-<?= $item_id; ?>" class="menu-item-settings wp-clearfix">
        <?php _ws_menu_walker_fields($item_id, $item); ?>

        <fieldset class="field-move hide-if-no-js description description-wide">
          <span class="field-move-visual-label" aria-hidden="true"><?php _e('Move'); ?></span>
          <button type="button" class="button-link menus-move menus-move-up" data-dir="up"><?php _e('Up one'); ?></button>
          <button type="button" class="button-link menus-move menus-move-down" data-dir="down"><?php _e('Down one'); ?></button>
          <button type="button" class="button-link menus-move menus-move-left" data-dir="left"></button>
          <button type="button" class="button-link menus-move menus-move-right" data-dir="right"></button>
          <button type="button" class="button-link menus-move menus-move-top" data-dir="top"><?php _e('To the top'); ?></button>
        </fieldset>

        <div class="menu-item-actions description-wide submitbox">
          <?php
          if ($item->type !== 'custom' && $original_title !== false) : ?>
            <p class="link-to-original">
              <?php
              // translators: %s: original title
              printf(__('Original: %s'), '<a href="' . esc_attr($item->url) . '">' . esc_html($original_title) . '</a>'); ?>
            </p>
            <?php
          endif;
          $href = wp_nonce_url(
            add_query_arg(
              ['action' => 'delete-menu-item', 'menu-item' => $item_id],
              admin_url('nav-menus.php')
            ),
            'delete-menu_item_' . $item_id
          );
          $href2 = esc_url(
            add_query_arg(
              ['edit-menu-item' => $item_id, 'cancel' => time()],
              admin_url('nav-menus.php')
            )
          ); ?>
          <a class="item-delete submitdelete deletion" id="delete-<?= $item_id; ?>" href="<?= $href ?>"><?php _e('Remove'); ?></a> <span class="meta-sep hide-if-no-js"> | </span> <a class="item-cancel submitcancel hide-if-no-js" id="cancel-<?= $item_id; ?>" href="<?= $href2; ?>#menu-item-settings-<?= $item_id; ?>"><?php _e('Cancel'); ?></a>
        </div>

        <input class="menu-item-data-db-id" type="hidden" name="menu-item-db-id[<?= $item_id; ?>]" value="<?= $item_id; ?>" />
        <input class="menu-item-data-object-id" type="hidden" name="menu-item-object-id[<?= $item_id; ?>]" value="<?= esc_attr($item->object_id); ?>" />
        <input class="menu-item-data-object" type="hidden" name="menu-item-object[<?= $item_id; ?>]" value="<?= esc_attr($item->object); ?>" />
        <input class="menu-item-data-parent-id" type="hidden" name="menu-item-parent-id[<?= $item_id; ?>]" value="<?= esc_attr($item->menu_item_parent); ?>" />
        <input class="menu-item-data-position" type="hidden" name="menu-item-position[<?= $item_id; ?>]" value="<?= esc_attr($item->menu_order); ?>" />
        <input class="menu-item-data-type" type="hidden" name="menu-item-type[<?= $item_id; ?>]" value="<?= esc_attr($item->type); ?>" />
      </div>
      <ul class="menu-item-transport"></ul>
      <?php
      $output .= ob_get_clean();
  }
}

// Apply modified walker
function _ws_walker_custom_nav() {
  return 'WS_Walker_Custom_Nav';
}
add_filter('wp_edit_nav_menu_walker', '_ws_walker_custom_nav');

// Add custom menu items to inserter
function _ws_menu_walker_fields($item_id, $item) {
  if ($item->type === 'custom') {
    if ($item->url === '#custom_search' || $item->url === '#custom_column') {
      _ws_build_menu_fields($item_id, $item, [
        'hidden_url',
        'hidden_label'
      ]);
    }
    else if ($item->url === '#custom_heading') {
      _ws_build_menu_fields($item_id, $item, [
        'hidden_url',
        'navigation_label',
        'class'
      ]);
    }
    else {
      _ws_build_menu_fields($item_id, $item, [
        'media',
        'url',
        'navigation_label',
        'title',
        'new_tab',
        'class',
        'link_relationship',
        'description'
      ]);
    }
  }
  else {
    _ws_build_menu_fields($item_id, $item, [
      'media',
      'hidden_url',
      'navigation_label',
      'title',
      'new_tab',
      'class',
      'link_relationship',
      'description'
    ]);
  }
}

function _ws_build_menu_fields($item_id, $item, $fields) {
  if (in_array('media', $fields)) :
    $menuImage = get_post_meta($item_id, '_menu_image', true);
    $menuIcon = get_post_meta($item_id, '_menu_icon', true);
    $svgs = get_option('svg') ?: [];
    $iconIndex = array_search($menuIcon, array_column($svgs, 'id')); ?>
    <p class="field-url description description-wide">
      <label for="edit-menu-item-url-<?= $item_id; ?>">
        <?php _e('Image'); ?><br />
        <div class="menu-image-container">
          <?= $menuImage ? '<img src="' . wp_get_attachment_image_src($menuImage, 'small')[0] . '" alt="' . get_post_meta($menuImage, '_wp_attachment_image_alt', true) . '" />' : ''; ?>
        </div>
        <button class="button add-menu-image <?= $menuImage ? 'hidden' : ''; ?>">Add Image</button>
        <button class="button remove-menu-image <?= $menuImage ? '' : 'hidden'; ?>">Remove Image</button>
        <input type="hidden" name="menu_image[<?= $item_id ;?>]" value="<?= esc_attr($menuImage); ?>" />
      </label>
    </p>
    <p class="field-url description description-wide">
      <label for="edit-menu-item-url-<?= $item_id; ?>">
        <?php _e('Icon'); ?><br />
        <button id="icon-button-<?= $item_id; ?>" class="button add-menu-icon" aria-controls="icon-menu-<?= $item_id; ?>"><?= $iconIndex !== false ? '<svg viewbox="' . $svgs[$iconIndex]['viewbox'] . '">' . $svgs[$iconIndex]['path'] . '</svg>' : 'Select Icon'; ?></button>
        <input type="hidden" name="menu_icon[<?= $item_id ;?>]" value="<?= esc_attr($menuIcon); ?>" />
      </label>
    </p>
    <div id="icon-menu-<?= $item_id; ?>" class="svg-select" aria-labelledby="icon-button-<?= $item_id; ?>"></div>
    <?php
  endif;
  if (in_array('hidden_url', $fields)) : ?>
    <input type="hidden" name="menu-item-url[<?= $item_id; ?>]" value="<?= $item->url; ?>" />
    <?php
  endif;
  if (in_array('url', $fields)) : ?>
    <p class="field-url description description-wide">
      <label for="edit-menu-item-url-<?= $item_id; ?>">
        <?php _e('URL'); ?><br />
        <input type="text" id="edit-menu-item-url-<?= $item_id; ?>" class="widefat code edit-menu-item-url" name="menu-item-url[<?= $item_id; ?>]" value="<?= esc_attr($item->url); ?>" />
      </label>
    </p>
    <?php
  endif;
  if (in_array('hidden_label', $fields)) : ?>
    <input type="hidden" id="edit-menu-item-title-<?= $item_id; ?>" name="menu-item-title[<?= $item_id; ?>]" value="<?= esc_attr($item->title); ?>" />
    <?php
  endif;
  if (in_array('navigation_label', $fields)) : ?>
    <p class="description description-wide">
      <label for="edit-menu-item-title-<?= $item_id; ?>">
        <?php _e('Navigation Label'); ?><br />
        <input type="text" id="edit-menu-item-title-<?= $item_id; ?>" class="widefat edit-menu-item-title" name="menu-item-title[<?= $item_id; ?>]" value="<?= esc_attr($item->title); ?>" />
      </label>
    </p>
    <?php
  endif;
  if (in_array('title', $fields)) : ?>
    <p class="field-title-attribute field-attr-title description description-wide">
      <label for="edit-menu-item-attr-title-<?= $item_id; ?>">
        <?php _e('Title Attribute'); ?><br />
        <input type="text" id="edit-menu-item-attr-title-<?= $item_id; ?>" class="widefat edit-menu-item-attr-title" name="menu-item-attr-title[<?= $item_id; ?>]" value="<?= esc_attr($item->post_excerpt); ?>" />
      </label>
    </p>
    <?php
  endif;
  if (in_array('new_tab', $fields)) : ?>
    <p class="field-link-target description">
      <label for="edit-menu-item-target-<?= $item_id; ?>">
        <input type="checkbox" id="edit-menu-item-target-<?= $item_id; ?>" value="_blank" name="menu-item-target[<?= $item_id; ?>]"<?php checked($item->target, '_blank'); ?> />
        <?php _e('Open link in a new tab'); ?>
      </label>
    </p>
    <?php
  endif;
  if (in_array('class', $fields)) : ?>
    <p class="field-css-classes description description-thin">
      <label for="edit-menu-item-classes-<?= $item_id; ?>">
        <?php _e('CSS Classes (optional)'); ?><br />
        <input type="text" id="edit-menu-item-classes-<?= $item_id; ?>" class="widefat code edit-menu-item-classes" name="menu-item-classes[<?= $item_id; ?>]" value="<?= esc_attr(implode(' ', $item->classes)); ?>" />
      </label>
    </p>
    <?php
  endif;
  if (in_array('link_relationship', $fields)) : ?>
    <p class="field-xfn description description-thin">
      <label for="edit-menu-item-xfn-<?= $item_id; ?>">
        <?php _e('Link Relationship (XFN)'); ?><br />
        <input type="text" id="edit-menu-item-xfn-<?= $item_id; ?>" class="widefat code edit-menu-item-xfn" name="menu-item-xfn[<?= $item_id; ?>]" value="<?= esc_attr($item->xfn); ?>" />
      </label>
    </p>
    <?php
  endif;
  if (in_array('description', $fields)) : ?>
    <p class="field-description description description-wide">
      <label for="edit-menu-item-description-<?= $item_id; ?>">
        <?php _e('Description'); ?><br />
        <textarea id="edit-menu-item-description-<?= $item_id; ?>" class="widefat edit-menu-item-description" rows="3" cols="20" name="menu-item-description[<?= $item_id; ?>]"><?= esc_html($item->description); ?></textarea>
        <span class="description"><?php _e('The description will be displayed in the menu if the current theme supports it.'); ?></span>
      </label>
    </p>
    <?php
  endif;
}

// Save image and icon field
function _ws_save_menu_item_custom_fields($menu_id, $menu_item_db_id) {
  if (isset($_POST['menu_image'][$menu_item_db_id])) {
    $sanitized_data = sanitize_text_field($_POST['menu_image'][$menu_item_db_id]);
    update_post_meta($menu_item_db_id, '_menu_image', $sanitized_data);
  }
  else {
    delete_post_meta($menu_item_db_id, '_menu_image');
  }
  if (isset($_POST['menu_icon'][$menu_item_db_id])) {
    $sanitized_data = sanitize_text_field($_POST['menu_icon'][$menu_item_db_id]);
    update_post_meta($menu_item_db_id, '_menu_icon', $sanitized_data);
  }
  else {
    delete_post_meta($menu_item_db_id, '_menu_icon');
  }
}
add_action('wp_update_nav_menu_item', '_ws_save_menu_item_custom_fields', 10, 2);

// Output for heading menu item
function _ws_menu_heading_meta_box() {
  global $_nav_menu_placeholder, $nav_menu_selected_id;
  $_nav_menu_placeholder = $_nav_menu_placeholder < 0 ? $_nav_menu_placeholder - 1 : -1; ?>
  <div id="headingdiv" class="customlinkdiv">
    <p class="wp-clearfix">
      <label class="howto" for="heading-menu-item-name">Text</label>
      <input id="heading-menu-item-name" name="menu-item[<?= $_nav_menu_placeholder; ?>][menu-item-title]" type="text" class="regular-text menu-item-textbox">
    </p>
    <p class="button-controls wp-clearfix">
      <span class="add-to-menu">
        <input type="submit" id="add-heading-menu-item" class="button submit-add-to-menu right" value="Add to Menu" name="add-custom-menu-item" />
        <span class="spinner"></span>
      </span>
    </p>
  </div>
  <?php
}

// Output for search menu item
function _ws_menu_search_meta_box() {
  global $_nav_menu_placeholder, $nav_menu_selected_id;
  $_nav_menu_placeholder = $_nav_menu_placeholder < 0 ? $_nav_menu_placeholder - 1 : -1; ?>
  <div id="searchdiv" class="customlinkdiv">
    <p class="button-controls wp-clearfix">
      <span class="add-to-menu">
        <input type="submit" id="add-search-menu-item" class="button submit-add-to-menu right" value="Add Search Bar to Menu" name="add-custom-menu-item" />
        <span class="spinner"></span>
      </span>
    </p>
  </div>
  <?php
}

// Output for column menu item
function _ws_menu_column_meta_box() {
  global $_nav_menu_placeholder, $nav_menu_selected_id;
  $_nav_menu_placeholder = $_nav_menu_placeholder < 0 ? $_nav_menu_placeholder - 1 : -1; ?>
  <div id="columndiv" class="customlinkdiv">
    <p class="button-controls wp-clearfix">
      <span class="add-to-menu">
        <input type="submit" id="add-column-menu-item" class="button submit-add-to-menu right" value="Add Column to Menu" name="add-custom-menu-item" />
        <span class="spinner"></span>
      </span>
    </p>
  </div>
  <?php
}

// Add custom menu items to inserter
function _ws_add_menu_meta_box() {
  add_meta_box('custom-menu-item-heading', __('Heading', 'ws'), '_ws_menu_heading_meta_box', 'nav-menus', 'side');
  add_meta_box('custom-menu-item-search', __('Search', 'ws'), '_ws_menu_search_meta_box', 'nav-menus', 'side');
  add_meta_box('custom-menu-item-column', __('Column', 'ws'), '_ws_menu_column_meta_box', 'nav-menus', 'side');
}
add_action('admin_init', '_ws_add_menu_meta_box');

// Modify labels for custom menu items
function _ws_menu_item_labels($menu_item) {
  if ($menu_item->type !== 'custom') {
    return $menu_item;
  }
  if ($menu_item->url === '#custom_heading') {
    $menu_item->type_label = __('Heading', 'ws');
  }
  if ($menu_item->url === '#custom_search') {
    $menu_item->type_label = __('Search', 'ws');
  }
  if ($menu_item->url === '#custom_column') {
    $menu_item->type_label = __('Column', 'ws');
  }
  return $menu_item;
}
add_filter('wp_setup_nav_menu_item', '_ws_menu_item_labels');

// Enable all menu items by default
function _ws_set_menu_defaults($user_id) {
  update_user_meta($user_id, 'metaboxhidden_nav-menus', []);
}
add_action('user_register', '_ws_set_menu_defaults', 10, 1);
