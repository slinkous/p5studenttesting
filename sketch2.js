var rainbowColors;

function setup(){
  createCanvas(500, 500);
  // background(200, 225, 255);
  noStroke();
  loadPixels()
  window.pixels = pixels
  // console.log(window.pixels)
}

function draw(){


  strokeWeight(3);
  stroke(0)
  noFill();
  rect(25, 25, 200, 200)
  triangle(375, 25, 275, 225, 475, 225)
  line(25, 475, 225, 275)
  ellipse(375, 375, 200, 200)
}
