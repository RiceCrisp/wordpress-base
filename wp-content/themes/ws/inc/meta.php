<?php
function _ws_register_meta() {
  $metas = [
    [
      'meta_key' => '_header_footer_light_header',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_header_footer_hide_header',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_header_footer_hide_footer',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_seo_title',
      'type' => 'string'
    ],
    [
      'meta_key' => '_seo_description',
      'type' => 'string'
    ],
    [
      'meta_key' => '_seo_keywords',
      'type' => 'string'
    ],
    [
      'meta_key' => '_seo_canonical',
      'type' => 'string'
    ],
    [
      'meta_key' => '_seo_no_index',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_seo_no_follow',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_social_title',
      'type' => 'string'
    ],
    [
      'meta_key' => '_social_description',
      'type' => 'string'
    ],
    [
      'meta_key' => '_social_image',
      'type' => 'integer'
    ],
    [
      'meta_key' => '_social_twitter',
      'type' => 'string'
    ],
    [
      'meta_key' => '_link_url',
      'type' => 'string'
    ],
    [
      'meta_key' => '_link_type',
      'type' => 'string'
    ],
    [
      'meta_key' => '_featured_image_x',
      'type' => 'string'
    ],
    [
      'meta_key' => '_featured_image_y',
      'type' => 'string'
    ],
    [
      'meta_key' => '_author_name',
      'type' => 'string'
    ],
    [
      'meta_key' => '_author_image',
      'type' => 'integer'
    ],
    [
      'meta_key' => '_event_date_tbd',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_event_no_time',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_event_start_date',
      'type' => 'string'
    ],
    [
      'meta_key' => '_event_end_date',
      'type' => 'string'
    ],
    [
      'meta_key' => '_event_has_location',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_event_location_name',
      'type' => 'string'
    ],
    [
      'meta_key' => '_event_location_street',
      'type' => 'string'
    ],
    [
      'meta_key' => '_event_location_city',
      'type' => 'string'
    ],
    [
      'meta_key' => '_event_location_state',
      'type' => 'string'
    ],
    [
      'meta_key' => '_event_location_zip',
      'type' => 'string'
    ],
    [
      'meta_key' => '_event_location_override',
      'type' => 'string'
    ],
    [
      'object_subtype' => 'person',
      'meta_key' => '_person_position',
      'type' => 'string'
    ],
    [
      'meta_key' => '_resource_gated',
      'type' => 'boolean'
    ],
    [
      'meta_key' => '_resource_form_heading',
      'type' => 'string'
    ],
    [
      'meta_key' => '_resource_form',
      'type' => 'string'
    ],
    [
      'meta_key' => '_resource_form_completion_message',
      'type' => 'string'
    ],
    [
      'object_type' => 'user',
      'meta_key' => 'custom_avatar',
      'type' => 'number'
    ]
  ];

  foreach ($metas as $meta) {
    register_meta($meta['object_type'] ?? 'post', $meta['meta_key'], [
      'single' => true,
      'object_subtype' => $meta['object_subtype'] ?? '',
      'show_in_rest' => $meta['show_in_rest'] ?? true,
      'type' => $meta['type'],
      'auth_callback' => function() {
        return current_user_can('edit_posts');
      }
    ]);
  }
}
add_action('init', '_ws_register_meta');
