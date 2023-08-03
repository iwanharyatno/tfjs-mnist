<?php

function console_log($message) {
    $STDERR = fopen("php://stderr", "w");
              fwrite($STDERR, "\n".$message."\n\n");
              fclose($STDERR);
}

function saveFile($file) {
  $name = $file['name'];
  $tmp = $file['tmp_name'];

  $result = move_uploaded_file($tmp, 'uploads/' . $name);
  if (!$result) {
    http_response_code(500);
  }
}

console_log(json_encode($_FILES));

$topology = $_FILES['model_json'];
$weights = $_FILES['model_weights_bin'];

saveFile($topology);
saveFile($weights);
