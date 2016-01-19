// mse2 scripts

$(document).ready(function(){

  // ------- NAVIGATION ------
  // DROPDOWN HOVER
  // dropdown on hover on large screen only
  // rather than test size directly, find whether toggle is visible
  if ( $('.menu-toggle').css('display') == 'none' ) {  
    // toggle menu hidden - we have full menu
    enableFullMenu();
  } // else - don't need to disable, we haven't enabled yet

  // TOGGLE MENU
  // set click handler for the small screen menu button
  // set once and for all, doesn't matter whether it's visible or not
  // on tap only show. menu choice will close
  $(".menu-toggle a").on('tap', function() {
    $(".main-navigation--items").slideDown();
  });

  // ENABLE DROPDOWN CLOSE ON MOBILE
  // tap anywhere on main page to close dropdown
  $(".content-wrapper").on('tap', function() {
    $(".dropdown div").slideUp();
  });
  $(".title-area").on('tap', function() {
    $(".dropdown div").slideUp();
  });

  // LOGO and TITLE SIZE
  // set initial size of logo to fit header (a.k.a. banner) height
  // text has to be sized first so that the banner height will be correct for logo sizing
  $(".logo--text").fitText(1.4, { minFontSize: '20px', maxFontSize: '68px' });
  $('#logo--image-img').css('height', $('#banner').height()); 

  // ------- ENABLE LINKS FOR FURTHER READING AND IDEA SLIM POPS ------
  $('.pop-url').click(function(event){
    event.preventDefault();
    // get the page number from href
    var chosen_href = $(event.target).attr('href');
    slimPop(chosen_href, 'pop_connection');
  });

 
  // ------- ARTIFACT AND DOC MENU TYPES ------

  // assign click to menu radio buttons
  $('input[type="radio"]').change(function(event){
    // the Django view and template will take care of checking the chosen button
    $('form[name="menu"]').submit()   
  });

  // ------- LESSON SUBMIT ON CHECKBOX ------

  // assign click to checkboxes
  $('input[type="checkbox"]').change(function(event){
    // alert('radio button clicked value: ' + $(event.target).attr('value'));
    $('form[name="menu"]').submit()   
  });

  // ------- SEARCH ------
  // link to clear search
  $('#clear').click(function(event){
    // clear the value in the search field
    $('input[name="q"]').val('')
    // submit
    $('form[name="menu"]').submit()
    
  });

  // ------- MENU PAGINATION ------

  // Turn page selection into form submit
  // aug and q parameters are in the form and will be submited 
  $('#paging > ul > li.page-nav').click(function(event){
    event.preventDefault();
    // get the page number from href
    var chosen_href = $(event.target).closest('li').children('a').attr('href');
    var href_split = chosen_href.split('=');  
    // page number = href_split[1]  
    // alert('in page nav. page num: ' + href_split[1]); 
    // set the page number in the hidden field
    $('form[name="menu"]').find('[type=hidden][name=page]').val(href_split[1])
    $('form[name="menu"]').submit()
  });


  // ------- COLLECTION ITEM MENUS AND NAV ------

  // Menus: Turn item selection into form submit
  $('#item-menu-params > ul > li').click(function(event){
    event.preventDefault();
    var chosen_url = $(event.target).closest('li').children('a').attr('href');
    //alert('menu link clicked value: ' + 
      //$(event.target).closest('li').children('a').attr('href')); 
    // set the form action to the value of href
    $('form[name="menu"]').attr("action", chosen_url); 
    //$('form[name="menu"]').attr("method", "POST"); 
    $('form[name="menu"]').submit()
  });

  // HORIZONTAL NAV SELECTION: Turn h-nav selection into form submit
  // aug and q parameters are in the form and will be submited to DetailListView
  // $('#horizontal-nav-list > li.h-nav--item').click(function(event){
  // special event binding that stays attached after Ajax call
  // per http://stackoverflow.com/questions/9272438/
    // jquery-click-event-not-firing-on-ajax-loaded-html-elements
  $(document).on("click","#horizontal-nav-list > li.h-nav--item", function(event){ 
    event.preventDefault();
    //alert('nav link clicked value: ' + 
      //$(event.target).closest('li').children('a').attr('href'))
    var chosen_url = $(event.target).closest('li').children('a').attr('href');
    // set the form action to the value of href
    $('form[name="horizontal-nav"]').attr("action", chosen_url); 
    $('form[name="horizontal-nav"]').submit()
  });

  // HORIZONTAL NAV NEXT PREV - AJAX
  // next and previous share the same logic - only the page number changes
  $(document).on("click","#horizontal-nav-list > li.h-nav--arrow", function(event){ // page
    //alert('nav link clicked value: ' + 
      //$(event.target).closest('li').children('a').attr('href'));
    event.preventDefault();
    // get params from href
    var url_params = $(event.target).closest('li').children('a').attr('href');
    // e.g. /artifacts/hnav/cwm_ship/hnav/f/Boston/2
    var href_split = url_params.split('/');    
    //var app_namespace = href_split[1]
    //var short_name = href_split[3]
    //var aug = href_split[4]
    //var q = href_split[5]
    //var page = href_split[6]

    // construct the url
    // e.g. "/" + app_namespace + "/hnav/" + short_name + "/?aug" + aug + 
      //"&q=" + q +"&page=" + page;
    theURL = "/" + href_split[1] + "/hnav/" + href_split[3] + "/?aug=" + href_split[4] + 
    "&q=" + href_split[5] +"&page=" + href_split[6];

    // call ajax for new h-nav markup. 
    getURL(theURL, $('#horizontal-nav-list'));

  });

  // --------------- prevent multiple audios on lecture  ----------------
  // http://stackoverflow.com/questions/19790506/
  //multiple-audio-html-auto-stop-other-when-current-is-playing-with-javascript
  document.addEventListener('play', function(e){
      var audios = document.getElementsByTagName('audio');
      for(var i = 0, len = audios.length; i < len;i++){
          if(audios[i] != e.target){
              audios[i].pause();
          }
      }
  }, true);

  // ------- Docment text show/hide ------
  $("#toggle-transcription").click(function() {
    //alert('toggle-transcription');
    //$("#document-text").hide();
    // $("#document-text").toggleClass('hidden');
    $("#document-text").slideToggle();
    //$(this).text("Show Transcription");
    if ( $(this).text() == "Show Transcription") {
      $(this).text('Hide Transcription') 
    } else {
      $(this).text('Show Transcription') 
    }
  });

  // ------- Docment paging ------
  // set first item selected
  $("#document-paging--list li").filter(":first").addClass('document-paging--selected');

  // handle page clicks
  $("#document-paging--list li a").click(function (event) {
    // alert('document-paging href:' + $(event.target).attr('href'));
    // highlight current selection
    $("#document-paging--list li").removeClass('document-paging--selected');
    $(event.target).parent().addClass('document-paging--selected'); 

    // get params from href
    theURL = $(event.target).attr('href');
    // e.g. /documents/montague_letter/p001/36608
    var href_split = theURL.split('/');    
    var page_suffix = href_split[3]
    var filename = href_split[4]

    // change zoomify image
    var zoomPath = "/static/documents/zooms/" + filename + "_" + 
      page_suffix + "_z";
    // alert('zoom path:' + zoomPath);
    Z.Viewer.setImagePath(zoomPath);

    // call ajax for new page text. use href as-is.
    getURL(theURL, $('#document-text'));

    // handle audio
    var audio = $("#doc_audio");
    // pause audio if present (won't be for doc Records)
    if (typeof audio[0] != 'undefined') {
      audio[0].pause();
      // update source src attribute
      $("#doc_audio_oog").attr("src", "/static/documents/media/" + filename + 
        "_" + page_suffix + ".oog");
      $("#doc_audio_mp3").attr("src", "/static/documents/media/" + filename + 
        "_" + page_suffix + ".mp3");
      audio[0].load();//suspends and restores all audio element
    }

    event.preventDefault();
  })

  // ------- Artifact Views ------

  // set first item selected
  $("#other-views--list li a img").filter(":first").addClass('other-views--selected');

  // handle clicks
  $("#other-views--list li a").click(function (event) {
    // target is actual img
    // handle selection
    $("#other-views--list li a img").removeClass('other-views--selected');
    $(event.target).addClass('other-views--selected'); 

    // get params from href
    // using name instead of href - href would have no valid place to go
    theURL = $(event.target).parent().attr('name'); 
    var href_split = theURL.split('/');    
    // /artifacts/1939_1385/A/
    // href_split[2] = filename, href_split[3] = page_suffix
    // alert('artifact views - filename, suffix:' + href_split[2] + ', ' + href_split[3]);

    // change zoomify image
    var zoomPath = "/static/artifacts/zooms/" + href_split[2] + "_" + href_split[3] + "_z";
    // alert('zoom path:' + zoomPath);
    Z.Viewer.setImagePath(zoomPath);
    event.preventDefault();
  })


}); // end doc ready


