function initializeCarousel() {
  const $container = $(".imagecontainer");

  const breakpoint = 768; // Adjust the breakpoint as needed

  if ($container.hasClass("slick-initialized")) {
    $container.slick("unslick");
  }

  $container.slick({
    infinite: true,
    arrows: false,
    swipe: true,
    draggable: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: true,
    vertical: window.innerWidth <= breakpoint,
    swipeToSlide: true,
  });
}

$(document).ready(function () {
  // Initialize the carousel on page load
  initializeCarousel();

  $(window).on("resize", function () {
    initializeCarousel();
  });

  $(".imagecontainer").on("wheel", function (event) {
    event.preventDefault();

    let delta;

    const breakpoint = 768;

    let vert;

    if (window.innerWidth <= breakpoint) {
      vert = "deltaY";
    } else {
      vert = "deltaX";
    }

    if (event.originalEvent[vert] !== undefined) {
      delta = event.originalEvent[vert];
    } else if (event.originalEvent.wheelDelta !== undefined) {
      delta = -event.originalEvent.wheelDelta;
    } else if (event.originalEvent.detail !== undefined) {
      delta = -event.originalEvent.detail;
    } else {
      delta = 0;
    }

    const slidesToScroll = 1;

    if (delta > 0) {
      $(".imagecontainer").slick("slickNext", slidesToScroll);
    } else {
      $(".imagecontainer").slick("slickPrev", slidesToScroll);
    }
  });
});
