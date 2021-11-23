<?php
// The only required field is "singular", but you will likely need/want to include other args.
class Taxonomy {

  private $singular;
  private $slug;
  private $plural;
  private $post_types;
  private $description;

  public function __construct($singular, $args = []) {
    $this->singular = $singular;
    $this->plural = $args['plural'] ?? $singular . 's';
    $this->slug = $args['slug'] ?? str_replace('-', '_', sanitize_title($singular));
    $this->post_types = $args['post_types'] ?? [];
    $this->description = $args['description'] ?? 'A custom taxonomy.';
    add_action('init', [$this, '_ws_register_taxonomy']);
  }

  public function _ws_register_taxonomy() {
    $labels = [
      'name' => $this->plural,
      'singular_name' => $this->singular,
      'all_items' => 'All ' . $this->plural,
      'edit_item' => 'Edit ' . $this->singular,
      'view_item' => 'View ' . $this->singular,
      'update_item' => 'Update ' . $this->singular,
      'add_new_item' => 'Add New ' . $this->singular,
      'new_item_name' => 'New ' . $this->singular . ' Name',
      'parent_item' => 'Parent ' . $this->singular,
      'parent_item_colon' => 'Parent ' . $this->singular . ':',
      'search_items' => 'Search ' . $this->plural,
      'popular_items' => 'Popular ' . $this->plural,
      'separate_items_with_commas' => 'Separate ' . strtolower($this->plural) . ' with commas',
      'add_or_remove_items' => 'Add or remove ' . strtolower($this->plural),
      'choose_from_most_used' => 'Choose from the most used ' . strtolower($this->plural),
      'not_found' => 'No ' . strtolower($this->plural) . ' found.'
    ];
    register_taxonomy(
      $this->slug,
      $this->post_types,
      [
        'labels' => $labels,
        'public' => true,
        'show_ui' => true,
        'show_in_menus' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud' => false,
        'show_in_quick_edit' => true,
        'meta_box_cb' => null,
        'show_admin_column' => true,
        'description' => $this->description,
        'hierarchical' => true,
        'query_var' => true,
        'rewrite' => true,
        'capabilities' => [],
        'sort' => false,
        'show_in_rest' => true
      ]
    );
  }

}
