<?php

session_start();

require_once('FirePHPCore/FirePHP.class.php');
$firephp = FirePHP::getInstance(true);
//$firephp->log(session_id(), 'session_id');

function create_zip($files = array(), $destination = './', $overwrite = true) {
	$firephp = FirePHP::getInstance(true);
	//$firephp->log($files, '$files');
	//$firephp->log($destination, '$destination');

    //if the zip file already exists and overwrite is false, return false
    if (file_exists($destination) && !$overwrite) {
        return false;
    }
    //vars
    $valid_files = array();
    //if files were passed in...
    if (is_array($files)) {
        //cycle through each file
        foreach ($files as $file) {
            //make sure the file exists
            if (file_exists($file)) {
                $valid_files[] = $file;
            }
        }
    }
    //if we have good files...
    if (count($valid_files)) {
    	//$firephp->log($valid_files, '$valid_files');
        //create the archive
        $zip = new ZipArchive();
        if ($zip->open($destination, $overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
            return false;
        }
        //add the files
        foreach ($valid_files as $file) {
            $zip->addFile($file, $file);
        }

        //debug
        //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;
        //close the zip -- done!
        $zip->close();
		//$firephp->log($zip, '$zip');
        //check to make sure the file exists
        return file_exists($destination);
    } else {
        return false;
    }
}


if (!empty($_GET['jsonString'])) {
    $params1 = $_GET["jsonString"];
}
$params1 = preg_replace('/"/', '\"', $params1);

/* creates a compressed zip file */
$session_id = session_id();
$path = getcwd() . DIRECTORY_SEPARATOR . $session_id;
chdir($path);
$files = scandir('.');
$destination = 'myzipfile.zip';
$status = create_zip($files,$destination, true);

$ret = array('status' => 'failed');
if ($status == false) {
    // Command execution failed
//    echo "Error running R";
    $ret = json_encode( $ret );
} else {
    // Command executed OK.
//    echo "OK!";
    $folder = substr($_SERVER['SCRIPT_NAME'], 0, strrpos($_SERVER['SCRIPT_NAME'], "/") + 1);
    $host = $_SERVER['HTTP_HOST'];
    $fileURL = "http://" . $host . $folder . '/' . session_id() . '/' . $destination;
    $ret ['status'] = 'ok';
    $ret ['fileURL'] = $fileURL;
    $ret = json_encode($ret);    
}

echo isset($_GET['callback']) ? "{$_GET['callback']}($ret)" : $ret;
?>
