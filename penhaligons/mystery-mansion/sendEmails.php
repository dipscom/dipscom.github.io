<?php
$api_key = 'abfcdcf7b3e2f321957641af9b03b2a6-us15';
$url = 'https://us15.api.mailchimp.com/3.0/lists/%s/members/';
$username = 'apikey';
$data = array('status' => 'unsubscribed');
$collection = 'ea0699e7b8';
$weekend_away = 'b72b62df3b';

foreach ($_POST as $key => $field) {
    switch ($key) {
    case 'email':
      $data['email_address'] = $field;
      break;

    case 'status':
      if ($field === 'subscribe') {
          $data[$key] = 'subscribed';
      }
      break;

    case 'list':
      switch ($field) {
        case 'collection':
          $list_id = $collection;
          break;

        case 'weekend-away':
          $list_id = $weekend_away;
          break;

        default:
          $list_id = 'invalid';
          break;
      }
      break;

    default:
      $data['merge_fields'][$key] = $field;
      break;
  }
}

$data_string = json_encode($data);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, sprintf($url, $list_id));
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$api_key");
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data_string))
);

$result = curl_exec($ch);
curl_close($ch);
var_dump($_POST);
