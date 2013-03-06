/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    //show_site_under_construction();
//    rejectBrowsers();
    showLoadDataGI();
//    $("#tabs").tabs();
    //$("#tabs").tabs( "select" , 2 );
    remove_header_if_on_frame();
//    bindToolTips();
    //$('body').data('remoteBaseURL','clip.med.yale.edu/mistyMountain/');
});

function bindToolTips(){
    
    $(".tTip").click(function() {
        var width = 230;
        var height = 130;
        var posX = $(this).offset().left - $(document).scrollLeft() - width + $(this).outerWidth();
        var posY = $(this).offset().top - $(document).scrollTop() + $(this).outerHeight();
        var prop = $(this).attr('for');
        var html = helpObj[prop];        
        $("<div>").html(html).dialog({
            width:width, 
            height:height ,
            position:[posX, posY]
        })
        //.siblings('.ui-dialog-titlebar').remove()
        .mouseover(function() {
            }).mouseout(function(){
        });
    });
    $(".tTip").mouseover(function() {
        $(this).css("cursor", "pointer"); 
    });
}

function rejectBrowsers(){
    $.reject({
        reject: {
            msie: true, // Microsoft Internet Explorer
            opera: true, // Opera
            konqueror: true, // Konqueror (Linux)
            unknown: true // Everything else
        },
        imagePath: './images/browsers/', // Path where images are located
        display: ['firefox','chrome','safari'], // What browsers to display and their order
        header: 'Sorry, it looks like you\'re using a browser that isn\'t currently supported', // Header of pop-up window
        paragraph1: 'For best experience we suggest that you use one of these browsers:', // Paragraph 1
        closeMessage: 'if you want to continue', // Message displayed below closing link
        closeLink: 'Go ahead' // Text for closing link
    }); // Customized Browsers
}

function show_site_under_construction(){
    window.location='site_under_construction/';
}

function remove_header_if_on_frame(){
    if (window.location != window.parent.location) {
        $('#my_header').hide();
        $('body').css('margin',0)
    }
}

function showWebServiceInfo(){
    $("#center_page").html("Please contact German Nudelman at german.nudelman at mssm.edu for reporting problems and further examples").css('margin-left', '300px');
}
function showFAQ(){
    $("#center_page").html("comming soon").css('margin-left', '300px');
}


function show_disclaimer(){
    alert("This alpha version of the flowPeaks web application doesn't support simultaneous dataset analysis yet.");
}

function toggleUploadSource(){
    
    if( $('#fileInput2').is(":visible") ) {
        $('#load_data').data('dataSource','widget')
    }
    
    switch ($('#load_data').data('dataSource'))
    {
        case 'local':
            //console.log('loading from local');            
            $('#fileInput2').fileUploadStart();
            break;
        case 'widget':
            //console.log('loading from widget');
            uploadRemoteFile();
            break;
        case 'sample':
            //console.log('loading from sample');            
            beforeOnFinishUploading();
            break;

        default:
            //console.log('loading from sample by default');                        
            //loadSampleData();
            $('#sampleData').click();
            beforeOnFinishUploading();            
    }    
}

function uploadRemoteFile(){
    var url = 'uploadRemoteFile.php?callback=?';
    $.getJSON(url, { 
        'remoteFile': $('#fileInput2').val()
    }, beforeOnFinishUploading);
    
}
function beforeOnFinishUploading(){
    $.getJSON('getServerInfo.php', onFinishUploading);
}


function loadSampleData(e){
    e.preventDefault();            
    $.getJSON('setDefaultServerInfo.php', function(data){
        if(data.status=='ok'){
            //console.log('default session was set');
            $('#load_data').data('dataSource','sample')
            var path = data.baseURL + '/' + data.session_id + '/' + data.filenames ;
            var a = $('<a></a>').attr({
                'href':path,
                'target':'_blank'
            }).text("   sample file");
            $('<img>').attr('src','js/uploadify/cancel.png').prependTo(a)
            .bind('click',function(e){
                e.preventDefault();
                $(this).unbind('click');
                $('.cancelS').remove();
            });
                
            if($('.cancelS').length>0){
                $('.cancelS').html(a);
            }
            else{
                $('<div class="cancelS"></div>').html(a).insertAfter('#sampleData')                    
            }
        }
    });
}

