<?php

if (!empty($_GET['jsonString'])) {
    $params1 = $_GET["jsonString"];
}$params1 = preg_replace('/"/', '\"', $params1);

$pathToR = "/usr/local/bin/R";

$pathToRScript = "/var/www/html/flowPeaks/fileformat.R";

$cmd = "$pathToR  --vanilla --quiet --slave --args \"$params1\"  <  $pathToRScript";

$ret = exec($cmd, $out = array(), $status);
if ($status != 0) {
    // Command execution failed
//    echo "Error running R";
} else {
    // Command executed OK.
//    echo "OK!";
    $folder = substr($_SERVER['SCRIPT_NAME'], 0, strrpos($_SERVER['SCRIPT_NAME'], "/") + 1);
    $host = $_SERVER['HTTP_HOST'];
    $baseURL = "http://" . $host . $folder;
    $decodedRet = json_decode($ret);
    $updatedRet = array('ret' => $decodedRet, 'baseURL' => $baseURL);
     $ret = json_encode($updatedRet);    
//    var_dump($updatedRet);
//    $decoded = json_decode($ret);
//    var_dump($decoded);
//    $info = $decoded->info;
//    $info->new = 'baseURL';
//    $info->baseURL = '1234';
//    $decoded->info = $info;
//    var_dump($decoded);
//    $ret = json_encode($decoded);
}



echo isset($_GET['callback']) ? "{$_GET['callback']}($ret)" : $ret;
?>
