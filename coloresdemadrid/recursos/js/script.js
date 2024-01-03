

//Código para cerrar el desplegable al hacer click en el menú / en responsive

$(function () {
  var navMain = $(".navbar-collapse");

  navMain.on("click", "a", null, function () {
    navMain.collapse("hide");
  });
});

$(function () {
  var navMaint = $(".navbar-collapse");

  navMaint.on("click", ".button", null, function () {
    navMaint.collapse("hide");
  });
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});


// Highlight the top nav as scrolling occurs
//$('body').scrollspy({
  //  target: '.navbar-fixed-top'
//});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse .navbar-nav a').click(function() {
    $('.navbar-toggler:visible').click();
});


