<?php
// Register custom api endpoints in this file.
function _ws_api_endpoint_menu() {
  register_rest_route('ws', '/menu/(?P<location>[\w-]+)', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      $menuId = get_nav_menu_locations()[$data['location']];
      $menu = wp_get_nav_menu_items($menuId);
      $hierarchicalMenu = _ws_build_menu($menu);
      return rest_ensure_response($hierarchicalMenu);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_menu');

function _ws_api_endpoint_widget() {
  register_rest_route('ws', '/widget/(?P<location>[\w-]+)', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      return dynamic_sidebar($data['location']);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_widget');

function _ws_api_endpoint_all() {
  register_rest_route('ws', '/all', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      $args = [
        'post_type' => $data->get_param('post_type') ? explode(',', $data->get_param('post_type')) : 'any',
        'posts_per_page' => $data->get_param('posts_per_page') ?: -1,
        'post__in' => $data->get_param('include') ? explode(',', $data->get_param('include')) : '',
        'omit_no_index' => true,
        'post_parent' => $data->get_param('post_parent') ?: '',
        'paged' => $data->get_param('paged') ?: 0,
        'orderby' => $data->get_param('orderby') ?: ['menu_order' => 'ASC', 'date' => 'DESC'],
        'post_status' => 'publish'
      ];
      if ($data->get_param('s')) {
        $args['s'] = $data->get_param('s');
      }
      // Tax query
      if ($data->get_param('terms')) {
        $taxTerms = explode(',', $data->get_param('terms'));
        $queries = [];
        foreach ($taxTerms as $taxTerm) {
          $taxTerm = explode('~~', $taxTerm);
          if ($taxTerm[1]) {
            $queries[] = [
              'taxonomy' => $taxTerm[0],
              'field' => 'term_id',
              'terms' => explode('~', $taxTerm[1])
            ];
          }
        }
        if (!empty($queries)) {
          $args['tax_query'] = $queries;
        }
      }
      if ($data->get_param('year')) {
        $args['year'] = $data->get_param('year');
      }
      // Event ordering
      if ($data->get_param('post_type') === 'event') {
        $args['orderby'] = 'meta_value';
        $args['meta_key'] = '_event_start_date';
        $args['order'] = 'ASC';
      }
      // Get posts
      $posts = get_posts($args);
      $posts = array_map(function($v) {
        $v->total = wp_count_posts($v->post_type)->publish;
        $v->post_excerpt = get_the_excerpt($v->ID);
        $v->thumbnail = get_the_post_thumbnail_url($v->ID, 'medium');
        if ($v->post_type === 'event') {
          $v->start_date = get_post_meta($v->ID, '_event_start_date', true);
        }
        return $v;
      }, $posts);
      return rest_ensure_response($posts);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_all');

function _ws_api_endpoint_archive() {
  register_rest_route('ws', '/archive', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      $args = [
        'post_type' => $data->get_param('post_type') ? explode(',', $data->get_param('post_type')) : 'any',
        'posts_per_page' => $data->get_param('posts_per_page') ?: -1,
        'post__in' => $data->get_param('include') ? explode(',', $data->get_param('include')) : '',
        'omit_no_index' => true,
        'post_parent' => $data->get_param('post_parent') ?: '',
        'paged' => $data->get_param('paged') ?: 0,
        'orderby' => $data->get_param('orderby') ?: ['menu_order' => 'ASC', 'date' => 'DESC'],
        'post_status' => 'publish'
      ];
      if ($data->get_param('s') || $data->get_param('search')) {
        $args['s'] = $data->get_param('s') ?: $data->get_param('search');
      }
      if ($data->get_param('post__not_in')) {
        $args['post__not_in'] = explode(',', $data->get_param('post__not_in'));
      }
      // Tax query
      if ($data->get_param('terms')) {
        $taxTerms = explode(',', $data->get_param('terms'));
        $queries = [];
        foreach ($taxTerms as $taxTerm) {
          $taxTerm = explode('~~', $taxTerm);
          if ($taxTerm[1]) {
            $terms = explode('~', $taxTerm[1]);
            $queries[] = [
              'taxonomy' => $taxTerm[0],
              'field' => is_numeric($terms[0]) ? 'term_id' : 'slug',
              'terms' => explode('~', $taxTerm[1])
            ];
          }
        }
        if (!empty($queries)) {
          $args['tax_query'] = $queries;
        }
      }
      if ($data->get_param('year')) {
        $args['year'] = $data->get_param('year');
      }
      // Event ordering
      // if ($data->get_param('post_type') === 'event') {
      //   $args['orderby'] = 'meta_value';
      //   $args['meta_key'] = '_event_start_date';
      //   $args['order'] = 'ASC';
      // }
      // Pagination
      if ($data->get_param('paged')) {
        $args['paged'] = $data->get_param('paged');
      }
      $args['omit_no_index'] = true;
      // Get posts
      $loop = new WP_Query($args);
      $count = 0;
      ob_start();
      if ($loop->have_posts()) :
        while ($loop->have_posts()) :
          $loop->the_post();
          get_template_part('parts/archive', $data->get_param('type') ?: get_post_type());
          $count++;
        endwhile;
      else:
        rest_ensure_response(false);
      endif;
      $more = $loop->query['paged'] >= $loop->max_num_pages ? false : true;
      $output = apply_filters('the_content', ob_get_clean());
      return rest_ensure_response([
        'output' => $output,
        'count' => $count,
        'currentPage' => intval($loop->query['paged']),
        'totalPages' => intval($loop->max_num_pages)
      ]);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_archive');

function _ws_api_endpoint_taxterm() {
  register_rest_route('ws', '/taxterm', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      $taxonomies = get_object_taxonomies($data->get_param('post_type'));
      $taxonomies = array_map(function($v) {
        $taxes = get_taxonomy($v);
        $taxes->terms = get_terms($v);
        return $taxes;
      }, $taxonomies);
      return rest_ensure_response($taxonomies);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_taxterm');

function _ws_api_endpoint_years() {
  register_rest_route('ws', '/years', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      $output = [];
      $years = wp_get_archives([
        'type' => 'yearly',
        'format' => 'custom',
        'echo' => 0,
        'post_type' => $data->get_param('post_type')
      ]);
      $years = explode('</a>', $years);
      array_pop($years);
      foreach ($years as $i=>$year) {
        $year = substr($year, -4);
        $output[] = intval($year);
      }
      rsort($output);
      return rest_ensure_response($output);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_years');

function _ws_api_endpoint_breadcrumbs() {
  register_rest_route('ws', '/breadcrumbs/(?P<postId>\d+)', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      $url = get_permalink($data['postId']);
      $includeCurrent = $data->get_param('include_current') ? true : false;
      return rest_ensure_response(_ws_breadcrumbs($url, $includeCurrent));
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_breadcrumbs');

function _ws_api_endpoint_svgs() {
  register_rest_route('ws', '/svgs', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      return rest_ensure_response(get_option('svg'));
    }
  ]);
  register_rest_route('ws', '/svgs/(?P<svgId>[a-zA-Z0-9-]+)', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function($data) {
      $svgs = get_option('svg');
      $key = array_search($data['svgId'], array_column($svgs, 'id'));
      return rest_ensure_response($key !== false ? $svgs[$key] : null);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_svgs');