function showLoadDataGI(){
    $("<div id='load_data_container' class='load_data_container'>" ).appendTo('#center_page');
    $("<div id='' class='panelHeader ConfigurationPanel humanity ui-widget-header ui-corner-top'><span class='panelTitle'>Configuration Panel</span></div>" ).appendTo('#load_data_container');                
    var div = $("<div id='load_data' class='ConfPanel-content ui-widget-content ui-corner-bottom'>" ).html('').appendTo('#load_data_container');
    var fset = $("<fieldset class='fieldSet'/>" ).appendTo(div);
    $('<legend>Select data source <label for="loadDataFrom" class="tTip"> <span>[?]</span></label> </legend>').appendTo(fset);    
    div = $("<div id='loadDataFrom'></div>" ).appendTo(fset);
    $("<input type='file' id='fileInput2' name='fileInput2' />" ).appendTo(div);
    //$("<span> Or </span>" ).appendTo(div);    
    $("<button id='sampleData' class='sampleData'>Sample file</button>" ).appendTo(div);

    $('#sampleData')
    .bind('click',loadSampleData)
    .button({
        icons: {
            primary: "ui-icon-disk"
        }
    });

    var i = $("<button>Upload selected data</button>")
    .bind('click',function(e){
        toggleUploadSource();
    })
    .button({
        icons: {
            primary: "ui-icon-arrowthick-1-n",
            secondary: "ui-icon-arrowthick-1-n"
        }
    });
    $("<div id='UploadFilesBtnDiv'>" ).append(i).appendTo('#load_data');

    div = $("<div id='error' name='error'></div>" );
    $('#load_data').append(div);

    // to make the dm link be a brn
    var div = $(".dmlink")
    div.text('')
    $("<button id='LoadFromPRiMEDB' class='dmBtn'>PRiME DB</button>" )
        .button({
            icons: {
                primary: "ui-icon-disk"
            }
        })
    .appendTo(div);

    $.getJSON('getServerInfo.php', initUploadify)    
}

function initUploadify(serverInfo){
    $('body').data('serverInfo',serverInfo);
    var sID = serverInfo.session_id;
    $('#fileInput2').fileUpload({
        'uploader': 'js/uploadify/uploader.swf',
        'script': 'js/uploadify/upload.php',
        'displayData': 'percentage',
        'sizeLimit': '80000000',
        'cancelImg': 'js/uploadify/cancel.png',
        'buttonText': 'Local computer',
        //        'multi': 'true',
        //                    'fileDesc': 'xls files only',
        //                    'fileExt': '*.xls;*.txt',

        'scriptData': {
            'sID': sID
        },

        'folder': sID,

        'onAllComplete': function(event, data) {
            $('#UploadFilesBtn').show('slow');
            onFinishUploading();
        },

        'onSelectOnce': function(event, data) {
            $('#load_data').data('dataSource','local');    
        }
    });

//    setTimeout("$('#UploadFilesBtnDiv button').trigger('click')", 3000);
}


function onFinishUploading(){
    //$('#load_data').hide('slow');
    var spin = $('<img class="spinner" src="imgs/ajax-loader-spinner.gif" alt="Loading...">');
    $('#load_data').html(spin);
    $.getJSON('getServerInfo.php', function(serverInfo){
        $('body').data('serverInfo',serverInfo);
        validateInputFile();
    });
}

