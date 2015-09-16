// mse2 scripts

$(document).ready(function(){

  // resize logo as long as viewport is larger than mobile
  $('#logo--image-img').css('height', $('#banner').height()); // "$('#banner').height()"  .logo--image
  $(window).on('resize', function(){
    var win = $(this); //this = window
    $('#dimensions').text("window width: " + win.width() + "  header height: " + $('#banner').height() );
    if (win.width() >= 690) {  
      $('#logo--image-img').css('height', $('#banner').height()); // "$('#banner').height()"  .logo--image
    } else {
      $('#logo--image-img').css('height', 81); 
    }
  });


  // dropdown on hover on large screen only

  // find whether toggle is visible
  // and what about on resize?
  
  $('.dropdown').hover(
    function () {
      $('div', this).stop().slideDown(500);
    },
    function () {
      $('div', this).stop().slideUp(500);
    }
  );    

  $(".menu-toggle a").click(function() {
    $(".main-navigation--items").slideToggle();
  });

});
