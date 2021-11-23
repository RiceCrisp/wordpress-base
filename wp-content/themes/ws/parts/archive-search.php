<div class="col-md-6 col-lg-4 archive-view archive-default archive-search">
  <div class="archive-element">
    <div class="archive-body">
      <p class="label"><?= _ws_get_post_label(get_post_type()); ?></p>
      <div class="title-excerpt">
        <h3 class="post-title"><?= _ws_get_link(get_the_ID()); ?></h3>
        <?= has_excerpt() ? '<p class="post-excerpt">' . get_the_excerpt() . '</p>' : ''; ?>
      </div>
    </div>
  </div>
</div>
