<?php

if (!empty($_GET['args'])) {
    $decoded = json_decode($_GET['args']);
//    var_dump($decoded);
    $files = $decoded->filenames;
    $filename = $files[0];
    $file = '"' . $decoded->dirName . DIRECTORY_SEPARATOR . $decoded->session_id . DIRECTORY_SEPARATOR . $filename . '"';
    $file = $decoded->dirName . DIRECTORY_SEPARATOR . $decoded->session_id . DIRECTORY_SEPARATOR . $filename;

    $headers = getHeader($file);

    $rtnjsonobj['status'] = 'ok';
    $rtnjsonobj['msg'] = '';
    $rtnjsonobj['val'] = $headers;
} else {
    $rtnjsonobj['status'] = 'failed';
}
$json = json_encode($rtnjsonobj);
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;
/*
  $pathToR = "/usr/local/bin/R";
  $pathToRScript = "/var/www/html/flowPeaks/script.R";
  //$cmd = "$pathToR  --vanilla --quiet --slave --args \"$params\"  <  $pathToRScript > /var/www/html/tmp/R.out";
  $cmd = "$pathToR  --vanilla --quiet --slave --args \"$params\"  <  $pathToRScript";
  //echo "Command:<br>$cmd";
  $ret = exec($cmd, $out = array(), $status);
  echo "<br>output: $ret<br>";
  //    echo "<br>ret: $ret<br>";
  if ($status != 0) {
  // Command execution failed
  echo "Error running R";
  } else {
  // Command executed.
  echo "OK!";
  }
 */

function getHeader($file) {
//    echo "file: $file";
//    $content = file($file);
//      $header = $content[0];

    $f = file_get_contents($file);
    $f = explode("\n", $f, 2);
    $f[0] = trim($f[0]);
    $h = explode("\t", $f[0]);

    $header = $h;


    return $header;
}

?>
