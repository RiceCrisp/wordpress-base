<?php
// Redirect Attachment pages to either the associated page/post or the homepage if none exists
wp_redirect(get_permalink($post->post_parent ?: get_option('page_on_front')), 301); ?>
