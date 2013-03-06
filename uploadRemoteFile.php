<?php

//session_id($_REQUEST['sID']);
session_start();
#echo 'session_id: ' . session_id() . '<br>';
$status = 'failed';
$errors = array();
if (!empty($_GET['remoteFile'])) {
    $remoteFile = $_GET['remoteFile'];
    #   echo 'remoteFile: ' . $remoteFile . '<br>';

    $targetPath = getcwd() . DIRECTORY_SEPARATOR . session_id();
//   $targetFile =  str_replace('//','/',$targetPath) . $_FILES['Filedata']['name'];
    // Uncomment the following line if you want to make the directory if it doesn't exist
    #  echo 'targetPath: ' . $targetPath . '<br>';
    if (!file_exists($targetPath)) {
        mkdir(str_replace('//', '/', $targetPath), 0777, true);
    }
    

    $path_parts = pathinfo($remoteFile);
    $fileName = $path_parts['filename'] . '.' . $path_parts['extension'];
    $targetFile = getcwd() . DIRECTORY_SEPARATOR . session_id() . DIRECTORY_SEPARATOR . $fileName;
    if (copy($remoteFile, $targetFile)) {
        $status = 'ok';
#        echo "File copied from remote!";
    } else {
        $errors = error_get_last();
    }
}

/*
  echo $path_parts['dirname'], "\n";
  echo $path_parts['basename'], "\n";
  echo $path_parts['extension'], "\n";
  echo $path_parts['filename'], "\n"; // since PHP 5.2.0
 */

array_push($_SESSION['filenames'], $fileName);
$arr = array('status' => $status, 'filename' => $fileName, 'errors' => $errors);

echo $_GET['callback'] . '(' . json_encode($arr) . ')';
?>