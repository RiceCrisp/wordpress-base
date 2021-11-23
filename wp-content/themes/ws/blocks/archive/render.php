<?php
function _ws_block_archive($a = []) {
  $a['className'] = ['wp-block-ws-archive', 'archive', ($a['className'] ?? '')];
  $filters = $a['filters'] ?? [];
  $postTypes = $a['postTypes'] ?? [];
  $type = !empty($a['type']) && $a['type'] !== 'default' ? $a['type'] : '';
  $loadMore = !empty($a['loadMore']) ? 'load-more' : 'pagination';
  $numPosts = $a['numPosts'] ?? get_option('posts_per_page');
  $numPosts = !empty($a['allPosts']) ? -1 : $numPosts;
  $rowClass = $type ?: (count($postTypes) > 1 ? 'default' : ($postTypes[0] ?? 'none'));
  $a['className'][] = $loadMore;
  ob_start();
    _ws_archive_build_filters($filters, $postTypes, $numPosts, $type); ?>
    <div class="archive-results row <?= $rowClass . '-row'; ?>">
    </div>
    <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}

function _ws_archive_build_filters($filters, $postTypes, $numPosts, $type) {
  $years = '';
  foreach ($postTypes as $postType) {
    $years .= wp_get_archives([
      'type' => 'yearly',
      'format' => 'custom',
      'echo' => 0,
      'post_type' => $postType
    ]);
  }
  $years = explode('</a>', $years);
  array_pop($years);
  $years = array_map(function($year) {
    return substr($year, -4);
  }, $years);
  $years = array_unique($years);
  $urlParts = parse_url($_SERVER['REQUEST_URI']);
  $url = preg_replace('/\/page\/\d+\//i', '/', $urlParts['path']); ?>
  <form class="archive-filters <?= 'archive-filters-' . count($filters); ?>" action="<?= $url; ?>" method="GET">
    <input type="hidden" name="type" value="<?= $type; ?>" />
    <input type="hidden" name="post_type" value="<?= implode(',', $postTypes); ?>" />
    <input type="hidden" name="posts_per_page" value="<?= $numPosts; ?>" />
    <input type="hidden" name="paged" value="<?= get_query_var('paged') ?: 1; ?>" />
    <div class="row">
      <?php
      foreach ($filters as $tax) :
        if ($tax === 'year') : ?>
          <div class="col-xs-12 archive-filter">
            <label for="archive-filter-year"><?= __('Filter by Year', 'ws'); ?></label>
            <select id="archive-filter-year" name="filter-year">
              <option value="">All Years</option>
              <?php
              $years = '';
              foreach ($postTypes as $postType) {
                $years .= wp_get_archives([
                  'type' => 'yearly',
                  'format' => 'custom',
                  'echo' => 0,
                  'post_type' => $postType
                ]);
              }
              $years = explode('</a>', $years);
              array_pop($years);
              $years = array_map(function($year) {
                return substr($year, -4);
              }, $years);
              $years = array_unique($years);
              foreach ($years as $i=>$year) : ?>
                <option value="<?= $year; ?>" <?= isset($_GET['filter-year']) && $_GET['filter-year'] === $year ? 'selected' : ''; ?>><?= $year; ?></option>
                <?php
              endforeach; ?>
            </select>
          </div>
          <?php
        elseif ($tax === 'timeline') : ?>
          <div class="col-xs-12 archive-filter">
            <label for="archive-filter-timeline"><?= __('Past & Upcoming', 'ws'); ?></label>
            <select id="archive-filter-timeline" name="filter-timeline">
              <option value="">All</option>
              <option value="upcoming" <?= isset($_GET['filter-timeline']) && $_GET['filter-timeline'] === 'upcoming' ? 'selected' : ''; ?>>Upcoming</option>
              <option value="past" <?= isset($_GET['filter-timeline']) && $_GET['filter-timeline'] === 'past' ? 'selected' : ''; ?>>Past</option>
            </select>
          </div>
          <?php
        elseif ($tax === 'post_type') : ?>
          <div class="col-xs-12 archive-filter">
            <label for="archive-filter-post_type"><?= __('Filter by Post Type', 'ws'); ?></label>
            <select id="archive-filter-post_type" name="filter-post_type">
              <option value="">All</option>
              <?php
              foreach ($postTypes as $postType) :
                $postType = get_post_type_object($postType); ?>
                <option value="<?= $postType->name; ?>" <?= isset($_GET['filter-post_type']) && $_GET['filter-post_type'] === $postType->name ? 'selected' : ''; ?>><?= $postType->label; ?></option>
                <?php
              endforeach; ?>
            </select>
          </div>
          <?php
        elseif ($tax === 'search') : ?>
          <div class="col-xs-12 archive-filter">
            <label for="archive-filter-search"><?= __('Search', 'ws'); ?></label>
            <input id="archive-filter-search" name="search" value="<?= isset($_GET['search']) ? sanitize_text_field($_GET['search']) : ''; ?>" type="text" />
            <?= do_shortcode('[svg id="search" class="search-icon"]'); ?>
          </div>
          <?php
        else :
          $tax = get_taxonomy($tax);
          if ($tax) : ?>
            <div class="col-xs-12 archive-filter">
              <label for="archive-filter-<?= $tax->name; ?>">Filter by <?= $tax->labels->singular_name; ?></label>
              <select id="archive-filter-<?= $tax->name; ?>" name="filter-<?= $tax->name; ?>">
                <option value="">All <?= $tax->label; ?></option>
                <?php
                $terms = get_terms(array('taxonomy' => $tax->name));
                foreach ($terms as $term) : ?>
                  <option value="<?= $term->slug; ?>" <?= isset($_GET['filter-' . $tax->name]) && $_GET['filter-' . $tax->name] === $term->slug ? 'selected' : '' ?>><?= $term->name; ?></option>
                  <?php
                endforeach; ?>
              </select>
            </div>
            <?php
          endif;
        endif;
      endforeach; ?>
    </div>
  </form>
  <?php
}

