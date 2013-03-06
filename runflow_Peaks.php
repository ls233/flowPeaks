<?php

//session_start();

require_once('FirePHPCore/FirePHP.class.php');
//$firephp = FirePHP::getInstance(true);
//$firephp->log(session_id(), 'session_id');

if (!empty($_GET['jsonString'])) {
    $params1 = $_GET["jsonString"];
}$params1 = preg_replace('/"/', '\"', $params1);

$pathToR = "R";

$pathToRScript = "/var/www/html/flowPeaks/script.R";

$cmd = "$pathToR  --vanilla --quiet --slave --args \"$params1\"  <  $pathToRScript";

$ret = exec($cmd, $out = array(), $status);
//$firephp->log($ret, 'ret');

if ($status != 0) {
    // Command execution failed
    $ret = array('status' => 'failed', 'msg' => 'Command' . $cmd . 'failed.');
} else {
    // Command executed OK.
    $ret = json_decode($ret);    
    $ret = array('status' => 'ok', 'ret' => $ret);
    $ret = json_encode($ret);    
}

echo isset($_GET['callback']) ? "{$_GET['callback']}($ret)" : $ret;
?>
