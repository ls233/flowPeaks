<?php
session_id($_REQUEST['sID']);
session_start();
if (!empty($_FILES)) {
   $tempFile = $_FILES['Filedata']['tmp_name'];
   $targetPath = $_SERVER['DOCUMENT_ROOT'] . $_GET['folder'] . '/';
   $targetFile =  str_replace('//','/',$targetPath) . $_FILES['Filedata']['name'];

   // Uncomment the following line if you want to make the directory if it doesn't exist
    mkdir(str_replace('//','/',$targetPath), 0755, true);

   move_uploaded_file($tempFile,$targetFile);
}

$fileName = $_FILES['Filedata']['name'];
array_push($_SESSION['filenames'],$fileName);

echo "1";
?>