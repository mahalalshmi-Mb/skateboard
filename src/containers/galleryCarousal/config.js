export const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: false,
  swipeToSlide: true,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 950,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },

    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        className: "center",
        centerMode: true,
        centerPadding: "60px",
        arrows: false,
      },
    },
  ],
};