function buildSettingsUI(data){
    //console.log(data)
    $('#load_data').hide('slow');
    
    if ($("#settings").length > 0){ //adding files
        $("#settings").html('');
    }
    else{//first time uploading files
        div = $("<div id='settings' class='ConfPanel-content ui-widget-content ui-corner-bottom'>" ).html('').appendTo($('#load_data_container'));
    }

    var form = $("<form id='form'>" ).appendTo($('#settings'));
    $('#form').data('mode','init');


    var initFlowPeaksF = function(e){
        e.preventDefault();            
        $(this).button("disable");
        $(this).hide();
        $(this).find('.ui-button-text').text('Apply new settings');
        $(this).unbind('click').bind('click',function(e){
            e.preventDefault();            
            $(this).button("disable");
            $(this).hide();                
            var parent = $(this).parent();
            $('<img class="spinner" src="imgs/ajax-loader-spinner.gif" alt="Loading...">').css({}).appendTo(parent);
            $('#plotSettings').remove();
            prepareCallMM('refine');
        });
        var parent = $(this).parent();
        $('<img class="spinner" src="imgs/ajax-loader-spinner.gif" alt="Loading...">').css({}).appendTo(parent);
        $('#plotSettings').remove();
        prepareCallMM('init');
    }
 
    var fset = $("<fieldset id='flowPeaksSettings' class='fieldSet'/>" ).appendTo('#form');
    $('<legend>flowPeaks settings</legend>').appendTo(fset);           
    var div = $("<div class='selChanelsDiv'>" ).appendTo(fset);
    //$("<label>" ).attr('for','sel0').html('Select chanels for analysis:').appendTo(div);
    $("<select id='sel0' multiple='multiple' name='fields'>" ).appendTo(div);
    var options = '';
    //var selMinFileNumOptions = '';
    var j = data.ret.output.colnames;
    var size=0;
    $.each(j,function(i,item) {
        options += '<option selected="selected" value='+(i+1)+'>'+item+'</option>';
        size++;
    //        selMinFileNumOptions += '<option value="">'+i+'</option>';
    });
    $("#sel0").html(options);
    $("#sel0").multiselect({        
        uncheckAllText: "None",
        checkAllText: "All",
        minWidth: 170 ,
        header: 'two channels at least',
        selectedList:"true",
        selectedText: "Select chanels"
    }).bind("multiselectclick", function(event, ui){
        //        updatePlotOptions();
        console.log('click was bound multiselect');
        $('#plot').remove();
        var initFlowPeaksF = $('#runBtn').data('initFlowPeaksF');
        $('#runBtn').button("enable");
        $('#runBtn').unbind('click').bind('click',initFlowPeaksF)
        $('#runBtn .ui-button-text').text('Run flowPeaks');

    /*
	event: the original event object
 
	ui.value: value of the checkbox
	ui.text: text of the checkbox
	ui.checked: whether or not the input was checked
        or unchecked (boolean)
	*/
    })
    .bind("multiselectbeforeclose", function(event, ui){
        if($("#sel0").val().length < 2){
            alert("Select at least two chanels")
            return false;
        }
    });
    $('.selChanelsDiv').data('headers',data.ret.output.colnames);
  
    var triggerWrap = $("<div class='triggerWrap'>" ).appendTo(fset);
    $('<button class="trigger1">Adjust setting</button>')
    .appendTo(triggerWrap)
    .click(function(e){
        e.preventDefault();            
        $(".sliders").slideToggle("slow");
    })
    .button({
        icons: {
            primary: "ui-icon-wrench",
            secondary: "ui-icon-triangle-1-s"
        }
    });

    $(".sliders" ).appendTo(fset);    
   
    $("#h0Slider").slider({
        value:1,
        min: 1,
        max: 10,
        step: 1,
        slide: function(event, ui) {
            $("#h0").val(ui.value);
        },
        change: function(event, ui) { 
            $('#runBtn').button("enable");
        }
    });
    $("#h0").val($("#h0Slider").slider("value"));    
    
    $("#tolSlider").slider({
        value:0.1,
        min: 0.1,
        max: 1,
        step: 0.1,
        slide: function(event, ui) {
            $("#tol").val(ui.value);
        },
        change: function(event, ui) { 
            $('#runBtn').button("enable");
        }
    });
    
    $("#tol").val($("#tolSlider").slider("value"));


    $("#hSlider").slider({
        value:1.5,
        min: 1.5,
        max: 10,
        step: 0.5,
        slide: function(event, ui) {
            $("#h").val(ui.value);
        },
        change: function(event, ui) { 
            $('#runBtn').button("enable");
        }
    });
    $("#h").val($("#hSlider").slider("value"));

    var selectedArray = new Array;
    $('#sel0 :selected').each(function(i, selected){
        selectedArray.push(i);
    });

    selectedArray = data.ret.output.colnames;

    var btn = $("<button>Run flowPeaks</button>" )
        .data('initFlowPeaksF',initFlowPeaksF)
        .button({
            icons: {
                primary: "ui-icon-play",
                secondary: "ui-icon-notice"
            }
        })
        .attr('id','runBtn')
        .bind('click',initFlowPeaksF)
    $("<div class='runBtnDiv'>" ).html(btn).appendTo($('#form'));


    var s = $("<span class='dataSourceSpan'>" ).html('Data source: [' + $('#load_data').data('dataSource') + ']')
    var div = $("<div class='dataSource'>" ).append(s).appendTo('#form');    
}

