const colorPicker = (num) => {
  switch (num) {
    case 0:
      return "#8CA861"; //Asparagus
    case 1:
      return "#E74B58"; //Sizzling Red
    case 2:
      return "#F47E3E"; //Mango Tango
    case 3:
      return "#33658A"; //Queen Blue
    case 4:
      return "#70C1B3"; //Green Sheen
    default:
      return "#50514F"; //Davys Gret
  }
};

const setRandomColor = (randomColor) => {
  document.querySelector("body").style.backgroundColor = randomColor;
  document.querySelector('meta[name="theme-color"]').setAttribute("content", randomColor);
};

const changeAnimations = () => {
  if (window.innerWidth <= 768) {
    document.getElementById("connections").classList.add("animate__fadeInUp");
  } else {
    document.getElementById("connections").classList.add("animate__fadeInBottomRight");
  }
};

//Initial functions
// setRandomColor(colorPicker(Math.floor(Math.random() * 5)));
changeAnimations();
console.log("ok");
