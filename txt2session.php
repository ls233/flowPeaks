<?php
session_start();
$filename = $_GET["filename"];
array_push($_SESSION['filenames'],$filename);
?>
