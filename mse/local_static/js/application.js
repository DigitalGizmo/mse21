// mse2 scripts

$(document).ready(function(){

  // for determining whether to hover menu items or not
  var isFullMenu = true;

  // dropdown on hover on large screen only
  // on doc ready, find whether toggle is visible
  // isFullMenu will be updated on resize -- not working yet though
  //alert("menu-toggle display is? = " + $('.menu-toggle').css('display'));
  if ( $('.menu-toggle').css('display') == 'none' ) { 
    // the alternative mini menu is not showing
    isFullMenu = true;
  } else {
    // the mini menu is showing, so the full one isn't 
    isFullMenu = false;
  }

  $('.dropdown').hover(
    function () {
      if (isFullMenu) {
        $('div', this).stop().slideDown(500);        
      }
    },
    function () {
      if (isFullMenu) {
        $('div', this).stop().slideUp(500);        
      }
    }
  );    

  $(".menu-toggle a").click(function() {
    $(".main-navigation--items").slideToggle();
  });

});

  // resize logo as long as viewport is larger than mobile
  $('#logo--image-img').css('height', $('#banner').height()); 
  $(window).on('resize', function(){
    // set isFullMenu before proceeding with logo sizing.
    // this isn't working -- new values aren't accessible by the hover funcions.
    if ( $('.menu-toggle').css('display') == 'none' ) { 
      isFullMenu = true;
    } else {
      isFullMenu = false;
    }

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


