<?php
$banner = get_post_meta(get_the_ID(), '_resource_banner_image', true); ?>
<div id="main" class="main single-view">
  <section class="wp-block-ws-section <?= $banner ? 'has-background-image' : ''; ?>">
    <div class="container section-container">
      <div class="section-inner">
        <div class="wp-block-ws-split align-items-center">
          <div class="wp-block-ws-split-half">
            <?= _ws_block_breadcrumbs(); ?>
            <h1><?= get_the_title(); ?></h1>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="wp-block-ws-section <?= has_post_thumbnail() ? 'padding-top-50' : 'padding-top-0'; ?>">
    <div class="container section-container">
      <div class="section-inner">
        <div class="wp-block-ws-split">
          <div class="wp-block-ws-split-half col-8">
            <div class="split-half-inner">
              <?php
              the_content();
              echo _ws_get_prev_next(); ?>
            </div>
          </div>
          <div class="wp-block-ws-split-half col-4">
            <div class="split-half-inner">
              <?php
              $formHeading = get_post_meta(get_the_ID(), '_resource_form_heading', true) ?: 'Download Now';
              $form = get_post_meta(get_the_ID(), '_resource_form', true);
              if ($form) : ?>
                <div class="wp-block-ws-card">
                  <div class="card">
                    <div class="card-body">
                      <h3><?= $formHeading; ?></h3>
                      <iframe class="wp-block" src="<?= $form; ?>" title="Form"></iframe>
                    </div>
                  </div>
                </div>
                <?php
              endif; ?>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
