<?php

session_id('ihiqs9b9t3vu4v5e0jlirot8l0');
session_start();
$_SESSION['filenames'] = array('barcode.txt');
$array = array('status' => 'ok');
$array['filenames'] = $_SESSION['filenames'];
$array['dirName'] = getcwd();
$array['session_id'] = session_id();
$folder = substr($_SERVER['SCRIPT_NAME'], 0, strrpos($_SERVER['SCRIPT_NAME'], "/") + 1);
$host = $_SERVER['HTTP_HOST'];
$baseURL = "http://" . $host . $folder;
$array['baseURL'] = $baseURL;

echo json_encode($array);
?>
