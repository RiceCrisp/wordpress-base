<?php
get_header(); ?>

<main id="main" class="main archive load-more" data-template="search">
  <section class="wp-block-ws-section">
    <div class="block-background"></div>
    <div class="container section-container">
      <div class="section-inner">
        <div class="row">
          <div class="col-lg-10 col-xl-8">
            <h1><?= __('Search Results', 'ws'); ?></h1>
            <form class="wp-block-search archive-filters" role="search" method="get" action="<?= esc_url(home_url('/')); ?>">
              <input type="hidden" name="posts_per_page" value="<?= get_option('posts_per_page'); ?>" />
              <input type="hidden" name="paged" value="1" />
              <input type="hidden" name="type" value="search" />
              <label for="wp-block-search__input" class="wp-block-search__label">Search</label>
              <input type="search" id="wp-block-search__input" class="wp-block-search__input" name="s" value="<?= isset($_GET['s']) ? sanitize_text_field($_GET['s']) : ''; ?>" placeholder="">
              <button type="submit" class="wp-block-search__button">Search</button>
            </form>
          </div>
        </div>
        <div class="wp-block">
          <div class="row default-row archive-results"></div>
        </div>
      </div>
    </div>
  </section>
</main>

<?php
get_footer(); ?>
