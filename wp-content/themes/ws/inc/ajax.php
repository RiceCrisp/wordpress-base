<?php
// Return csv of pages for bulk edit
function _ws_get_bulk() {
  $types = $_REQUEST['types'];
  if ($types) {
    $postTypes = explode(',', $types);
  }
  else {
    $postTypes = get_post_types(['public' => true]);
    unset($postTypes['attachment']);
  }
  $ps = get_posts([
    'post_type' => $postTypes,
    'posts_per_page' => -1
  ]);
  $csv = "url,id\n";
  foreach ($ps as $p) {
    $csv .= get_permalink($p->ID) . "," . $p->ID . "\n";
  }
  wp_send_json($csv);
  wp_die();
}
add_action('wp_ajax__ws_get_bulk', '_ws_get_bulk');
add_action('wp_ajax_nopriv__ws_get_bulk', '_ws_get_bulk');

// Update meta data from uploaded bulk edit csv
function _ws_set_bulk() {
  $count = 0;
  $rows = str_getcsv(stripslashes($_REQUEST['csv']), "\n");
  $colNames = str_getcsv($rows[0]);
  // Row loop
  $rowCount = count($rows);
  for ($i = 1; $i < $rowCount; $i++) {
    $cols = str_getcsv($rows[$i]);
    $id = $cols[0];
    // Insert new post
    if ($id === '0') {
      $count++;
      $titleCol = array_search('post_title', $colNames);
      $id = wp_insert_post([
        'post_title' => $titleCol >= 0 ? trim(stripslashes($cols[$titleCol])) : 'Import ' . $count,
        'post_status' => 'publish'
      ]);
    }
    $post = get_post($id);
    if ($post) {
      // Column loop
      $colCount = count($cols);
      for ($ii = 1; $ii < $colCount; $ii++) {
        $colName = trim($colNames[$ii]);
        $val = trim(stripslashes($cols[$ii]));
        // Meta
        if (substr($colName, 0, 1) === '_' && $val) {
          update_post_meta($id, $colName, $val);
        }
        // Tax terms
        if (substr($colName, 0, 4) === 'tax_' && $val) {
          wp_set_object_terms($id, explode(',', $val), substr($colName, 4));
        }
        // Post info
        else if ($post && array_key_exists($colName, $post) && $val) {
          $post->$colName = $val;
          wp_update_post($post);
        }
      }
    }
  }
  wp_send_json(true);
  wp_die();
}
add_action('wp_ajax__ws_set_bulk', '_ws_set_bulk');
add_action('wp_ajax_nopriv__ws_set_bulk', '_ws_set_bulk');
