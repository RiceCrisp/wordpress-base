<?php
function _ws_block_breadcrumbs($a = []) {
  $a['className'] = ['wp-block-ws-breadcrumbs', ($a['className'] ?? '')];
  $separator = $a['separator'] ?? '/';
  $includeCurrent = $a['includeCurrent'] ?? false;
  ob_start();
    $breadcrumbs = _ws_breadcrumbs(get_permalink(get_the_ID()), $includeCurrent);
    $breadcrumbs = array_map(function($breadcrumb) {
      return '<a href="' . $breadcrumb['url'] . '">' . $breadcrumb['title'] . '</a>';
    }, $breadcrumbs);
    if (count($breadcrumbs) === 0) {
      $a['className'][] = 'empty';
    }
    echo implode('<span class="separator">' . $separator . '</span>', $breadcrumbs);
  return _ws_block_wrapping($a, ob_get_clean());
}

function _ws_breadcrumbs($url = null, $includeCurrent = false) {
  $url = $url ?: $_SERVER['REQUEST_URI'];
  $url = preg_match('/https?:\/\//', $url) ? preg_replace('/https?:\/\/.*?\//', '', $url) : $url;
  $pIds = [];
  $urlParts = explode('/', trim($url, '/'));
  $urlPartsCount = count($urlParts);
  for ($i = 0; $i < $urlPartsCount; $i++) {
    $url = '';
    for ($ii = 0; $ii <= $i; $ii++) {
      $url .= $urlParts[$ii] . '/';
    }
    $pIds[] = url_to_postid($url);
  }
  if (!$includeCurrent) {
    array_pop($pIds);
  }
  if (is_preview()) {
    array_pop($pIds);
  }
  return array_map(function($id) {
    return [
      'id' => $id,
      'url' => get_permalink($id),
      'title' => get_the_title($id)
    ];
  }, $pIds);
}
