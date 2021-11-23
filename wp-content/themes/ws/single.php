<?php
get_header();

if (have_posts()) :
  while (have_posts()) :
    the_post();
    if (post_password_required()) {
      get_template_part('parts/password');
    }
    else {
      get_template_part('parts/single', get_post_type());
    }
  endwhile;
endif;

get_footer(); ?>