function validateInputFile(){
    var serverInfo = $('body').data('serverInfo');
    var args = {
        input:{
            mode: "checkall",
            data:{
                filename: serverInfo.filenames[0],
                filedir: serverInfo.session_id         
            },
            output:{
                dir: serverInfo.session_id
            }
        }
    };
    var argsString = $.toJSON(args);
    $.getJSON('run_data_util.php', { 
        'jsonString': argsString,
        'noCashe':Date()
    }, on_validateInputFile);



    $('<img class="spinner" src="imgs/ajax-loader-spinner.gif" alt="Loading...">').css({}).appendTo('#setting');
    $('#mainPanel').html('<div id="messageDiv">');
    $("<div id='' class='panelHeader message humanity ui-widget-header ui-corner-top'><span class='panelTitle'>Message</span></div>" ).appendTo('#messageDiv');                
    $("<div id='loading' class='panelTitle message ui-widget-content ui-corner-bottom'></div>" ).appendTo('#messageDiv');    
    $('<p>').html('<p>flowPeaks is now validating your data, please wait...</p>').appendTo('#loading');
}

function on_validateInputFile(data){
//    console.log('on_validateInputFile')
  //  console.log(data)
    if(data.status==='ok') { //
        if(data.ret.output.status==='success') { //
            $("#loading").html('<p>Your data was uploaded and validated successfully.</p> <p>Preparing data file....</p>');
            var serverInfo = $('body').data('serverInfo');
            var args = {
                input:{
                    mode: "export",
                    data:{
                        filename: serverInfo.filenames[0],
                        filedir: serverInfo.session_id         
                    },
                    output:{
                        dir: serverInfo.session_id
                    }
                }
            };
            var argsString = $.toJSON(args);
            $.getJSON('run_data_util.php', { 
                'jsonString': argsString,
                'noCashe':Date()
            }, on_prepare_dataFile);

        }
        else if(data.failure) { //Upload failed - show user the reason.
            var elem = "<center><FONT SIZE=4><a >Your file do not meet requirments for the analysis, please check missing values</a></center></FONT>";
            $("#aux").html(elem);
        }
    }
    else{
        var elem = "<center><FONT SIZE=4>System error 101</FONT></center>";
        $("#aux").html(elem);
    }
}

function on_prepare_dataFile(data){
//    console.log('on_prepare_dataFile')
  //  console.log(data)
    if(data.ret.output.status==='success') { //
        $("#loading").html('<p>Your data file was prepared.</p> <p>Extractings chanels info....</p>');
        var serverInfo = $('body').data('serverInfo');
        var args = {
            input:{
                mode: "colnames",
                data:{
                    filename: data.ret.output.info.txtfile,
                    filedir: serverInfo.session_id         
                },
                output:{
                    dir: serverInfo.session_id
                }
            }
        };
        var argsString = $.toJSON(args);
        $.getJSON('run_data_util.php', { 
            'jsonString': argsString,
            'noCashe':Date()
        }, on_obtainHeaders);

    }
    else if(data.failure) { //Upload failed - show user the reason.
        var elem = "<center><FONT SIZE=4><a >Your data file was not prepared, please check your input file</a></center></FONT>";
        $("#aux").html(elem);

    }
}

function on_obtainHeaders(data){
//    console.log('on_obtainHeaders')
    //console.log(data)
    if(data.ret.output.status==='success') { //
        $("#loading").html('<p>Extractings chanels info was successful.</p> <p>Note, you can now use the Configuration panel (on the left) to let flowPeaks know what fluoresent channels need to be clustered.</p>');
        buildSettingsUI(data);

//        setTimeout("$('#runBtn').trigger('click')", 3000);

    }
    else if(data.failure) { //Upload failed - show user the reason.
        var elem = "<center><FONT SIZE=4><a >Your file do not meet requirments for the analysis, please check missing values</a></center></FONT>";
        $("#aux").html(elem);

    }
}

