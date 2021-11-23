<?php
class EventMeta extends PostMeta {

  public function __construct($singular, $args) {
    parent::__construct($singular, $args);
    add_filter('manage_edit-event_columns', [$this, '_ws_date_column']);
    add_action('manage_event_posts_custom_column', [$this, '_ws_column_content'], 10, 2);
    add_filter('manage_edit-event_sortable_columns', [$this, '_ws_sortable_column']);
    // add_action('pre_get_posts', [$this, '_ws_orderby']);
  }

  // Add start date column
  public function _ws_date_column($columns) {
    $columns['start_date'] = 'Start Date';
    return $columns;
  }

  // Column content
  public function _ws_column_content($column_name, $post_id) {
    if ($column_name != 'start_date') {
      return;
    }
    $start_dates = get_post_meta($post_id, '_event_start_date', true);
    echo $start_dates;
  }

  // Make column sortable
  public function _ws_sortable_column($columns) {
    $columns['start_date'] = 'start_date';
    return $columns;
  }

  // Sort column by date and then time
  public function _ws_orderby($query) {
    if (!is_admin()) {
      return;
    }
    $orderby = $query->get('orderby');
    if ($orderby === 'start_date') {
      $query->set('meta_key', '_event_start_date');
      $query->set('orderby', 'meta_value_num');
    }
  }

}

new EventMeta('Event', [
  'template' => [
    ['ws/meta-event'],
    ['core/paragraph', ['placeholder' => 'Events have their own template, so you only need to type the content of the post. Don\'t forget the featured image.']]
  ],
  'dashicon' => 'dashicons-calendar',
  'url' => 'events'
]);
