<?php
class PersonMeta extends PostMeta {

}

new PersonMeta('Person', [
  'template' => [
    ['ws/meta-person'],
    ['core/paragraph', ['placeholder' => 'Persons have their own template, so you only need to type the content of the post. Don\'t forget meta and featured image.']]
  ],
  'dashicon' => 'dashicons-groups',
  'url' => 'team'
]);

new Taxonomy('Department', [
  'post_types' => ['person'],
  'description' => 'Taxonomy for persons.'
]);
