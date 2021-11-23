<?php
class JobMeta extends PostMeta {

  public function __construct($singular, $args) {
    parent::__construct($singular, $args);
    if (!wp_next_scheduled('_ws_job_api_routine')) {
      wp_schedule_event(time(), 'twicedaily', '_ws_job_api_routine');
    }
    add_action('_ws_job_api_routine', [$this, '_ws_job_api']);
    add_action('switch_theme', [$this, '_ws_deactivate_job_api_routine']);
  }

  private function unescapeUTF8($str) {
    return html_entity_decode(preg_replace_callback(
      "/\\\u([0-9a-f]{4})/i",
      function ($matches) {
        return html_entity_decode('&#x' . $matches[1] . ';', ENT_QUOTES, 'UTF-8');
      },
      $str
    ));
  }

  // Hit job API
  public function _ws_job_api() {
    $response = curlRequest('GET', 'https://boards-api.greenhouse.io/v1/boards/walkersands/jobs?content=true');
    if ($response) {
      $apiJobs = json_decode($response)->jobs;
      $currentJobs = get_posts(['post_type' => 'job', 'posts_per_page' => -1]);
      $this->remove_old_jobs($apiJobs, $currentJobs);
      $apiJobs = $this->update_existing_jobs($apiJobs, $currentJobs); // Returns only new api jobs
      $this->add_new_jobs($apiJobs, $currentJobs);
    }
  }

  private function remove_old_jobs($apiJobs, $currentJobs) {
    foreach ($currentJobs as $currentJob) {
      $currentJobID = get_post_meta($currentJob->ID, '_job_id', true);
      $keep = false;
      foreach ($apiJobs as $apiJob) {
        if ((string)$apiJob->id === $currentJobID) {
          $keep = true;
          break;
        }
      }
      if (!$keep) {
        wp_delete_post($currentJob->ID);
      }
    }
  }

  private function update_existing_jobs($apiJobs, $currentJobs) {
    foreach ($currentJobs as $currentJob) {
      $currentJobID = get_post_meta($currentJob->ID, '_job_id', true);
      foreach ($apiJobs as $i => $apiJob) {
        if ((string)$apiJob->id === $currentJobID) {
          wp_update_post([
            'ID' => $currentJob->ID,
            'post_title' => $apiJob->title,
            'post_date' => $apiJob->updated_at,
            'post_content' => $this->unescapeUTF8($apiJob->content)
          ]);
          wp_set_object_terms($currentJob->ID, [$apiJob->location->name], 'job_location');
          unset($apiJobs[$i]);
          break;
        }
      }
    }
    return $apiJobs;
  }

  private function add_new_jobs($apiJobs) {
    foreach ($apiJobs as $apiJob) {
      $id = wp_insert_post([
        'post_type' => 'job',
        'post_title' => $apiJob->title,
        'post_date' => $apiJob->updated_at,
        'post_content' => $this->unescapeUTF8($apiJob->content),
        'post_status' => 'publish'
      ]);
      update_post_meta($id, '_job_id', (string)$apiJob->id);
      wp_set_object_terms($id, [$apiJob->location->name], 'job_location');
    }
  }

  public function _ws_deactivate_job_api_routine() {
    wp_clear_scheduled_hook('_ws_job_api_routine');
  }

}

new JobMeta('Job', [
  'template' => [
    ['core/paragraph', ['placeholder' => 'Jobs are updated via Greenhouse. If you add a job via WordPress it will be overwritten/removed with 24 hours.']]
  ],
  'dashicon' => 'dashicons-id',
  'url' => 'careers'
]);