function prepareCallMM(mode){

    if($('#FPresults').length>0){
        $('#FPresults').html('');
        $('#messageDiv').show('slow');
    }
    
    var serverInfo = $('body').data('serverInfo');

    if(mode === 'init'){

        var arr = new Array;
        $("#sel0 option:selected").each(function () {
            arr.push( parseInt($(this).val()) );
        });

         var args = {
            input:{
                mode: "init",
                data:{
                    filename: 'data.txt',
                    filedir: serverInfo.session_id,
                    fields:arr
                },                
                params:{
                    tol: parseFloat($('#tol').val()),
                    h0: parseFloat($('#h0').val()),
                    h: parseFloat($('#h').val())
                },
                refinement:{
                    fpfile:'fpfile.fp'
                },
                output:{
                    dir: serverInfo.session_id
                },
                dims:{
                    x: 1,
                    y: 2
                }                
            }
        };
    }
    else{  //refine
        var args = {
            input:{
                mode: "refine",
                data:{
                    filename: 'fpfile.fp',
                    filedir: serverInfo.session_id,
                },
                output:{
                    dir: serverInfo.session_id
                },
                params:{
                    tol: parseFloat($('#tol').val()),
                    h0: parseFloat($('#h0').val()),
                    h: parseFloat($('#h').val())
                },
                refinement:{
                    fpfile:'fpfile.fp'
                },
                dims:{
                    x: 1,
                    y: 2
                }
            }
        };
    }    
 
    var encoded1 = $.toJSON(args);     
    //console.log(encoded1);
    
    var jsonp_url = "runflow_Peaks.php?callback=?";
    $.getJSON(jsonp_url, {
        jsonString: encoded1,
        rand:Date()
    }, function(data) {                   
        var encoded = $.toJSON(data); 
        //console.log(data);
        on_call_MM(data);
    });        

    var div = $('<p>flowPeaks is now clustering your data, please wait...</p><img id="spinner" src="imgs/ajax-loader-spinner.gif" alt="Loading...">');
    $('#loading').html(div);

}

function on_call_MM(data){
    if(data.status==='ok') { //
        if(data.ret.output.status==='success') { //
        $('#messageDiv').hide('slow');
            makeMMplot(data);
        }
        else { //Upload failed - show user the reason.
            $("#loading").html(data.ret.output.message);
        }
    }
    else{
        var elem = "<center><FONT SIZE=4>System error 101</FONT></center>";
        $("#aux").html(elem);
    }

}

function makeMMplot(data){    
    makePlotUI(data);
    onMakeMMplot(data);
}

function insertTextResults(el, data){
    var txtFileName = data.ret.output.info.txtfile.statistics;
    var filedir= data.ret.output.info.filedir;    
    var txtPath = filedir + '/' + txtFileName;    
    var url = 'dataTXT2HTML.php?callback=?';
    $.getJSON(url, { 
        'filePath': txtPath
    }, function(json){
        if(json.status==='ok'){
            el.html(json.html);
            $('#stats').dataTable({
                "sScrollY": "100px",
                "sScrollX": "100%",                
                "bPaginate": false,
                "bFilter": false,
                'bDestroy' : true                
            });
        }
    });
    
}

function updatePlotOptions(){
    var selMinFileNumOptions='';
    $("#sel0 option:selected").each(function (i,item) {
        selMinFileNumOptions += '<option value="' + (i+1) + '">'+$(this).text()+'</option>';
    });
    $('#selMinFileNum').html(selMinFileNumOptions).val(1);    
    $('#selMinFileNum1').html(selMinFileNumOptions).val(2);        
}

