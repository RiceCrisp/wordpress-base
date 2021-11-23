<?php
// Create meta tags in the header
function _ws_meta() {
  if (is_404()) {
    echo '<title>' . __('Page Not Found', 'ws') . (get_option('seo_meta_title') ? ' ' . get_option('seo_meta_title') : '') . '</title>';
    return;
  }
  if (is_search()) {
    echo '<title>' . __('Search Results', 'ws') . (get_option('seo_meta_title') ? ' ' . get_option('seo_meta_title') : '') . '</title>';
    return;
  }
  if (!is_singular()) {
    return;
  }

  $seo_title = get_post_meta(get_the_ID(), '_seo_title', true);
  $seo_description = get_post_meta(get_the_ID(), '_seo_description', true);
  $seo_keywords = get_post_meta(get_the_ID(), '_seo_keywords', true);
  $seo_canonical = get_post_meta(get_the_ID(), '_seo_canonical', true);
  $seo_no_index = get_post_meta(get_the_ID(), '_seo_no_index', true);
  $seo_no_follow = get_post_meta(get_the_ID(), '_seo_no_follow', true);
  $social_title = get_post_meta(get_the_ID(), '_social_title', true);
  $social_description = get_post_meta(get_the_ID(), '_social_description', true);
  $social_image = wp_get_attachment_image_src(get_post_meta(get_the_ID(), '_social_image', true), 'large');
  $social_twitter = get_post_meta(get_the_ID(), '_social_twitter', true);
  $generic_title = get_the_title();
  $generic_description = get_the_excerpt();
  $generic_image = wp_get_attachment_image_src(get_post_thumbnail_id(), 'full');
  $html = '';

  $html .= _ws_build_seo_meta_tags($seo_title, $seo_description, $seo_keywords, $seo_canonical, $seo_no_index, $seo_no_follow, $generic_title, $generic_description);
  $html .= _ws_build_social_meta_tags($seo_title, $seo_description, $seo_canonical, $social_title, $social_description, $social_image, $social_twitter, $generic_title, $generic_description, $generic_image);

  echo $html;
}
add_action('wp_head', '_ws_meta');

function _ws_build_seo_meta_tags($seo_title, $seo_description, $seo_keywords, $seo_canonical, $seo_no_index, $seo_no_follow, $generic_title, $generic_description) {
  global $post;
  $html = '';
  if ($seo_title || $generic_title) {
    $html .= '<title>' . ($seo_title ?: $generic_title) . (get_option('seo_meta_title') && !is_front_page() ? ' ' . get_option('seo_meta_title') : '') . '</title>';
  }
  if ($seo_description || $generic_description) {
    $html .= '<meta name="description" content="' . htmlentities($seo_description ?: $generic_description) . '" />';
  }
  if ($seo_keywords) {
    $html .= '<meta name="keywords" content="' . $seo_keywords . '" />';
  }
  $robots = $seo_no_index ? 'NOINDEX, ' : 'INDEX, ';
  $robots .= $seo_no_follow ? 'NOFOLLOW' : 'FOLLOW';
  $html .= '<meta name="robots" content="' . $robots . '" />';
  $html .= '<link rel="canonical" href="' . ($seo_canonical ?: get_permalink()) . '" />';
  return $html;
}

function _ws_build_social_meta_tags($seo_title, $seo_description, $seo_canonical, $social_title, $social_description, $social_image, $social_twitter, $generic_title, $generic_description, $generic_image) {
  $html = '';
  // Open Graph Protocol
  if ($social_title || $seo_title || $generic_title) {
    $html .= '<meta property="og:title" content="' . ($social_title ?: $seo_title ?: $generic_title) . '" />';
  }
  $html .= '<meta property="og:type" content="article" />';
  $html .= '<meta property="og:url" content="' . ($seo_canonical ?: get_permalink()) . '" />';
  if ($social_image || $generic_image) {
    $html .= '<meta property="og:image" content="' . ($social_image ? $social_image[0] : $generic_image[0]) . '" />';
    $html .= '<meta property="og:image:width" content="' . ($social_image ? $social_image[1] : $generic_image[1]) . '" />';
    $html .= '<meta property="og:image:height" content="' . ($social_image ? $social_image[2] : $generic_image[2]) . '" />';
  }

  // Optional
  if ($social_description || $seo_description || $generic_description) {
    $html .= '<meta property="og:description" content="' . htmlentities($social_description ?: $seo_description ?: $generic_description) . '" />';
  }
  $html .= '<meta property="og:site_name" content="' . get_bloginfo('name') . '" />';

  // Twitter
  $html .= $social_image ? '<meta name="twitter:card" content="summary_large_image" />' : '<meta name="twitter:card" content="summary" />';
  if ($social_twitter) {
    $html .= '<meta name="twitter:site" content="@' . $social_twitter . '" />';
  }
  if ($social_title || $seo_title || $generic_title) {
    $html .= '<meta name="twitter:title" content="' . ($social_title ?: $seo_title ?: $generic_title) . '" />';
  }
  if ($social_description || $seo_description || $generic_description) {
    $html .= '<meta name="twitter:description" content="' . htmlentities($social_description ?: $seo_description ?: $generic_description) . '" />';
  }
  if ($social_image || $generic_image) {
    $html .= '<meta name="twitter:image" content="' . ($social_image ? $social_image[0] : $generic_image[0]) . '" />';
  }
  return $html;
}
