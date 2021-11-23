<?php
// Create duplicate action
function _ws_duplicate_link($actions, $post) {
  if (current_user_can('edit_posts')) {
    $actions['duplicate'] = '<a href="' . wp_nonce_url('admin.php?action=ws_duplicate&post=' . $post->ID, basename(__FILE__), 'duplicate_nonce') . '">Duplicate</a>';
  }
  return $actions;
}
add_filter('post_row_actions', '_ws_duplicate_link', 10, 2);
add_filter('page_row_actions', '_ws_duplicate_link', 10, 2);

// Duplicate post/page
function _ws_duplicate() {
  global $wpdb;
  if (!isset($_GET['duplicate_nonce']) || !wp_verify_nonce($_GET['duplicate_nonce'], basename(__FILE__))) {
    return;
  }
  if (!isset($_GET['post'])) {
    wp_die('No post to duplicate has been supplied!');
  }
  $post = get_post(absint($_GET['post']));
  if (isset($post) && $post != null) {
    $args = [
      'comment_status' => $post->comment_status,
      'ping_status'    => $post->ping_status,
      'post_author'    => $post->post_author,
      'post_content'   => addslashes($post->post_content),
      'post_excerpt'   => $post->post_excerpt,
      'post_parent'    => $post->post_parent,
      'post_password'  => $post->post_password,
      'post_status'    => 'draft',
      'post_type'      => $post->post_type,
      'to_ping'        => $post->to_ping,
      'menu_order'     => $post->menu_order
    ];
    $new_post_id = wp_insert_post($args);
    // Taxonomies
    $taxonomies = get_object_taxonomies($post->post_type);
    foreach ($taxonomies as $taxonomy) {
      $post_terms = wp_get_object_terms($post->ID, $taxonomy, ['fields' => 'slugs']);
      wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
    }
    // Meta
    $post_meta_infos = $wpdb->get_results("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id=$post->ID");
    if (count($post_meta_infos)) {
      $sql_query = "INSERT INTO $wpdb->postmeta (post_id, meta_key, meta_value) ";
      foreach ($post_meta_infos as $meta_info) {
        $meta_key = $meta_info->meta_key;
        if ($meta_key == '_wp_old_slug') {
          continue;
        }
        $meta_value = addslashes($meta_info->meta_value);
        $sql_query_sel[] = "SELECT $new_post_id, '$meta_key', '$meta_value'";
      }
      $sql_query .= implode(" UNION ALL ", $sql_query_sel);
      $wpdb->query($sql_query);
    }
    // Redirect to edit
    wp_redirect(admin_url('post.php?action=edit&post=' . $new_post_id));
    exit;
  }
  else {
    wp_die('Post creation failed, could not find original post: ' . $post->ID);
  }
}
add_action('admin_action_ws_duplicate', '_ws_duplicate');
