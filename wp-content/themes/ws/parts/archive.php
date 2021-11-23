<div class="col-md-6 col-lg-4 archive-view archive-default archive-<?= get_post_type(); ?>">
  <div class="archive-element card-link">
    <?php
    if (has_post_thumbnail()) : ?>
      <div class="object-fit-container archive-image">
        <?= _ws_thumbnail(get_the_ID()); ?>
      </div>
      <?php
    endif; ?>
    <div class="archive-body">
      <p class="label"><?= _ws_get_post_label(get_post_type()); ?></p>
      <div class="title-excerpt">
        <h3 class="post-title"><?= _ws_get_link(get_the_ID()); ?></h3>
      </div>
    </div>
  </div>
</div>
