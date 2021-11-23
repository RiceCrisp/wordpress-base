<?php
// Redirect for now
wp_redirect(get_permalink(get_option('page_on_front')), 301);
get_header(); ?>

<main id="main" template="archive">
  <section>
    <?php
    if (have_posts()) : ?>
      <div class="container">
        <div class="row">
          <?php
          while (have_posts()) : the_post();
            get_template_part('parts/archive');
          endwhile; ?>
        </div>
      </div>
      <div id="post-navigation">
        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <?php the_posts_navigation(); ?>
            </div>
          </div>
        </div>
      </div>
      <?php
    else : ?>
      <div class="container">
        <div class="row">
          <div class="col-xs-12 center">
            <p>No results found.</p>
          </div>
        </div>
      </div>
      <?php
    endif; ?>
  </section>
</main>

<?php
get_footer(); ?>