// resize logo as long as viewport is larger than mobile
$(window).on('resize', function(){

  // ------- NAVIGATION ------
  // HOVER
  if ( $('.menu-toggle').css('display') == 'none' ) { // we're on full menu
    enableFullMenu();
  } else { // we're now on mini menu
    disableFullMenu();
  }

  // TOGGLE MENU
  // 
  if ( $('.menu-toggle').css('display') == 'none' ) {  // we're on full menu
    $(".main-navigation--items").show();
  } else { // menu-toggle is showing
    // Wait -- any scrolling triggers resize so whole menu goes away.
    // $(".main-navigation--items").hide();
  }

  // RESIZE LOGO
  // set win var and resize logo
  var win = $(this); //this = window
  //$('#dimensions').text("window width: " + win.width() + 
  //  "  header height: " + $('#banner').height() );
  //  for html:   <div id="dimensions"><p>Dimensions will go here.</p></div>
  if (win.width() >= 690) {  
    $('#logo--image-img').css('height', $('#banner').height());
  } else {
    $('#logo--image-img').css('height', 81); 
  }
}); // end on resize

function enableFullMenu() {
  // first, make sure dropdowns are up -- might have come from expanded mini menu
  // not using hide() because it remembers states and adds styles to mini menu
  // but only hide if we're in full-menu mode. On a phone, scrolling the browser
  // bar off screen causes a resize and we'll lose the menu
  if ( $('.menu-toggle').css('display') == 'none' ) {
    $('.dropdown div').css('display', 'none');
  }

  var isMobile = false; //initiate as false
  // device detection
  // from http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
  // on tablet we want full menu, but not hover
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;  

  if (isMobile) {
    // set touch event for mobile dropdown
    // hover uses the whole li, but this needs to use just the a tag
    // otherwise a clickon the submenu (part of the li) just closes it
    $('.dropdown > a').on('tap', function(event) {
      ///alert('mobile: clicked on li > a');
      var dropdownDiv = $(this).closest('li').children('div');
      if ( dropdownDiv.css('display') == 'none' ) {  
        // the dropdown isn't dropped - so drop it
        dropdownDiv.slideDown();
      } else {
        // the dropdown is displayed - close it
        dropdownDiv.slideUp();
      }
    });  
  } else { // desktop
    // bind hover event
    // target the whole li -- otherwise when you roll onto the submenu it will go away
    $('.dropdown').hover(
      function () {
          $('div', this).stop().slideDown(500);        
      },
      function () {
          $('div', this).stop().slideUp(500);   
      }
    );        
  } // end if isMobile

}

