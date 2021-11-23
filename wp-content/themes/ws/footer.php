    <footer class="site-footer">
      <div class="footer-main">
        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <ul class="widgets footer-1">
                <?php dynamic_sidebar('footer-1'); ?>
              </ul>
            </div>
            <div class="col-lg-4">
              <ul class="widgets footer-2">
                <?php dynamic_sidebar('footer-2'); ?>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-legal">
        <div class="container">
          <ul class="widgets">
            <?php dynamic_sidebar('legal'); ?>
          </ul>
        </div>
      </div>
    </footer>
    <?php
    wp_footer(); ?>
  </div>
</body>
</html>
