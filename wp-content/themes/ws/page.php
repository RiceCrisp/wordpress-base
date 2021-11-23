<?php
get_header();

if (have_posts()) :
  while (have_posts()) :
    the_post();
    if (post_password_required()) {
      get_template_part('parts/password');
    }
    else {
      echo '<main id="main" class="main page">';
        the_content();
      echo '</main>';
    }
  endwhile;
endif;

get_footer(); ?>
