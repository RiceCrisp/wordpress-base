<?php
function _ws_page_template() {
  $post_type_object = get_post_type_object('page');
  $post_type_object->template = [
    ['ws/section', [], [
      ['ws/split', ['verticalAlignment' => 'center'], [
        ['ws/split-half', ['width' => 6], [
          ['core/heading', ['level' => 1]]
        ]],
        ['ws/split-half', ['width' => 6]]
      ]]
    ]]
  ];
}
add_action('init', '_ws_page_template');

new Taxonomy('Page Type', [
  'post_types' => ['page'],
  'description' => 'Taxonomy for pages.'
]);
