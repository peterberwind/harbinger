$(function() {

  // Animate On Scroll
  window.sr = ScrollReveal();
  sr.reveal('.fadein', {
    scale: 1,
    reset: true,
    duration: 1200,
  });

  $('.scroll-action').click(function(event) {
    event.preventDefault();
    var $el = $(this).attr('href');
    $('html, body').animate({
            scrollTop: $($el).offset().top
        }, 1000);
  });
});
// END: Doc on Ready
