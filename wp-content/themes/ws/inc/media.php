<?php
// Add featured image support and define custom small size
function _ws_media_setup() {
  add_theme_support('post-thumbnails');
  add_image_size('logo', 150, 150, false);
  add_image_size('small', 256, 256, false);
}
add_action('after_setup_theme', '_ws_media_setup');

// Add custom small size to the media settings page
function _ws_custom_image_sizes($sizes) {
  return array_slice($sizes, 0, 1, true) +
    ['logo' => __('Logo', 'ws')] +
    ['small' => __('Small', 'ws')] +
    array_slice($sizes, 1, null, true);
}
add_filter('image_size_names_choose', '_ws_custom_image_sizes');

// Set default image sizes
function _ws_image_sizes() {
  update_option('thumbnail_size_w', 150);
  update_option('thumbnail_size_h', 150);

  update_option('medium_size_w', 576);
  update_option('medium_size_h', 576);

  update_option('large_size_w', 768);
  update_option('large_size_h', 768);
}
add_action('after_switch_theme', '_ws_image_sizes');

// Set max image dimensions for upload
function _ws_maximum_image_size($file) {
  $type = $file['type'];
  if (substr($type, 0, 5) === 'image') {
    $image = getimagesize($file['tmp_name']);
    $max = 2000;
    $width = $image[0];
    $height = $image[1];
    if ($width > $max || $height > $max) {
      return ['error' => 'Uploaded image dimensions (' . $width . ' x ' . $height . ') exceed maximum dimensions (' . $max . ' x ' . $max . '). Please resize the image, and try again.'];
    }
  }
  return $file;
}
add_filter('wp_handle_upload_prefilter', '_ws_maximum_image_size');
