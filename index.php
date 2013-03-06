<?php
session_start();
$_SESSION['filenames'] = array(); //just to see something is there
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>flowPeaks</title>

        <link rel="shortcut icon" href="./icons/farnell.ico"/>
        <!--        <link type="text/css" href="css/smoothness/jquery-ui-1.8.custom.css" rel="stylesheet" /> -->
        <link type="text/css" href="css/humanity/jquery-ui-1.8.16.custom.css" rel="stylesheet" />        

        <script type="text/javascript" src="js/jquery-1.6.4.min.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>


        <link href="css/styles.css" rel="stylesheet" type="text/css"/>



        <link href="js/multiselect/jquery.multiselect.css" rel="stylesheet" type="text/css"/>        
<!--        <link href="css/jquery.multiselect.css" rel="stylesheet" type="text/css"/>            -->    
        <link href="js/DataTables/media/css/demo_table.css" rel="stylesheet" type="text/css"/>                        
        <script type="text/javascript" language="javascript" src="js/DataTables/media/js/jquery.dataTables.js"></script>

        <script type="text/javascript" src="js/multiselect/src/jquery.multiselect.min.js"></script>
<!--        <script type="text/javascript" src="js/jquery.multiselect.min.js"></script>        -->
        <script type="text/javascript" src="js/jquery.json-1.3.js"></script>
        <script type="text/javascript" src="js/flowPeaks.js"></script>
        <script type="text/javascript" src="js/ui.tabs.closable.js"></script>        
<!--        <script type="text/javascript" src="js/jquery.betterTooltip.js"></script>        -->

        <link rel="stylesheet" href="js/uploadify/css/default.css"/>
        <link rel="stylesheet" href="js/uploadify/css/uploadify.css"/>
        <script type="text/javascript" src="js/uploadify/jquery.uploadify.js"></script>
        <script type="text/javascript" src="js/uploadify/swfobject.js"></script>
        <script type="text/javascript" src="js/jquery.reject.js"></script>

<!--        <script id="widgetscript" src="http://146.203.29.217/widget/widget/js/jsLoader.js" type="text/javascript"></script> -->
        <script id="widgetscript" src="http://tsb.mssm.edu/primeportal/widget/widget/js/jsLoader.js" type="text/javascript"></script> 
        

    </head>

    <body id="mm_body">
        <div id="wrapper">
            <div id="container">
                <!--
                <div id="my_header">
                    <center><table border=0 cellpadding=20>
                            <tr>
                                <td align="right">
                                    <IMG SRC="./imgs/mtSinaiLogo.jpg" ALT="mssm">
                                </td>
                                <td align="center">
                                    <B><font size="5" color="#e2e2e2" face="Arial">Center for Translational Systems Biology</font></B><BR>
                                    <B><font size="4" face="Arial"><a href="http://www.mssm.edu" target="_blank">Mount Sinai School of Medicine</a>, New York, NY</font></B><BR>
                                    <B><font size="5" color="#5b5a5b" face="Arial">flowPeaks - fast unsupervised clustering algorithm </font></B><BR>
                                </td>
                                <td align="right">
                                    <IMG SRC="./imgs/prime.jpg" ALT="prime">
                                </td>
                            </tr>
                        </table></center>
                </div>

-->

<div class="my_header">
  <div class="panelH-1">  
    <a href="?q=home"><img style="header_img" src="http://tsb.mssm.edu/primeportal/files/prime.png"></a> 
  </div>

