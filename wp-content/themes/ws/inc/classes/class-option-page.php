<?php
// We define the options page and fields but the output of the page is handled via React (src/js/admin/options)
class OptionPage {

  protected $slug;
  private $name;
  private $menu;
  private $fields;

  public function __construct($name, $args = []) {
    $this->name = $name;
    $this->slug = $args['slug'] ?? str_replace('-', '_', sanitize_title($name));
    $this->menu = $args['menu'] ?? 'settings';
    $this->fields = $args['fields'] ?? [];
    add_action('admin_menu', [$this, '_ws_register_option']);
    add_action('admin_init', [$this, '_ws_option_fields']);
    add_action('rest_api_init', [$this, '_ws_option_fields']);
  }

  // Register option page and menu item
  public function _ws_register_option() {
    if ($this->menu === 'tools') {
      add_management_page($this->name, $this->name, 'manage_options', $this->slug, [$this, '_ws_option_page']);
    }
    else {
      add_options_page($this->name, $this->name, 'manage_options', $this->slug, [$this, '_ws_option_page']);
    }
  }

  // Define option page fields
  public function _ws_option_fields() {
    foreach ($this->fields as $name => $field) {
      register_setting(
        $this->slug,
        $name,
        $field
      );
    }
  }

}
