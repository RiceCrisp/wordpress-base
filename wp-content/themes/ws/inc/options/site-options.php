<?php
// Contains general options for the site/company.
class SiteOptionsPage extends OptionPage {

  public function __construct($name, $args) {
    parent::__construct($name, $args);
    add_action('wp_head', [$this, '_ws_structured_data']);
  }

  public function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields('site_options');
        do_settings_sections('site_options'); ?>
        <div class="site-options"></div>
      </form>
    </div>
    <?php
  }

  public function _ws_structured_data_main() {
    $fields = [];
    $output = '';
    $fields['@context'] = 'http://schema.org';
    $fields['@type'] = 'Organization';
    $fields['url'] = home_url();
    $fields['name'] = get_bloginfo('name');
    if (_ws_shortcode_logo(['src-only' => true])) {
      $fields['logo'] = _ws_shortcode_logo(['src-only' => true]);
    }
    if (get_option('site_phone')) {
      $fields['telephone'] = get_option('site_phone');
    }
    if (get_option('site_email')) {
      $fields['email'] = 'mailto:' . get_option('site_email');
    }
    if (get_option('site_location_street') && get_option('site_location_city') && get_option('site_location_state') && get_option('site_location_zip')) {
      $fields['address'] = [
        '@type' => 'PostalAddress',
        'streetAddress' => get_option('site_location_street'),
        'streetLocality' => get_option('site_location_city'),
        'streetRegion' => get_option('site_location_state'),
        'postalCode' => get_option('site_location_zip'),
        'address' => 'US'
      ];
    }
    $socials = get_option('social_links') ?: [];
    $socials = array_filter($socials);
    $socials = array_values($socials);
    if (!empty($socials)) {
      $fields['sameAs'] = $socials;
    }
    return stripslashes(json_encode($fields));
  }

  public function _ws_structured_data_breadcrumbs() {
    if (!is_front_page()) {
      $fields = [];
      $output = '';
      $fields['@context'] = 'http://schema.org';
      $fields['@type'] = 'BreadcrumbList';
      $breadcrumbs = _ws_breadcrumbs(null, true);
      /* _ws_breadcrumbs doesn't return the homepage so we have to add it in */
      $frontPageId = get_option('page_on_front');
      array_unshift($breadcrumbs, [
        'id' => $frontPageId,
        'url' => get_permalink($frontPageId),
        'title' => get_the_title($frontPageId)
      ]);
      $breadcrumbs = array_map(function($b, $i) {
        return [
          '@type' => 'ListItem',
          'position' => $i + 1,
          'name' => $b['title'],
          'item' => $b['url']
        ];
      }, $breadcrumbs, array_keys($breadcrumbs));
      $fields['itemListElement'] = $breadcrumbs;
      return stripslashes(json_encode($fields));
    }
  }

  public function _ws_structured_data_article() {
    // Publisher logo requirements are too strict
    /* if (get_post_type() === 'post' &&
      get_the_post_thumbnail_url(get_the_ID(), 'full') &&
      get_post_meta(get_the_ID(), '_author', true)
    ) {
      $fields = [];
      $output = '';
      $fields['@context'] = 'http://schema.org';
      $fields['@type'] = 'BlogPosting';
      $fields['headline'] = get_the_title();
      $fields['image'] =
    } */
  }

  public function _ws_structured_data_event() {
    if (get_post_type() === 'event' &&
      get_post_meta(get_the_ID(), '_event_start_date', true) &&
      !get_post_meta(get_the_ID(), '_event_date_tbd', true) &&
      get_post_meta(get_the_ID(), '_event_location', true) &&
      get_post_meta(get_the_ID(), '_event_location_street', true) &&
      get_post_meta(get_the_ID(), '_event_location_city', true) &&
      get_post_meta(get_the_ID(), '_event_location_state', true) &&
      get_post_meta(get_the_ID(), '_event_location_zip', true)
    ) {
      $fields = [];
      $output = '';
      $fields['@context'] = 'http://schema.org';
      $fields['@type'] = 'Event';
      $fields['name'] = get_the_title();
      $noTime = get_post_meta(get_the_ID(), '_event_no_time', true);
      $startDate = get_post_meta(get_the_ID(), '_event_start_date', true);
      if ($noTime) {
        $startDate = substr($startDate, 0, strpos($startDate, 'T'));
      }
      $fields['startDate'] = $startDate;
      $endDate = get_post_meta(get_the_ID(), '_event_end_date', true);
      if ($endDate) {
        if ($noTime) {
          $endDate = substr($endDate, 0, strpos($endDate, 'T'));
        }
        $fields['endDate'] = $endDate;
      }
      if (get_the_post_thumbnail_url(get_the_id(), 'full')) {
        $fields['image'] = get_the_post_thumbnail_url(get_the_id(), 'full');
      }
      $fields['location'] = [
        'address' => [
          '@type' => 'PostalAddress',
          'streetAddress' => get_post_meta(get_the_ID(), '_event_location_street', true),
          'addressLocality' => get_post_meta(get_the_ID(), '_event_location_city', true),
          'addressRegion' => get_post_meta(get_the_ID(), '_event_location_state', true),
          'postalCode' => get_post_meta(get_the_ID(), '_event_location_zip', true),
          'addressCountry' => 'US'
        ]
      ];
      $locationName = get_post_meta(get_the_ID(), '_event_location_name', true);
      if ($locationName) {
        $fields['location']['@type'] = 'Place';
        $fields['location']['name'] = $locationName;
      }
      return stripslashes(json_encode($fields));
    }
    return;
  }

  // Build structured data json
  public function _ws_structured_data() {
    if (!is_singular()) {
      return;
    }
    $output = [
      $this->_ws_structured_data_main(),
      $this->_ws_structured_data_breadcrumbs(),
      $this->_ws_structured_data_article(),
      $this->_ws_structured_data_event()
    ];
    $output = array_filter($output); ?>
    <script type="application/ld+json">
    [
      <?= implode(",\n", $output); ?>
    ]
    </script>
    <?php
  }

}

new SiteOptionsPage('Site Options', [
  'fields' => [
    // Maps
    'google_maps_key' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'google_maps_styles' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    // SEO
    'seo_meta_title' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    // Contact
    'site_phone' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'site_email' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'site_location' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'site_location_id' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'site_location_street' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'site_location_city' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'site_location_state' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'site_location_zip' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'site_location_country' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    // Social
    'social_links' => [
      'type' => 'object',
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            'facebook' => [
              'type' => 'string'
            ],
            'twitter' => [
              'type' => 'string'
            ],
            'instagram' => [
              'type' => 'string'
            ],
            'youtube' => [
              'type' => 'string'
            ],
            'linkedin' => [
              'type' => 'string'
            ]
          ]
        ]
      ]
    ]
  ]
]);