function makePlotUI(data){
    var fset = $("<fieldset id='plotSettings' class='fieldSet'/>" ).appendTo('#form');
    $('<legend>Plot settings</legend>').appendTo(fset);           

//--------------------- heatmap plot control-----------------    
   $('<button class="trigger1">Adjust Heatmap</button>')
    .appendTo(fset)
    .click(function(e){
        e.preventDefault();            
        $("#heatMapSettings").slideToggle("slow");
    })
    .attr('id','editHeatMapSettingsBtn')
    .button({
        icons: {
            primary: "ui-icon-wrench",
            secondary: "ui-icon-triangle-1-s"
        }
    });

    var heatMapSettings = $('<div id="heatMapSettings">' ).appendTo(fset).hide();
  
    var html = $('<div id="heatMapSettingsSelection" class="heatMapSettings">' ).appendTo('#heatMapSettings');
    var slider_html = $('<div class="sliderBox"><label for="K" class="tTip" title="K"># of clusters to display <span>[?]</span>:</label><input type="text" class="editBox" id="K" name="K" disabled="disabled" /><div id="KSlider"></div></div>')
    .appendTo(html);
    $("#KSlider").slider({
            value:50,
            min: 2,
            max: 100,
            step: 1,
            slide: function(event, ui) {
                $("#K").val(ui.value);
            }
        });
        $("#K").val($("#KSlider").slider("value"));    
    
    slider_html = $('<label for="n" class="tTip" title="n">points #<span>[?]</span>:</label><input type="text" class="editBox" id="n" name="n" disabled="disabled" /><div id="nSlider"></div>')
    .appendTo($('#plotSettings .sliderBox'));
    $("#nSlider").slider({
            value:600,
            min: 500,
            max: 4000,
            step: 10,
            slide: function(event, ui) {
                $("#n").val(ui.value);
            }
        });
        $("#n").val($("#nSlider").slider("value"));    


    $("<button>Replot Heatmap</button>" )
        .button({
            icons: {
                primary: "ui-icon-play",
                secondary: "ui-icon-image"
            }
        })
        .attr('id','replotHeatmapBtn')
        .data("data", data)
        .bind('click', function(e) {
            e.preventDefault();
            $(this).hide();
            var parent = $(this).parent();
            $('<img class="spinner" src="imgs/spinner.gif" alt="Loading...">').css({'margin-left':'75px'}).appendTo(parent);
            redrawHeatmap();
            return false;
        })
        .appendTo(html);
        

//--------------------- 2d plot control-----------------    
    $('<button class="trigger1">Add 2D plots</button>')
    .appendTo(fset)
    .click(function(e){
        e.preventDefault();            
        $("#plotControl").slideToggle("slow");
    })
    .attr('id','add2Dplots')
    .button({
        icons: {
            primary: "ui-icon-image",
            secondary: "ui-icon-triangle-1-s"
        }
    });

    $('<div id="plotControl">' ).appendTo(fset).hide();
    var html = $('<div id="dimSelection" class="PlotPanel-content">' ).appendTo('#plotControl');
    $("<span/>" ).html('x-Axis').appendTo(html);
    $("<select id='selMinFileNum' class=\"dropdown\">" ).appendTo(html);    
    $("<span/>" ).html('y-Axis').appendTo(html);
    $("<select id='selMinFileNum1' class=\"dropdown\">" ).appendTo(html);

    updatePlotOptions();
      
    $('.dropdown').change(function(event){
        var selBox = $(event.target);
        var parentDiv = $(selBox).parent();
        var selBoxes = $('.dropdown',parentDiv);
        var selBoxe1 = selBoxes.first();
        var selBoxe2 = selBoxes.last();
        var selBoxe1Val = selBoxe1.val();
        var selBoxe2Val = selBoxe2.val();
        if(selBoxe1Val == selBoxe2Val){
            alert ('selected dimensions must not be equal');
            selBoxe1.val("1");
            selBoxe2.val('2');
        }
    });
    $("<button>Add plot</button>" )
        .button({
            icons: {
                primary: "ui-icon-play",
                secondary: "ui-icon-image"
            }
        })
        .attr('id','addScatterPlotBtn')
        .data("data", data)
        .bind('click', function(e) {
            e.preventDefault();
            $(this).hide();
            var parent = $(this).parent();
            $('<img class="spinner" src="imgs/spinner.gif" alt="Loading...">').css({'margin-left':'75px'}).appendTo(parent);
            addScatterPlot();
            return false;
        })
        .appendTo('#plotControl');

}

