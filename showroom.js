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

  let scrollDelta = 0;

  $(".imagecontainer").on("wheel", function (event) {
    event.preventDefault();

    let vert;

    const breakpoint = 768;

    if (window.innerWidth <= breakpoint) {
      vert = "deltaY";
    } else {
      vert = "deltaX";
    }

    if (event.originalEvent[vert] !== undefined) {
      scrollDelta += event.originalEvent[vert];

      // Set a threshold for scrollDelta to control when to move the slide
      const threshold = 100;

      if (scrollDelta >= threshold) {
        $(".imagecontainer").slick("slickNext"); // Move to the next slide
        scrollDelta = 0;
      } else if (scrollDelta <= -threshold) {
        $(".imagecontainer").slick("slickPrev"); // Move to the previous slide
        scrollDelta = 0;
      }
    }
  });
});
