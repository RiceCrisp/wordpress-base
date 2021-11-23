<?php
// Uploading SVG's directly to the media manager is a security concern, so we provide our own SVG manager.
class SVGPage extends OptionPage {

  function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields('svg');
        do_settings_sections('svg'); ?>
        <div class="svg-options"></div>
      </form>
    </div>
    <?php
  }

}

new SVGPage('SVG Manager', [
  'slug' => 'svg',
  'fields' => [
    'svgs' => [
      'type' => 'array',
      'show_in_rest' => [
        'schema' => [
          'type' => 'array',
          'items' => [
            'type' => 'object',
            'properties' => [
              'uid' => [
                'type' => 'string'
              ],
              'id' => [
                'type' => 'string'
              ],
              'title' => [
                'type' => 'string'
              ],
              'viewbox' => [
                'type' => 'string'
              ],
              'path' => [
                'type' => 'string'
              ]
            ]
          ]
        ]
      ]
    ]
  ]
]);