function onMakeMMplot(data){
    $('.spinner').remove('');
    $('#runBtn').show('slow');

    //    $('#mainPanel').html('');
    $('#messageDiv').hide('slow');

    if($('#FPresults').length<1){
        $("<div id='FPresults'></div>").appendTo('#mainPanel');    
    }

    $("<div id='' class='panelHeader RresultsPanel humanity ui-widget-header ui-corner-top'><span class='panelTitle'>flowPeacks Clustering Results</span></div>" ).appendTo('#FPresults');                    
    $("<div id='MM_output' class='output-content ui-widget-content ui-corner-bottom'></div>").appendTo('#FPresults');    

    $("<div class=\"output_txt\" ></div>" ).appendTo('#MM_output');

    var fileURL = $('body').data('serverInfo').session_id + '/' + 'stat.txt';
    var a = $("<a>", {
        "href": fileURL,
        'text': 'export',
        'target':'_blank'
    })
    .click(function(){
        //console.log('export request');
    });
    /*
    $("<img>", {
        "src": "imgs/button_export.png",
        "title": "download the results as zip file"
    }).css({
        'float':'right',
        'border':'none'
    }).appendTo(a);


    $('<div id="exportZipped">' ).css({        
        'padding':'2px',
        'float':'right'
    }).append(a).appendTo('#output_txt');
    //}).append(a).appendTo('.panelHeader.RresultsPanel.humanity.ui-widget-header');    
    */
    $("<div id=\"output_txt_title\" >Clustering statistics  <sup> </sup> :</div>" ).appendTo('#output_txt');
    $('sup').html(a);
    $("<div id=\"membership\" ></div>" ).appendTo('.output_txt');
    var div = $("#membership");
    insertTextResults(div, data);
    var imgFileName = data.ret.output.info.pngfile;
    var filedir= data.ret.output.info.filedir;
    var imgPath = filedir + '/' + imgFileName;

    var fileURL = $('body').data('serverInfo').session_id + '/' + 'myzipfile.zip';
    var exportDiv = $('<div class="exportData">exportDiv</div');
    exportDiv.appendTo('.panelHeader.RresultsPanel.humanity.ui-widget-header')   ;
    $("<button>Export all results</button>" )
    .attr({
        'id':'exportData'
    })
    .attr({
            'class':'exportData'
        })    
    .button({
        icons: {
            secondary: "ui-icon-disk"
        }
    })
    .appendTo(exportDiv)
    .click(function(){
        $(this).hide();
        var parent = $(this).parent();
        $('<img class="spinner" src="imgs/ajax-loader-spinner.gif" alt="Loading...">').css({}).appendTo(parent);

        var serverInfo = $('body').data('serverInfo');
        var argsString = $.toJSON(serverInfo);
        var url = 'exportAllresults.php?callback=?';
        $.getJSON(url, { jsonString: argsString }, function(data){
            $('#exportData').show('slow');
            $('.spinner').remove('');
            window.open(data.fileURL);
        });    
    });    


    $("<div class=\"output_graph\" ></div>" ).appendTo('#MM_output');

    dyna_tabs.init('plotTabs');
    /*
    $('#plotTabs a.remove').live('click', function() {
        // Get the tab name
        var tabid = $(this).parent().find(".tab").attr("id");
        // remove tab and related content
        var contentname = tabid + "_content";
        $("#" + contentname).remove();
        $(this).parent().remove();
    });
    */
    var tab_counter = 1;

    var html = $('<div">' );
    var imgHtml = '<img src="'+imgPath+'" img/>';
    html.append(imgHtml);

    dyna_tabs.add(
        'Tab' + dyna_tabs.tab_counter,
        //            "plot"+dyna_tabs.tab_counter+"  <a href='#' style='color:red' class='remove'>x</a>",
        "heatmap: " + "K=" + parseFloat($('#K').val()) + ", n=" + parseFloat($('#n').val()),
        html
        );

    dyna_tabs.tab_counter += 1;
}

