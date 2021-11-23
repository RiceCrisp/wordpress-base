<?php
// The only required field is "singular", but you will likely need/want to include other args.
class PostMeta {

  private $singular;
  private $plural;
  private $slug;
  private $template;
  private $dashicon;
  private $url;
  private $public;

  public function __construct($singular, $args = []) {
    $this->singular = $singular;
    $this->plural = $args['plural'] ?? $singular . 's';
    $this->slug = $args['slug'] ?? str_replace('-', '_', sanitize_title($singular));
    $this->template = $args['template'] ?? [];
    $this->dashicon = $args['dashicon'] ?? 'dashicons-admin-post';
    $this->url = $args['url'] ?? '';
    $this->public = $args['public'] ?? true;
    if ($this->singular) {
      add_action('init', [$this, '_ws_register_post_type']);
    }
  }

  public function _ws_register_post_type() {
    $labels = [
      'name' => ucwords($this->plural),
      'singular_name' => ucwords($this->singular),
      'add_new_item' => 'Add New ' . ucwords($this->singular),
      'edit_item' => 'Edit ' . ucwords($this->singular),
      'new_item' => 'New ' . ucwords($this->singular),
      'view_item' => 'View ' . ucwords($this->singular),
      'search_items' => 'Search ' . ucwords($this->plural),
      'not_found' => 'No ' . strtolower($this->plural) . ' found',
      'not_found_in_trash' => 'No ' . strtolower($this->plural) . ' found in Trash',
      'parent_item_colon' => 'Parent ' . ucwords($this->singular) . ':',
      'all_items' => 'All ' . ucwords($this->plural),
      'archives' => ucwords($this->singular) . ' Archives',
      'insert_into_item' => 'Insert into ' . strtolower($this->singular),
      'uploaded_to_this_item' => 'Uploaded to this ' . strtolower($this->singular),
      'featured_image' => 'Featured image',
      'set_featured_image' => 'Set featured image',
      'remove_featured_image' => 'Remove featured image',
      'use_featured_image' => 'Use as featured image'
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Sortable/filterable ' . strtolower($this->plural),
      'public' => $this->public,
      'exclude_from_search' => false,
      'publicly_queryable' => $this->public,
      'show_ui' => true,
      'show_in_nav_menus' => true,
      'show_in_menu' => true,
      'show_in_admin_bar' => true,
      'menu_position' => 20,
      'menu_icon' => $this->dashicon,
      'capability_type' => 'post',
      'hierarchical' => false,
      'supports' => ['title', 'editor', 'author', 'thumbnail', 'excerpt', 'revisions', 'custom-fields'],
      'register_meta_box_cb' => null,
      'taxonomies' => [],
      'has_archive' => false,
      'rewrite' => ($this->url ? ['slug'=>$this->url, 'with_front'=>false] : []),
      'query_var' => true,
      'show_in_rest' => true,
      'template' => $this->template
    ];
    register_post_type($this->slug, $args);

    if ($this->url) {
      add_rewrite_rule(
        '^' . $this->url . '/page/(\d+)/?$',
        'index.php?pagename=' . $this->url . '&paged=$matches[1]',
        'top'
      );
    }
  }

}