</div>

                <div id="" class='headerMain humanity ui-widget-header ui-corner-top'>

                    <a class="" href="./index.php">Start over</a>
                </div>


                <div id="content">
                    <div id="content_gradient_no_tabs"></div>
                    <div id="content_center">
                        <div id="center_page">
                            <div id="mainPanel">
                                <div id='' class='panelHeader humanity ui-widget-header ui-corner-top'>
                                    <span class='panelTitle'>Welcome to flowPeaks V1.1 Beta <sup>new</sup></span>
                                    <span class='releaseNote'>Data export and FCS support added</span>
                                </div>
                                <div id='' class='welcomeItem ui-widget-content ui-corner-bottom'>
                                    <p>A fast, unsupervised clustering algorithm suitable for high
                                        dimensional flow cytometry data. flowPeaks uses local peaks of the
                                        multivariate probability density function of channel fluorescent
                                        intensities to cluster the events. The algorithm automatically
                                        identifies non-convex shape clusters and is robust to the presence of
                                        outliers.</p>
                                    <p>Instructions for use:</p>
                                    <ol>
                                    <li>  Use the configuration panel (on the left) to select the your data source for analysis.</li>
                                    <li>   After data is selected, press “upload selected data” button.
                                    <p>Additional information on data format requirements is available from the configuration panel.</li></p>
                                </div>                                
                            </div>
                        </div>
                        <div id="content_bottom"></div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            var dyna_tabs = {

                tabs: null,
                tab_counter: 1,

                init: function (id) {
                    var tabs = $('<div id=tabs></div>').append('<div id="'+ id + '"></div>');
                    $('.output_graph').html(tabs);


                    var list = $('<ul></ul').append('<li><a href="#"></a></li>');
                    tabs.append(list);

                    tabs.tabs();

                    // remove the dummy tab
                    tabs.tabs('remove', 0);
                    tabs.hide();

                    this.tabs = tabs;
                },

                add: function (tab_id, tab_name, tab_content) {
                    if (this.tabs != null) {
                        if (this.tabs.css('display') == 'none') {
                            this.tabs.show();
                        }
                        var data = $('<div id="'+tab_id+'"></div>').append(tab_content);
                        this.tabs.append(data).tabs('add', '#' + tab_id, tab_name);
                        this.tabs.tabs('select', '#' + tab_id);
                        this.tabs.tabs({closable: true})
                    } else {
                        alert('Tabs not initialized!');
                    }
                }

            };

            var dyna_accordion = {

                tabs: null,
                tab_counter: 1,

                init: function (id) {
                    var tabs = $('<div></div>').append('<div id="'+ id + '"></div>');
                    $('.output_graph').html(tabs);


                    var list = $('<ul></ul').append('<li><a href="#"></a></li>');
                    tabs.append(list);

                    tabs.tabs();

                    // remove the dummy tab
                    tabs.tabs('remove', 0);
                    tabs.hide();

                    this.tabs = tabs;
                },

                add: function (tab_id, tab_name, tab_content) {
                    if (this.tabs != null) {
                        if (this.tabs.css('display') == 'none') {
                            this.tabs.show();
                        }
                        var data = $('<div id="'+tab_id+'"></div>').append(tab_content);
                        this.tabs.append(data).tabs('add', '#' + tab_id, tab_name);
                        this.tabs.tabs('select', '#' + tab_id);
                    } else {
                        alert('Tabs not initialized!');
                    }
                }

            };
        </script>

        <div class="sliders" style="display:none">

            <div class="sliderBox">
                <label for="tol" class="tTip" title="tol">peaks merging factor <span>[?]</span>:</label>
                <input type="text" class="editBox" id="tol" name="tol" disabled="disabled" />
                <div id="tolSlider"></div>
            </div>
            <div class="sliderBox">
                <label for="h0" class="tTip">common variance matrix scaling factor <span>[?]</span>:</label>
                <input type="text" class="editBox" id="h0" name="h0" disabled="disabled" />
                <div id="h0Slider"></div>
            </div>
            <div class="sliderBox">
                <label for="h" class="tTip">individual variance matrix scaling factor <span>[?]</span>:</label>
                <input type="text" class="editBox" id="h" name="h" disabled="disabled" />
                <div id="hSlider"></div>
            </div>

        </div><!-- End sliders -->
        <script>
            helpObj=new Object();
            helpObj.tol="Peaks merging tolerance level makes the density function of all modes similar to each other.";
            helpObj.h0="Scaling factor of the common variance matrix makes the density function smoother.";
            helpObj.h="Scaling factor of the individual variance matrix makes neighboring peaks merging easier.";
            helpObj.loadDataFrom="The data file should be an ascii file where each columns represents data for a fluoresent channel.<p>The text format requirement for the data: <ul> <li> All fields are tab ('\t') separated.</li> <li> The first row contains the column names. No duplicate names are allowed. Each column name can not contain more than 20 characters.</il> <li>Rows other then header should contain equal nunber of numeric values. No missing values are allowed</li></p>";            
        </script>
    </body>
</html>