function disableFullMenu() {
  // unbind desktop events
  $('.dropdown').unbind('mouseenter mouseleave');
  // unbind touch events
  $('.dropdown').unbind('tap');
  // make sure the dropdowns (submenus) are showing
  // not using show() because it remembers states and adds styles to mini menu
  $('.dropdown div').css('display', 'block');
}

// ----------- AJAX ----------

// jQuery Ajax
function getURL(theURL, contentDiv) {
  contentDiv.load(theURL);
}

// ----- ARTIFACT VIEW for model----
function artifactViewModel(shortName, pageSuffix) {
  var zoomPath = "/model/artifact_static/zooms/" + shortName + "_" + pageSuffix + "_z";
  Z.Viewer.setImagePath(zoomPath);
}


// ----- INTERVIEW ----
function interView(shortName, questionNum) {
  var contentDiv = $('#inter_view_wrapper');
  var theURL = "/scholars/interviews/" + shortName + "/" + questionNum + "/";
  getURL(theURL, contentDiv);
}

// ----------- SLIM POP ----------

/* 
* In MSE 1 slimpop codes was part of popBox
* Splitting so that Further reading and ideas (name of new function) can use href from link
*  optional page_num param added to accommocate large chapter images
*/
function popBox(resourceType, connectionType, shortName, page_num) { 
  // create url
  var theURL = "/" + resourceType + "/" + connectionType + "/" + shortName  + "/";
  // add param only if it is passed in
  if (typeof(page_num) != "undefined" ) { 
      theURL += page_num + "/";
  }
  // determine display class
  var displayClass = "pop_connection";
  if (connectionType=='slim') {
    displayClass = 'pop_collection'; 
  } else if (connectionType=='slideshow' || connectionType=='storylarge' || 
      connectionType=='journal') {
    displayClass = 'pop_collection';
  } 
  slimPop(theURL, displayClass);
}

