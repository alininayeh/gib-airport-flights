$(document).ready(function() {
  $(window).scroll(function () {
    $('.flightScheduleApp-list-items').each(function() {
      if(this.getBoundingClientRect().top <= 48) {
        $(this).find('.flightScheduleApp-list-items-title').addClass('fixed');
      }
      else {
        $(this).find('.flightScheduleApp-list-items-title').removeClass('fixed');
      }
    });
  });

  $('.flightScheduleApp-menuButton').click(function() {
    if(!$('body').hasClass('menuOpen')) {
      $('body').addClass('menuOpen');
    }
    else {
      $('body').addClass('menuClosing');

      setTimeout(function() {
        $('body').removeClass('menuOpen').removeClass('menuClosing');
      }, 500);
    }
  });

  $('.flightScheduleApp-menu-item').click(function() {
    $('html, body').animate({scrollTop: 0});
    $('body').addClass('menuClosing');

    setTimeout(function() {
      $('body').removeClass('menuOpen').removeClass('menuClosing');
    }, 500);
  });

  $('.flightScheduleApp-menu-item.about').click(function() {
    setTimeout(function() {
      $('.flightScheduleApp-about').fadeIn();
    }, 500);
  });

  $('.flightScheduleApp-about-button').click(function() {
    $('.flightScheduleApp-about').fadeOut(1000); 
  });

  $('.flightScheduleApp-notification-button').click(function() {
    $('.flightScheduleApp-notification').fadeOut(1000); 
  });

  setInterval(function() {
    if($('.flightScheduleApp-list-items-title').length && $('.flightScheduleApp-list-items-title').html().indexOf('{{key}}') != -1) {
      $('.flightScheduleApp-error').show();
    }
  }, 500);

  setTimeout(function() {
    if(!$('.flightScheduleApp-list-items-title').length) {
      $('.flightScheduleApp-error').show();
    }
  }, 5000);
});