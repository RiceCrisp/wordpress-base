<?php
// Handles GTM and CRM keys, however CRM keys do not do anything at the moment.
class AnalyticsPage extends OptionPage {

  public function __construct($name, $args) {
    parent::__construct($name, $args);
    add_action('wp_head', [$this, '_ws_analytics_header'], 1);
  }

  function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields('analytics');
        do_settings_sections('analytics'); ?>
        <div class="analytics-options"></div>
      </form>
    </div>
    <?php
  }

  public function _ws_analytics_header() {
    $tag_manager_id = get_option('tag_manager_id');
    if ($tag_manager_id) : ?>
      <!-- Google Tag Manager -->
      <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', '<?= $tag_manager_id; ?>');</script>
      <!-- End Google Tag Manager -->
      <?php
    endif;
  }

}

new AnalyticsPage('Tracking & Analytics', [
  'slug' => 'analytics',
  'fields' => [
    'tag_manager_id' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'pardot_email' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'pardot_password' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'pardot_key' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'pardot_account' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'marketo_endpoint' => [
      'type' => 'string',
      'show_in_rest' => true
    ],
    'marketo_token' => [
      'type' => 'string',
      'show_in_rest' => true
    ]
  ]
]);

if (!isset($_SESSION['prospect'])) {
  $prospect = null;
  // Pardot
  if (get_option('pardot_email') && get_option('pardot_password') && get_option('pardot_key')) {
    $key = curlRequest('GET', 'https://pi.pardot.com/api/login/version/4',
      [
        'email' => get_option('pardot_email'),
        'password' => get_option('pardot_password'),
        'user_key' => get_option('pardot_key')
      ]
    );
    $api_key = simplexml_load_string($key)->api_key;
    $prospect = curlRequest('GET', 'https://pi.pardot.com/api/prospect/version/4/do/read/id/' . $_COOKIE['vistor_id' . get_option('pardot_account')],
      [
        'api_key' => simplexml_load_string($key)->api_key,
        'user_key' => get_option('pardot_key')
      ]
    );
  }
  // Marketo
  else if (get_option('marketo_endpoint') && get_option('marketo_token')) {
    $prospect = curlRequest('GET', get_option('market_endpoint') . '/v1/leads.json?access_token=' . get_option('token') . '&filterType=cookies&filterValues=' . $_COOKIE['_mkto_trk'] . '&fields=cookies,email');
  }
  $_SESSION['prospect'] = $prospect;
}