function addScatterPlot(){
  
    var serverInfo = $('body').data('serverInfo');
    var arr = new Array;
    $("#sel0 option:selected").each(function () {
        arr.push( parseInt($(this).val()) );
    });

    var args = {
        input:{
            //mode: "plot",
            mode: "plot-scatter",            
            data:{
                filename: 'fpfile.fp',
                filedir: serverInfo.session_id,
                fields:arr                
            },
            output:{
                dir: serverInfo.session_id
            },
            dims:{
                x: parseInt( $('#selMinFileNum').val() ),
                y: parseInt( $('#selMinFileNum1').val() )
            }
        }
    };
   
    var encoded1 = $.toJSON(args);     
    //console.log(encoded1);
    
    var jsonp_url = "runflow_Peaks.php";
    //var jsonp_url = "runflow_Peaks.php?callback=?";    
    $.getJSON(jsonp_url, {
        jsonString: encoded1,
        rand:Date()
    }, function(data) {                   
        var encoded = $.toJSON(data); 
        //console.log(data);
        on_addScatterPlot(data);
    }); 
}


function redrawHeatmap(){
  
    var serverInfo = $('body').data('serverInfo');

    var arr = new Array;
    $("#sel0 option:selected").each(function () {
        arr.push( parseInt($(this).val()) );
    });

    var args = {
        input:{
//            mode: "plot",
            mode: "plot-heatmap",
            data:{
                filename: 'fpfile.fp',
                filedir: serverInfo.session_id,
                fields:arr                
            },
            output:{
                dir: serverInfo.session_id
            },
            params:{
                K: parseFloat($('#K').val()),
                n: parseFloat($('#n').val())
            }            
        }
    };
   
    var encoded1 = $.toJSON(args);     
    //console.log(encoded1);
    
    var jsonp_url = "runflow_Peaks.php";
    //var jsonp_url = "runflow_Peaks.php?callback=?";
    $.getJSON(jsonp_url, {
        jsonString: encoded1,
        rand:Date()
    }, function(data) {                   
        var encoded = $.toJSON(data); 
        //console.log(data);
        onMakeMMplot1(data);
        //onRedrawHeatmap(data);
    }); 
}

function onRedrawHeatmap(data){
    $('.spinner').remove('');
    $('#replotHeatmapBtn').show('slow');

    var imgFileName = data.ret.output.info.pngfile;
    var filedir= data.ret.output.info.filedir;
    var imgPath = filedir + '/' + imgFileName;

    $('#tab1 img').attr('src',imgPath);    
    $('#tabs').tabs('select',1)
}

function on_addScatterPlot(data){
    $('.spinner').remove('');
    $('#addScatterPlotBtn').show('slow');

    var imgFileName = data.ret.output.info.pngfile;
    var filedir= data.ret.output.info.filedir;
    var imgPath = filedir + '/' + imgFileName;

    var html = $('<div">' );
    var imgHtml = '<img src="'+imgPath+'" img/>';
    html.append(imgHtml);

    dyna_tabs.add(
        'Tab' + dyna_tabs.tab_counter,
        "plot: " + $('#selMinFileNum option:selected').text() + " and " + $('#selMinFileNum1 option:selected').text(),
        html
        );

    dyna_tabs.tab_counter += 1;
}


function onMakeMMplot1(data){
    $('.spinner').remove('');
    $('#replotHeatmapBtn').show('slow');

    var imgFileName = data.ret.output.info.pngfile;
    var filedir= data.ret.output.info.filedir;
    var imgPath = filedir + '/' + imgFileName;

    var html = $('<div">' );
    var imgHtml = '<img src="'+imgPath+'" img/>';
    html.append(imgHtml);

    dyna_tabs.add(
        'Tab' + dyna_tabs.tab_counter,
        "heatmap: " + "K=" + parseFloat($('#K').val()) + ", n=" + parseFloat($('#n').val()),
        html
        );

    dyna_tabs.tab_counter += 1;
}

function makeTabs(tabID){
    var $tabs = $("<div/>", {
        "style": "margin-left:10%;width:100%;margin-top:15px",
        id: tabID
    });
    var $ul = $("<ul/>", {
        }).appendTo($tabs);

    var $li = $('<li><a href="#regularPlots"><span>plot</span></a></li>').appendTo($ul);
    $li = $('<li><a href="#scatterPlots"><span>scatter</span></a></li>').appendTo($ul);

    $("<div/>", {
        id:'regularPlots'
    }).appendTo($tabs);
    $("<div/>", {
        id:'scatterPlots'
    }).appendTo($tabs);
    return $tabs;
}
