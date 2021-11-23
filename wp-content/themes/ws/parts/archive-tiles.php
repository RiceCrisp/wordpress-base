<div class="archive-view archive-tile">
  <div class="archive-element card-link">
    <div <?= _ws_thumbnail_background(get_the_ID()); ?>>
      <div class="tile-content square">
        <h3 class="post-title"><?= _ws_get_link(get_the_ID()); ?></h3>
        <?= has_excerpt() ? '<p class="post-excerpt">' . get_the_excerpt() . '</p>' : ''; ?>
      </div>
    </div>
  </div>
</div>
