<?php

if (!empty($_GET['filePath'])) {
    $filePath = $_GET["filePath"];

    $filePath = stripslashes($filePath);
//echo $filePath;
//first, get the file...
    $file = file($filePath);
//var_dump($file);
//now count the lines ..
    $lines = count($file);

//start the table here..
    $table .= '<table cellpadding="0" cellspacing="0" border="0" class="display" id="stats">';

//start the loop to get all lines in the table..
    for ($i = 0; $i < $lines; $i++) {
//get each line and exlplode it..
//    $part = preg_split('/\s+/', $file[$i]);
        $part = explode("\t", $file[$i]);
        if ($i == 0) {
            $table .='<thead>';
            $table .='<tr>';
            for ($j = 0; $j < sizeof($part); $j++) {
                $table .= '<td>' . $part[$j] . '</td>';
            }
            $table .= '</tr>';
            $table .='</thead>';
        } else {
            if ($i == 1) {
                $table .='<tbody>';
            }
            $table .='<tr>';
            for ($j = 0; $j < sizeof($part); $j++) {
                $val = round($part[$j], 2); 
                $table .= '<td>' . $val . '</td>';
            }
            $table .= '</tr>';
        }
    }
    $table .='</tbody>';

//close the table so HTML wont suffer :P
    $table .= '</table>';
    $arr = array('status' => 'ok', 'html' => $table);
} else {
    $arr = array('status' => 'failed');
}

$ret = json_encode($arr);
echo isset($_GET['callback']) ? "{$_GET['callback']}($ret)" : $ret;
?>
