<?php
class ResourceMeta extends PostMeta {

}

new ResourceMeta('Resource', [
  'template' => [
    ['ws/meta-resource'],
    ['core/paragraph', ['placeholder' => 'Resources have their own template, so you only need to type the content of the post. Don\'t forget the featured image.']]
  ],
  'dashicon' => 'dashicons-analytics',
  'url' => 'resources'
]);

new Taxonomy('Resource Type', [
  'post_types' => ['resource'],
  'description' => 'Taxonomy for resources.'
]);
new Taxonomy('Resource Topic', [
  'post_types' => ['resource'],
  'description' => 'Taxonomy for resources.'
]);
