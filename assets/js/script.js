// Variable definitions
const background = document.getElementById("renderSurface");
const ctx = background.getContext("2d");
let i = 0;
let redraw;
let finished = true;
let oldColor;
let colorIndex;

// Resize canvas
const resizeCanvas = () => {
  background.width = window.innerWidth;
  background.height = window.innerHeight;
  return;
};

// Pythagoras
const pythagorean = (sideA, sideB) => {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
};

// Easing function
const getEase = (currentProgress, start, distance, steps) => {
  currentProgress /= steps / 2;
  if (currentProgress < 1) {
    return (distance / 2) * Math.pow(currentProgress, 3) + start;
  }
  currentProgress -= 2;
  return (distance / 2) * (Math.pow(currentProgress, 3) + 2) + start;
};

// Increase circle size
const increaseSize = (x, y, color) => {
  finished = false;

  let ease = getEase(i, 0, pythagorean(window.innerWidth, window.innerHeight), 250);
  if (ease > pythagorean(window.innerWidth, window.innerHeight) / 2) {
    // document.querySelectorAll(".mb").forEach((item) => {
    //   item.style.color = color[0];
    // });
  }
  ctx.beginPath();
  ctx.arc(x, y, ease, 0 * Math.PI, 2 * Math.PI);
  ctx.fillStyle = color[0];
  ctx.fill();
  i += 1;
  if (ease > pythagorean(window.innerWidth, window.innerHeight)) {
    oldColor = color[1];
    setRandomColor(color[0]);
    clearInterval(redraw);
    finished = true;
  }
};
//Color picker function
const colorPicker = (num) => {
  switch (num) {
    case 0:
      return ["#29274C", 0]; //Space Cadet
    case 1:
      return ["#F25F5C", 1]; //Fire Opal
    case 2:
      return ["#F6AE2D", 2]; //Honey Yellow
    case 3:
      return ["#247BA0", 3]; //Celadon Blue
    case 4:
      return ["#70C1B3", 4]; //Green Sheen
    default:
      return ["#50514F", 5]; //Davys Gret
  }
};

const getCursorPosition = (canvas, event) => {
  if (!finished) return;
  //Get cursor position
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  i = 0;
  //Color picker code
  array = [0, 1, 2, 3, 4];
  if (!isNaN(oldColor)) {
    array.splice(oldColor, 1);
    colorIndex = array[Math.floor(Math.random() * array.length)];
  } else {
    colorIndex = array[Math.floor(Math.random() * array.length)];
  }
  const color = colorPicker(colorIndex);
  // Set interval
  redraw = setInterval(() => {
    window.requestAnimationFrame(() => {
      increaseSize(x, y, color);
    });
  }, 2);
};

const setRandomColor = (randomColor) => {
  document.querySelector("body").style.backgroundColor = randomColor;
  // document.querySelectorAll(".mb").forEach((item) => {
  //   item.style.color = randomColor;
  // });
  document.querySelector('meta[name="theme-color"]').setAttribute("content", randomColor);
};

const changeAnimations = () => {
  if (window.innerWidth <= 768) {
    document.getElementById("connections").classList.add("animate__fadeInUp");
  } else {
    document.getElementById("connections").classList.add("animate__fadeInBottomRight");
  }
};

//Event listeners
window.addEventListener("resize", (e) => {
  resizeCanvas();
});
background.addEventListener("mousedown", (e) => {
  getCursorPosition(background, e);
});

document.querySelectorAll("a").forEach((item) =>
  item.addEventListener("mousedown", (e) => {
    getCursorPosition(background, e);
  }),
);
//Initial functions
resizeCanvas();
changeAnimations();
setRandomColor(colorPicker(Math.floor(Math.random() * 5))[0]);

//Carousel
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
  drag: false,
}).mount();
