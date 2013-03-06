<?php

session_start();
/*
$my_array=array('cat', 'dog', 'mouse', 'bird', 'crocodile', 'wombat', 'koala', 'kangaroo');
$_SESSION['animals']=$my_array;
echo 'Putting array into a session variable';
*/


// Uploadify v1.6.2
// Copyright (C) 2009 by Ronnie Garcia
// Co-developed by Travis Nickels
if (!empty($_FILES)) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $_GET['folder'] . '/';
	$targetFile =  str_replace('//','/',$targetPath) . $_FILES['Filedata']['name'];
	
	// Uncomment the following line if you want to make the directory if it doesn't exist
	 mkdir(str_replace('//','/',$targetPath), 0755, true);
	
	move_uploaded_file($tempFile,$targetFile);
}

$str = $_FILES['Filedata']['name'];
$fp = fopen('upload.xml', 'a+');
//fwrite($fp, $str);fwrite($fp, "\n----\n");
//fclose($fp);

array_push($_SESSION['filenames'],$str);
array_push($_SESSION['animals'],$str);

foreach($_SESSION['filenames'] as $key=>$value)
{
// and print out the values
fwrite($fp, 'The value of $_SESSION['."'".$key."'".'] is '."'".$value."'".' <br />');
//    echo 'The value of $_SESSION['."'".$key."'".'] is '."'".$value."'".' <br />';

}

foreach($_SESSION['animals'] as $key=>$value)
{
// and print out the values
fwrite($fp, 'The value of $_SESSION['."'".$key."'".'] is '."'".$value."'".' <br />');
//    echo 'The value of $_SESSION['."'".$key."'".'] is '."'".$value."'".' <br />';

}


fclose($fp);

echo "1";
?>