<?php
// Register/unregister block patterns
function ws_block_patterns() {
  register_block_pattern_category(
    'layouts',
    [
      'label' => __('Layouts', 'ws')
    ]
  );
  register_block_pattern(
    'ws/two-columns-text',
    [
      'title' => __('Two columns of text', 'ws'),
      'categories' => ['layouts'],
      'content' => '<!-- wp:heading -->
<h2>Lorem ipsum dolor sit amet</h2>
<!-- /wp:heading -->

<!-- wp:ws/split -->
<!-- wp:ws/split-half {"width":6} -->
<!-- wp:paragraph -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis a condimentum vitae sapien pellentesque habitant. Nec dui nunc mattis enim ut tellus elementum. Tristique nulla aliquet enim tortor at auctor urna. Urna neque viverra justo nec ultrices dui sapien eget. Sed enim ut sem viverra aliquet eget. Tempor nec feugiat nisl pretium fusce id.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Erat pellentesque adipiscing commodo elit at imperdiet. Lectus urna duis convallis convallis. Facilisis volutpat est velit egestas. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Quis hendrerit dolor magna eget. Pharetra sit amet aliquam id diam maecenas ultricies. Pharetra vel turpis nunc eget lorem dolor. Integer enim neque volutpat ac tincidunt vitae. Nam at lectus urna duis convallis convallis tellus id.</p>
<!-- /wp:paragraph -->
<!-- /wp:ws/split-half -->

<!-- wp:ws/split-half {"width":6} -->
<!-- wp:paragraph -->
<p>Nisl nisi scelerisque eu ultrices. Sem viverra aliquet eget sit amet tellus cras adipiscing. Quisque id diam vel quam elementum pulvinar. Pellentesque sit amet porttitor eget dolor. Condimentum id venenatis a condimentum vitae. Porttitor massa id neque aliquam vestibulum. Pharetra massa massa ultricies mi quis.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Nibh tellus molestie nunc non blandit massa enim. In tellus integer feugiat scelerisque varius morbi enim. Nunc scelerisque viverra mauris in aliquam. Mi bibendum neque egestas congue quisque egestas diam in. In fermentum posuere urna nec tincidunt praesent semper. Facilisi cras fermentum odio eu feugiat. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Ultrices mi tempus imperdiet nulla malesuada pellentesque.</p>
<!-- /wp:paragraph -->
<!-- /wp:ws/split-half -->
<!-- /wp:ws/split -->'
    ]
  );
  register_block_pattern(
    'ws/four-columns-logos',
    [
      'title' => __('Four columns of logos', 'ws'),
      'categories' => ['layouts'],
      'content' => '<!-- wp:ws/layout-row {"verticalAlignment":"center"} -->

<!-- wp:ws/layout-column {"width":4} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":4} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":4} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":4} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":4} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":4} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":4} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":4} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->
<!-- /wp:ws/layout-row -->'
    ]
  );
  register_block_pattern(
    'ws/six-columns-logos',
    [
      'title' => __('Six columns of logos', 'ws'),
      'categories' => ['layouts'],
      'content' => '<!-- wp:ws/layout-row {"verticalAlignment":"center"} -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- wp:ws/layout-column {"width":6} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_logo.png" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/layout-column -->

<!-- /wp:ws/layout-row -->'
    ]
  );
  register_block_pattern(
    'ws/related-resources',
    [
      'title' => __('Related resources', 'ws'),
      'categories' => ['layouts'],
      'content' => '<!-- wp:ws/split {"verticalAlignment":"center"} -->

<!-- wp:ws/split-half -->
<!-- wp:heading -->
<h2>Related Resources</h2>
<!-- /wp:heading -->
<!-- /wp:ws/split-half -->

<!-- wp:ws/split-half -->
<!-- wp:buttons {"contentJustification":"right"} -->
<div class="wp-block-buttons is-content-justification-right"><!-- wp:button {"className":"is-style-arrow"} -->
<div class="wp-block-button is-style-arrow"><a class="wp-block-button__link">View All</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->
<!-- /wp:ws/split-half -->

<!-- /wp:ws/split -->

<!-- wp:ws/select-content {"ids":[]} /-->'
    ]
  );
  register_block_pattern(
    'ws/alternating-media-content',
    [
      'title' => __('Alternating Content/Media', 'ws'),
      'categories' => ['layouts'],
      'content' => '<!-- wp:ws/split {"verticalAlignment":"center","variant":"large-right","padding":true} -->

<!-- wp:ws/split-half {"verticalAlignment":"center"} -->
<!-- wp:heading -->
<h2>Heading</h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Non vel curabitur convallis a duis augue natoque a non in urna nibh per cursus semper nisl muserlte suspen disse ultricies a natoque lorem ipsum dolor. Convallis a duis augue natoque a non in urna nibh per cursus semper lorem ipsum dolor siet.</p>
<!-- /wp:paragraph -->
<!-- /wp:ws/split-half -->

<!-- wp:ws/split-half {"verticalAlignment":"center"} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_image.jpg" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/split-half -->
<!-- /wp:ws/split -->

<!-- wp:ws/spacer /-->

<!-- wp:ws/split {"verticalAlignment":"center","variant":"large-left","padding":true,"mobileReverse":true} -->
<!-- wp:ws/split-half {"verticalAlignment":"center"} -->
<!-- wp:heading -->
<h2>Heading</h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Non vel curabitur convallis a duis augue natoque a non in urna nibh per cursus semper nisl muserlte suspen disse ultricies a natoque lorem ipsum dolor. Convallis a duis augue natoque a non in urna nibh per cursus semper lorem ipsum dolor siet.</p>
<!-- /wp:paragraph -->
<!-- /wp:ws/split-half -->

<!-- wp:ws/split-half {"verticalAlignment":"center"} -->
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="/wp-content/themes/ws/assets/placeholder_image.jpg" alt=""/></figure></div>
<!-- /wp:image -->
<!-- /wp:ws/split-half -->

<!-- /wp:ws/split -->'
    ]
  );
}
add_action('init', 'ws_block_patterns');
