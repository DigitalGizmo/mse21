// mse2 scripts

$(document).ready(function(){

  // DROPDOWN HOVER
  // dropdown on hover on large screen only
  // rather than test size directly, find whether toggle is visible
  if ( $('.menu-toggle').css('display') == 'none' ) {  // toggle menu hidden - we have full menu
    enableHover();
  } // else - don't need to disable, we haven't enabled yet

  // TOGGLE MENU
  // set click handler for the small screen menu button
  // set once and for all, doesn't matter whether it's visible or not
  $(".menu-toggle a").click(function() {
    $(".main-navigation--items").slideToggle();
  });

  // LOGO RESIZE
  // set initial size of logo to fit header (a.k.a. banner) height
  $('#logo--image-img').css('height', $('#banner').height()); 

}); // end doc ready

// resize logo as long as viewport is larger than mobile
$(window).on('resize', function(){

  // HOVER
  if ( $('.menu-toggle').css('display') == 'none' ) { // we're on full menu
    enableHover();
  } else { // we're now on mini menu
    disableHover();
  }

  // TOGGLE MENU
  // 
  if ( $('.menu-toggle').css('display') == 'none' ) {  // we're on full menu
    $(".main-navigation--items").show();
  } else { // menu-toggle is showing
    $(".main-navigation--items").hide();
  }

  // RESIZE LOGO
  // set win var and resize logo
  var win = $(this); //this = window
  $('#dimensions').text("window width: " + win.width() + 
    "  header height: " + $('#banner').height() );
  if (win.width() >= 690) {  
    $('#logo--image-img').css('height', $('#banner').height());
  } else {
    $('#logo--image-img').css('height', 81); 
  }
});

function enableHover() {
  // first, make sure dropdowns are up -- might have come from expaded mini menu
  // not using hide() because it remembers states and adds styles to mini menu
  $('.dropdown div').css('display', 'none');
  // bind hover event
  $('.dropdown').hover(
    function () {
        $('div', this).stop().slideDown(500);        
    },
    function () {
        $('div', this).stop().slideUp(500);        
    }
  );    
}

function disableHover() {
  // unbind events
  $('.dropdown').unbind('mouseenter mouseleave');
  // make sure the dropdowns are showing
  // not using show() because it remembers states and adds styles to mini menu
  $('.dropdown div').css('display', 'block');
}

