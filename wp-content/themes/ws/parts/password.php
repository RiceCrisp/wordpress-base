<div id="main" class="main password-page">
  <section class="wp-block-ws-section">
    <div class="container section-container">
      <div class="section-inner">
        <form class="post-password-form wp-block-search" action="/wp-login.php?action=postpass" method="POST">
          <p>This content is password protected. Please enter the password to continue.</p>
          <?php
          $id = uniqid(); ?>
          <label for="pwbox-<?= $id; ?>"><?= __('Password', 'ws'); ?></label>
          <input class="wp-block-search__input" name="post_password" id="pwbox-<?= $id; ?>" type="password">
          <input class="wp-block-search__button" type="submit" value="<?= __('Submit', 'ws'); ?>">
        </form>
      </div>
    </div>
  </section>
</div>