/* 
*  used by popBox() and..
*/
function slimPop(theURL, displayClass) { 
  // append divs if not present
  if (!$('#lbOverlay').length > 0) { // overlay html doesn't exist
    //create HTML markup for lightbox window
    var lbOverlay = 
    '<div id="lbOverlay" class="hidden"></div>' +
    '<div id="ajax_wrapper" class="hidden"></div>';
    //insert lightbox HTML into page
    $('body').append(lbOverlay);
    // assign close click to overlay
    $('#lbOverlay').click(function(event){
      hideBox();    
    });
  }
  // unhide overlay
  $('#lbOverlay').removeClass().addClass('unhidden');
  // assign contentDiv for further use
  var contentDiv = $('#ajax_wrapper');
  // contentDiv will be unhidden by specific classes 
  contentDiv.removeClass().addClass(displayClass); 
  // call Ajax
  getURL(theURL, contentDiv);
}

/* simple hide called by Close link in box, and by hideOverlay, below.
*/
function hideBox() {
  // test for existence of audioPlayer element 
  //if (document.getElementById("audioPlayer")) { 
  //  document.getElementById("audioPlayer").pause();     
  //}   
    
  var contentDiv = $('#ajax_wrapper');
  // empty content div so it won't briefly show old content on new pop
  contentDiv.html = " ";  
  // hide box.. 
  contentDiv.removeClass().addClass('hidden');
  // ..and darkening overlay
  $('#lbOverlay').removeClass().addClass('hidden');
}

// replace whole slim box rather than just the image and caption
// ajax within ajax created an orphan window
function slideView(shortName, slide_num) { // direction is next or prev
  contentDiv = $('#ajax_wrapper'); // slide_wrapper
  var theURL = "/connections/slideshow/slide/" + shortName + "/" + slide_num + "/";
  getURL(theURL, contentDiv);
}

// for mpmrc, I presume
function attractView(slide_num) { 
  contentDiv = $('.loop'); 
  var theURL = "/connections/attractloop/" + slide_num + "/";
  getURL(theURL, contentDiv);
}

// print slim box
function divPrint(divName) {
  var DocumentContainer = document.getElementById(divName);
  var WindowObject = window.open("", "PrintWindow",
  "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");

  var virtualPage = '<html><head><style media="screen" type="text/css"> body {font-family: "Arial Narrow", Arial, sans-serif; font-size: 1em; line-height: 1.5em; padding: 2em;}  h1, h2, h3, h4 {color:#B23F05;} p.close {display: none;} dt {font-weight: bold; margin-top: 1em; }</style><style media="print" type="text/css"> body {color: black; font-family: "Arial Narrow", Arial, sans-serif; font-size: 1em; line-height: 1.5em; padding: 2em;} p.close {display: none;} dt {font-weight: bold; margin-top: 1em;}</style></head><body>' + DocumentContainer.innerHTML + '</body></html> ';

  WindowObject.document.writeln(virtualPage);  
  WindowObject.document.close();
  WindowObject.focus();
  WindowObject.print();
  WindowObject.close();
}
