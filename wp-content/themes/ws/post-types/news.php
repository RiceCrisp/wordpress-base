<?php
class NewsMeta extends PostMeta {

}

new NewsMeta('News', [
  'plural' => 'news',
  'template' => [
    ['core/paragraph', ['placeholder' => 'News posts have their own template, so you only need to type the content of the post. Don\'t forget the featured image.']]
  ],
  'dashicon' => 'dashicons-megaphone',
  'url' => 'about/news'
]);

new Taxonomy('News Type', [
  'post_types' => ['news'],
  'description' => 'Taxonomy for news.'
]);
