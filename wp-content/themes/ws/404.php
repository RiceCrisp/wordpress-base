<?php
get_header(); ?>

<main id="main" class="main" data-template="404">
  <section class="wp-block-ws-section">
    <div class="block-background"></div>
    <div class="container section-container">
      <div class="section-inner">
        <h1 class="page-title"><?= __('Page Not Found', 'ws'); ?></h1>
        <p><?= __('It seems we can\'t find what you\'re looking for. Perhaps searching can help.'); ?></p>
        <form class="wp-block-search" role="search" method="get" action="<?= esc_url(home_url('/')); ?>">
          <label for="wp-block-search__input" class="wp-block-search__label">Search</label>
          <input type="search" id="wp-block-search__input" class="wp-block-search__input" name="s" placeholder="">
          <button type="submit" class="wp-block-search__button">Search</button>
        </form>
      </div>
    </div>
  </section>
</main>

<?php
get_footer(); ?>
