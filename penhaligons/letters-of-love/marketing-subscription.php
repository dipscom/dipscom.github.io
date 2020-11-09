<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    return;
}
$api_key = 'abfcdcf7b3e2f321957641af9b03b2a6-us15';
$url = 'https://us15.api.mailchimp.com/3.0/lists/%s/members/%s';
$username = 'apikey';
$list_id = '91f9e2526b';

foreach ($_POST as $key => $field) {
    switch ($key) {
        case 'email':
            $data['email_address'] = $field;
            break;

        case 'status':
            $data['status'] = $field;
            $data['status_if_new'] = $field;
            break;

        case 'request-type':
            continue;
            break;

        default:
            $data['merge_fields'][$key] = $field;
            break;
    }
}

$data_string = json_encode($data);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, sprintf($url, $list_id, md5($data['email_address'])));
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$api_key");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . base64_encode('user:' . $api_key),
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data_string)
]);

$result = curl_exec($ch);
curl_close($ch);

header('Content-type: application/json');

exit(json_encode(['sent' => $data, 'received' => json_decode($result, true)]));
