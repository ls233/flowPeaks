<?php
session_start();
$array['filenames']=$_SESSION['filenames'];
$array['dirName']= getcwd();
$array['session_id']=session_id();
echo json_encode ($array);
?>