function _ws_archive_results($postTypes, $numPosts) {
  $urlParts = parse_url($_SERVER['REQUEST_URI']);
  $args = [
    'post_type' => $postTypes,
    'posts_per_page' => $numPosts,
    'paged' => get_query_var('paged') ?: 1,
    'omit_no_index' => true,
    'post_status' => 'publish',
    'tax_query' => []
  ];
  if (isset($urlParts['query'])) {
    $pairs = explode('&', $urlParts['query']);
    foreach ($pairs as $pair) {
      $temp = explode('=', $pair);
      $key = $temp[0];
      $value = $temp[1];
      if (substr($key, 0, 7) === 'filter-' && $value) {
        $taxonomy = substr($key, 7);
        if ($taxonomy === 'post_type') {
          $args['post_type'] = $value;
        }
        else {
          $args['tax_query'][] = [
            'taxonomy' => $taxonomy,
            'field' => 'slug',
            'terms' => $value
          ];
        }
      }
      else if ($key === 'search') {
        $args['s'] = $value;
      }
    }
  }
  $loop = new WP_Query($args);
  if ($loop->have_posts()) :
    while ($loop->have_posts()) :
      $loop->the_post();
      get_template_part('parts/archive', $_REQUEST['type'] ?? get_post_type());
    endwhile;
  else :
    echo '<div class="col-xs-12"><p class="no-results">' . __('No results found', 'ws') . '</p></div>';
  endif;
  $totalPages = $loop->max_num_pages;
  if ($totalPages > 1) : ?>
    <div class="col-xs-12 archive-pagination">
      <?php
      $url = preg_replace('/\/page\/\d+\//i', '/', $urlParts['path']);
      for ($i = 1; $i <= $totalPages; $i++) {
        $page = $i === 1 ? '' : 'page/' . $i . '/';
        $query = $urlParts['query'] ? '?' . $urlParts['query'] : '';
        $currentPage = get_query_var('paged') < 2 ? 1 : get_query_var('paged');
        echo '<a href="' . $url . $page . $query . '" ' . ($currentPage === $i ? 'class="current"' : '') . '>' . $i . '</a>';
      } ?>
    </div>
    <?php
  endif;
}
