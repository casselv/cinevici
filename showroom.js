$(document).ready(function () {
  const $container = $(".imagecontainer");

  $container.slick({
    infinite: true,
    arrows: false,
    swipe: false,
    draggable: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: true,
  });

  $container.on("wheel", function (event) {
    event.preventDefault();

    let delta;

    if (event.originalEvent.deltaX !== undefined) {
      delta = event.originalEvent.deltaX;
    } else if (event.originalEvent.wheelDelta !== undefined) {
      delta = -event.originalEvent.wheelDelta;
    } else if (event.originalEvent.detail !== undefined) {
      delta = -event.originalEvent.detail;
    } else {
      delta = 0;
    }

    const slidesToScroll = 1;

    if (delta > 0) {
      $container.slick("slickNext", slidesToScroll);
    } else {
      $container.slick("slickPrev", slidesToScroll);
    }
  });
});
