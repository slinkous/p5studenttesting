var rainbowColors;

function setup(){
  createCanvas(500, 500);
  background(200, 225, 255);
  noStroke();
  rainbowColors = [
    color(255, 0, 0),
    color(255, 128, 0),
    color(255, 255, 0),
    color(0, 255, 0),
    color(0, 255, 255),
    color(0, 0, 255),
    color(128, 0, 255),
    color(255, 0, 255)
  ]
}

function draw(){
  let c = 0
  let noCols = rainbowColors.length
  while(c < noCols){
      fill(rainbowColors[c])
      ellipse(250, 500, 500 - (400*c/noCols), 500 - (400*c/noCols))
      c++
  }
