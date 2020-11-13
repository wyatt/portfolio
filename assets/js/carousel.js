const splide = new Splide("#splide", {
  type: "loop",
  autoWidth: true,
  focus: "center",
  autoplay: true,
  pagination: true,
  gap: 20,
  easing: "ease",
  arrows: false,
  interval: 2000,
  lazyLoad: true,
  drag: true,
}).mount();
