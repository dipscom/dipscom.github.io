<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    return;
}
$api_key = 'abfcdcf7b3e2f321957641af9b03b2a6-us15';
$url = 'https://us15.api.mailchimp.com/3.0/lists/%s/members/%s';
$username = 'apikey';
$list_id = 'bca48feff8';

foreach ($_POST as $key => $field) {
    switch ($key) {
        case 'email':
            $data['email_address'] = $field;
            $data['merge_fields']['MD5'] = md5($field);
            // $data['status'] = 'subscribed';
            $data['status'] = 'pending';
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

curl_setopt($ch, CURLOPT_URL, sprintf($url, $list_id, (isset($_POST['MD5']) ? $_POST['MD5'] : null)));
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$api_key");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . base64_encode('user:' . $api_key),
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data_string)
]);

if(isset($_POST['MD5'])){
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
}

$result = curl_exec($ch);
curl_close($ch);

header('Content-type: application/json');

exit(json_encode(['sent' => $data, 'received' => json_decode($result, true)]));
