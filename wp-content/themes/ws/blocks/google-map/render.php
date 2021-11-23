<?php
function _ws_block_google_map($a = []) {
  $a['className'] = ['wp-block-ws-google-map', ($a['className'] ?? '')];
  $location = $a['location'] ?? [];
  $localStyles = $a['styles'] ?? '';
  $mapsKey = get_option('google_maps_key');
  $globalStyles = get_option('google_maps_styles') ?: [];
  $styles = $localStyles ?: $globalStyles;
  // We run json_decode before json_encode to remove whitespace
  ob_start();
    if ($mapsKey && $location) :
      if ($styles) : ?>
        <div class="google-map" data-locations="<?= rawurlencode(json_encode([$location])); ?>" data-styles="<?= rawurlencode(json_encode(json_decode($localStyles))); ?>"></div>
        <?php
      else :
        $locationArray = [];
        foreach ($location as $key => $value) {
          if (in_array($key, ['name', 'street', 'city', 'state', 'zip']) && $value) {
            $locationArray[] = $value;
          }
        }
        $locationString = implode('+', $locationArray); ?>
        <iframe class="google-map" width="600" height="450" frameborder="0" src="https://www.google.com/maps/embed/v1/place?key=<?= $mapsKey; ?>&q=<?= str_replace(' ', '+', strip_tags($locationString)); ?>" allowfullscreen></iframe>
        <?php
      endif;
    endif;
  return _ws_block_wrapping($a, ob_get_clean());
}
