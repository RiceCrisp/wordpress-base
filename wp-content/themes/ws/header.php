<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <?php wp_head(); ?>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
  <meta name="theme-color" content="#FFFFFF" />
  <link rel="profile" href="http://gmpg.org/xfn/11" />
  <script>
    /* Inline script prevents cached resources from firing onload early */
    console.log('load')
  </script>
</head>

<?php
$bodyClasses = ['no-transitions', 'front-end'];
if (get_post_meta(get_the_ID(), '_header_footer_light_header', true)) {
  $bodyClasses[] = 'light-header';
}
if (get_post_meta(get_the_ID(), '_header_footer_hide_header', true)) {
  $bodyClasses[] = 'hide-header';
}
if (get_post_meta(get_the_ID(), '_header_footer_hide_footer', true)) {
  $bodyClasses[] = 'hide-footer';
} ?>
<body <?php body_class(implode(' ', $bodyClasses)); ?>>
  <?php
  $tag_manager_id = get_option('tag_manager_id');
  if ($tag_manager_id) : ?>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?= $tag_manager_id; ?>"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <?php
  endif; ?>
  <div class="site-container">
    <a class="screen-reader-text" href="#main"><?= __('Skip to content', 'ws'); ?></a>
    <header class="site-header header-scroll-top">
      <div class="desktop-nav">
        <div class="container-full">
          <div class="row align-items-center justify-content-between">
            <div class="site-logos">
              <a href="<?= esc_url(home_url('/')); ?>" rel="home">
                <?= _ws_shortcode_logo(['class' => 'dark-logo']); ?>
                <?= _ws_shortcode_logo(['light' => 1, 'class' => 'light-logo']); ?>
              </a>
            </div>
            <nav id="desktop-main-menu" class="header-primary-secondary">
              <?php
              echo _ws_custom_menu_walker('header-primary');
              echo _ws_custom_menu_walker('header-secondary'); ?>
            </nav>
          </div>
        </div>
      </div>
      <div class="mobile-nav">
        <div class="container-fluid">
          <div class="row align-items-center justify-content-between">
            <div class="site-logos">
              <a href="<?= esc_url(home_url('/')); ?>" rel="home">
                <?= _ws_shortcode_logo(['class' => 'dark-logo']); ?>
                <?= _ws_shortcode_logo(['light' => 1, 'class' => 'light-logo']); ?>
              </a>
            </div>
            <button class="hamburger closed" aria-label="<?= __('Toggle Menu', 'ws'); ?>" aria-controls="mobile-main-menu" aria-expanded="false">
              <svg viewBox="0 0 100 100">
                <title><?= __('Toggle Menu', 'ws'); ?></title>
                <path class="closed" d="M5 15 L95 15 M5 50 L95 50 M5 85 L95 85" />
                <path class="opened" d="M10 10 L90 90 Z M90 10 L10 90 Z" />
              </svg>
            </button>
          </div>
        </div>
        <nav id="mobile-main-menu" class="header-primary-secondary">
          <?php
          echo _ws_custom_menu_walker('header-primary', (object)['mobile' => 1]);
          echo _ws_custom_menu_walker('header-secondary', (object)['mobile' => 1]); ?>
        </nav>
      </div>
    </header>
