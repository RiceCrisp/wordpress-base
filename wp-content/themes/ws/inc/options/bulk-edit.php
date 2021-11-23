<?php
// Tool for bulk editing WordPress posts and pages.
class BulkEditPage extends OptionPage {

  public function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <div class="bulk-edit-options"></div>
      </form>
    </div>
    <?php
  }

}

new BulkEditPage('Bulk Edit', [
  'slug' => 'bulk',
  'menu' => 'tools'
]);
