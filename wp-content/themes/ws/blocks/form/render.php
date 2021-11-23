<?php
function _ws_block_form($a = [], $content = '') {
  $a['className'] = ['wp-block-ws-form', ($a['className'] ?? '')];
  $form = $a['form'] ?? '';
  $content = preg_replace('/<p>[\t\r\n\s]*<\/p>/', '', $content);
  if (substr($form, 0, 4) === 'http') {
    $form = '<iframe src="' . $form . '"></iframe>';
  }
  else if (preg_match('/<form id="mktoForm_\d+/', $form)) {
    $form = preg_replace('/<script>MktoForms2\.loadForm.*?<\/script>/', '', $form);
    $form = preg_replace('/<form id="mktoForm_/', '<form class="mktoForm" data-form-id="', $form);
  }
  ob_start();
    echo $form;
    echo trim($content) ? '<div class="form-msg">' . base64_encode(trim($content)) . '</div>' : '';
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
