<div class="col-lg-4 col-md-6 archive-view archive-card">
  <div class="archive-element card card-link">
    <?php
    if (has_post_thumbnail()) : ?>
      <div class="object-fit-container card-image archive-image">
        <?= _ws_thumbnail(get_the_ID()); ?>
      </div>
      <?php
    endif; ?>
    <div class="card-body">
      <p class="label"><?= _ws_get_post_label(get_post_type()); ?></p>
      <div class="title-excerpt">
        <h3 class="post-title"><?= _ws_get_link(get_the_ID()); ?></h3>
      </div>
    </div>
  </div>
</div>
