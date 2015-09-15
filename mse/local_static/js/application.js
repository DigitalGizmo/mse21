// mse2 scripts

$(document).ready(function(){
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
