<?php
class CaseStudyMeta extends PostMeta {

}

new CaseStudyMeta('Case Study', [
  'plural' => 'Case Studies',
  'template' => [
    ['core/paragraph']
  ],
  'dashicon' => 'dashicons-index-card',
  'url' => 'our-work'
]);

new Taxonomy('Industry', [
  'plural' => 'Industries',
  'post_types' => ['case_study'],
  'description' => 'Taxonomy for case studies.'
]);
