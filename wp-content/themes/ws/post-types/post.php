<?php
function _ws_post_template() {
  $post_type_object = get_post_type_object('post');
  $post_type_object->template = [
    ['core/paragraph', ['placeholder' => 'Blog posts have their own template, so you only need to type the content of the post. Don\'t forget the featured image.']]
  ];
}
add_action('init', '_ws_post_template');
