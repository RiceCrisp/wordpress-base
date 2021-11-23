<?php
function _ws_lazy_load_images($content) {
  // Move src to data-src for all images unless given the class "no-lazy"
  $content = preg_replace(
    '/<img(?![^>]+?class=["\'][^>"]*?no-lazy)([^>]*?)src=["\'](.*?)["\'](.*?)>/s',
    '<img$1 src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="$2"$3>',
    $content
  );

  // Move srcset to data-srcset for all images unless given the class "no-lazy"
  $content = preg_replace(
    '/<img(?![^>]+?class=["\'][^>"]*?no-lazy)([^>]*?)srcset=["\'](.*?)["\'](.*?)>/s',
    '<img$1 data-srcset="$2"$3>',
    $content
  );

  // Move sizes to data-sizes for all images unless given the class "no-lazy"
  $content = preg_replace(
    '/<img(?![^>]+?class=["\'][^>"]*?no-lazy)([^>]*?)sizes=["\'](.*?)["\'](.*?)>/s',
    '<img$1 data-sizes="$2"$3>',
    $content
  );

  // Add class "lazy-load" to images with data-src that already have a class
  $content = preg_replace(
    '/<img(?=[^>]+?(?:data-src|data-srcset)=["\'])([^>]*?)class=["\']([^">]*?)["\'](.*?)>/s',
    '<img$1 class="$2 lazy-load"$3>',
    $content
  );

  // Add class "lazy-load" to images with data-src that don't already have a class
  $content = preg_replace(
    '/<img(?![^>]+?class=["\'])(?=[^>]+?(?:data-src|data-srcset)=["\'])(.*?)>/s',
    '<img class="lazy-load"$1>',
    $content
  );

  return $content;
}
// add_filter('the_content', '_ws_lazy_load_images');

function _ws_lazy_load_videos($content) {
  // Move src to data-src for all videos unless given the class "no-lazy"
  $content = preg_replace(
    '/<video(?![^>]+?class=["\'][^>"]*?no-lazy)([^>]*?)src=["\'](.*?)["\'](.*?)>/s',
    '<video$1 data-src="$2"$3>',
    $content
  );

  // Add class "lazy-load" to images with data-src that already have a class
  $content = preg_replace(
    '/<video(?=[^>]+?(?:data-src|data-srcset)=["\'])([^>]*?)class=["\']([^">]*?)["\'](.*?)>/s',
    '<video$1 class="$2 lazy-load"$3>',
    $content
  );

  // Add class "lazy-load" to images with data-src that don't already have a class
  $content = preg_replace(
    '/<video(?![^>]+?class=["\'])(?=[^>]+?(?:data-src|data-srcset)=["\'])(.*?)>/s',
    '<video class="lazy-load"$1>',
    $content
  );

  return $content;
}
// add_filter('the_content', '_ws_lazy_load_videos');

function _ws_lazy_load_iframes($content) {
  // Move src to data-src for all iframes unless given the class "no-lazy"
  $content = preg_replace(
    '/<iframe(?![^>]+?class=["\'][^>"]*?no-lazy)([^>]*?)src=["\'](.*?)["\'](.*?)>/s',
    '<iframe$1 data-src="$2"$3>',
    $content
  );

  // Add class "lazy-load" to iframes with data-src that already have a class
  $content = preg_replace(
    '/<iframe(?=[^>]+?(?:data-src|data-srcset)=["\'])([^>]*?)class=["\']([^">]*?)["\'](.*?)>/s',
    '<iframe$1 class="$2 lazy-load"$3>',
    $content
  );

  // Add class "lazy-load" to iframes with data-src that don't already have a class
  $content = preg_replace(
    '/<iframe(?![^>]+?class=["\'])(?=[^>]+?(?:data-src|data-srcset)=["\'])(.*?)>/s',
    '<iframe class="lazy-load"$1>',
    $content
  );

  return $content;
}
add_filter('the_content', '_ws_lazy_load_iframes');
