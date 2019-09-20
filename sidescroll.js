//---------Variables---------\\

var ground;
var sun;
var player;
var villager;
var left, right, interact, up, down, shoot;
var gravity;
var scene;
var sign;
var fairyImg;
var forestImg;
var spaceImg;

var message;
var messageStarted;
var messageFinished;
var counter;
var missionReceived;

var apples;
var applesCollected;
var applesTotal;


//-------Main Functions-------\\

var setup = function(){

  fairyImg = loadImage("fairy.png");
  forestImg = loadImage("magicalforest.png");
  spaceImg = loadImage("space.jpg");

  ground = 350;

  sun = {
    x: 400,
    y: 100,
    size: 100
  };
  player = {
    x: 150,
    y: 250,
    width: 50,
    height: 100,
    yspeed: 0,
    direction: "right"
  };
  villager = {
    x: 150,
    y: 250,
    width: 50,
    height: 100
  };
  sign = {
    x: 325,
    y: 250,
    width: 100,
    height: 50
  };


  applesCollected = 0;
  applesTotal = 20;

  apples = [];
  while(apples.length < applesTotal){
    var r = random(0, 255)
    apples.push({
      x: random(0, 500),
      y: ground - 10,
      width: 20,
      height: 20,
      color: color(r, 255 - r, 0),
      scene: round(random(1, 7)),
      collected: false
    });
  }

  boxes = [];
  while(boxes.length < 20){
    boxes.push({
      x: random(0, 500),
      y: 300,
      width: 50,
      height: 50,
      scene: round(random(1, 7)),

    })
  }

  right = false;
  left = false;
  interact = false;
  up = false;
  down = false;
  shoot = false;

  scene = 1;

  message = [
    "Greetings, traveler.",
    "Thank goodness you've come!",
    "I was just heading to the market",
    "to sell the delicious apples",
    "that I grow in my magical orchard.",
    "But something terrible happened!",
    "All my apples. . . ESCAPED!",
    "They must be terribly lost",
    "And confused without me!",
    "Please, traveler. . .",
    "Please help me find them!"
    ];
  messageStarted = false;
  messageFinished = false;
  counter = 0;
  missionReceived = false;

};

var draw = function(){
  drawScene();
  sunset();
  drawPlayer();
  movePlayer();
  if(missionReceived){
    showMission("Find the missing apples");
    drawApples();
    collectApples();
  }
  shootApples();
  //console.log(shoot)
};

//------Helper Functions------\\

// Purpose: Draw the background scene
var drawScene = function(){

  if(scene === 1){
     //blue sky
    background(100, 200, 255);

    //sun
    fill(255, 200, 0);
    ellipse(sun.x, sun.y, sun.size, sun.size);

    //ground
    fill(0, 200, 0);
    rect(0, ground, 500, 500 - ground);
  } else if(scene === 2){
    //blue sky
    background(100, 200, 255);

    //mountains
    fill(0, 175, 0);
    triangle(0, 500, 400, 500, 200, 200);
    triangle(100, 500, 300, 150, 500, 500);

    //ground
    fill(0, 200, 0);
    rect(0, ground, 500, 500 - ground);
  }else if (scene === 3){
    //blue sky
    background(150, 255, 255);

    stroke(0);
    //cactus
    fill(0, 266, 0);
    ellipse(100, ground-50, 50, 250);
    line(100, ground-165, 100, ground);
    line(90, ground-150, 90, ground);
    line(110, ground-150, 110, ground);
    fill(255, 50, 0);
    ellipse(80, ground-150, 20, 20);

    //sign
    drawSign();
    //noStroke();

    //ground
    fill(255, 255, 50);
    rect(0, ground, 500, 500 - ground);
  }else if(scene === 4){
    //blue sky
    background(100, 200, 255);

    //castle
    fill(175, 175, 175);
    rect(100, 125, 300, 400);
    rect(100, 75, 50, 50);
    rect(185, 75, 50, 50);
    rect(265, 75, 50, 50);
    rect(350, 75, 50, 50);
    rect(100, 75, 50, 50);

    //door
    fill(150, 75, 0);
    rect(200, 200, 100, 200, 100);
    line(250, 200, 250, 400);
    fill(75, 75, 75);
    ellipse(225, 300, 20, 20);
    ellipse(275, 300, 20, 20);
    fill(150, 75, 0);
    ellipse(225, 300, 10, 10);
    ellipse(275, 300, 10, 10);

    //NPC
    drawVillager();

    //ground
    fill(0, 200, 0);
    rect(0, ground, 500, 500 - ground);
  }else if(scene === 5){
    background(255) ;
  }else if(scene === 6){

    image(forestImg, 0, 0, 500, 500);
  }else if(scene === 7){
    for(var i = 0; i < 500; i++){
      stroke(0, 0, 255 - i/2);
      line(0, i, 500, i)
    }
  }else {
    background(0, 0, 0);
    image(spaceImg, 0, 0, 1000, 500);
    textSize(36);
    fill(255, 255, 255);
    text("You fell out of the world", 50, 200);
  }

};

// Purpose: Make the sun set
var sunset = function(){
  sun.y += 1;
  sun.x -= 0.25;
  sun.size += 0.1;
};

//Purpose: Draw the Player
var drawPlayer = function(){

  fill(255, 0, 255);
  rect(player.x, player.y, player.width, player.height);
  //image(fairyImg, player.x, player.y, player.width, player.height);

};

//Purpose: Move the player
var movePlayer = function(){

  if(right){
    player.x += 5;
    //set player's direction to "right"

  }
  if(left){
    player.x -= 5;
    // set player's direction to "left"

  }
  //wrap the player
  if(player.x > 500){
    player.x = 0;
    //increase scene by 1
    scene += 1;
  }
  if(player.x < 0){
    player.x = 500;
    //decrease scene by 1
    scene -= 1;
  }
  if(scene == 3){
    if(playerIsOverlapping(sign)){
      showOption("Check Sign");
      if(interact){
        think("Welcome to \n Codelandia!");
      }
    }
  }
  if(scene == 4){
    if(playerIsOverlapping(villager)){
      showOption("Talk");
      if(interact){
        messageStarted = true;
        interact = false;
      }
    }
    if(messageStarted && !messageFinished){
      playMessage();
    }
  }

  if(up && player.y + player.height >= ground){
    player.yspeed = -10
  }

  player.y += player.yspeed;

  if(player.y + player.height < ground){
    player.yspeed += 0.5;
  } else {
    player.yspeed = 0;
  }

};

//Purpose: Add a sign to the scene
var drawSign = function(){
    //brown color
    fill(150, 75, 0);
    //main sign
    rect(sign.x + sign.width/2 - 10, sign.y, 20, ground - sign.y);
    //sign post
    rect(sign.x, sign.y, sign.width, sign.height);
    //lines on the sign
    line(sign.x + 10, sign.y +10, sign.x + sign.width - 10, sign.y+ 10);
    line(sign.x + 10, sign.y +20, sign.x + sign.width - 10, sign.y+ 20);
    line(sign.x + 10, sign.y +30, sign.x + sign.width - 10, sign.y+ 30);
};

//Purpose: Show what interactions the player can do
var showOption = function(message){
  fill(0);
  textSize(20);
  text(message, 350, 425);
};

//Purpose: Show what information the player has
var think = function(thought){
  //thought bubble
  fill(255, 255, 255);
  ellipse(player.x , player.y - 75, 150, 75);
  //little bubbles
  ellipse(player.x - 40, player.y - 25, 20, 20);
  ellipse(player.x - 20, player.y - 10, 10, 10);
  //words
  fill(0, 0, 0);
  textSize(14);
  text(thought, player.x-50, player.y - 75);
};

//Purpose: Tell if the player is overlapping an object
var playerIsOverlapping = function(object){
  var isOverlapping = false;

  if(player.x  + player.width > object.x && player.x < object.x + object.width){
    isOverlapping = true;
  }

  return isOverlapping;
};

//Purpose: Add a villager to the scene
var drawVillager = function(){
  fill(0, 100, 100);
  rect(villager.x, villager.y, villager.width, villager.height);
};

//Purpose: Show the villager's message
var playMessage = function(){

  // background(0);
  fill(0, 0, 0, 50);
  rect(0, 0, 500, 500)

  fill(255);
  rect(10, 10, 480, 200, 20);

  textSize(24);
  fill(0);
  text(message[counter], 100, 100);

  if(interact){
    counter += 1;
    interact = false;
  }
  if(counter >= message.length){
    messageFinished = true;
    missionReceived = true;
  }
};

//Purpose: Show what the player should be doing
var showMission = function(mission){

  fill(255);
  textSize(24);
  text("Mission: " + mission, 50, 50);
};

//Purpose: Display the apples in the correct scene
var drawApples = function(){
  for(var i = 0; i < apples.length; i++){
   if(scene === apples[i].scene && !apples[i].collected){
      fill(apples[i].color);
      ellipse(apples[i].x, apples[i].y, apples[i].width, apples[i].height);
   }
  }
};

//Purpose: Display the mysterious boxes in their respective scenes
var drawBoxes = function(){
  for(var i = 0; i < boxes.length; i++){
   if(scene === boxes[i].scene){
      fill(128,  64, 0)
      rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
   }
  }
};


//Purpose: Count the number of apples collected
var collectApples = function(){

  fill(255);
  textSize(24);
  text("Apples Collected: " + applesCollected + "/" + applesTotal, 20, 450);

   for(var i = 0; i < apples.length; i++){
    if(playerIsOverlapping(apples[i]) && scene === apples[i].scene && !apples[i].collected){
      think("I found an apple!");

      if(interact){
        apples[i].collected = true;
        applesCollected += 1;
        interact = false;
      }
    }
   }
};

var shootApples = function(){

  fill(255);
  textSize(24);
  text("Apples: " + apples.length, 20, 450);
   var projectile;
  if(shoot){
    shoot = false;
    projectile = apples.pop();
    projectile.x = player.x + 25;
    projectile.y = player.y + 25;

    fill(projectile.color)
    ellipse(projectile.x, projectile.y, projectile.width, projectile.height);
  }

  // if(player.direction == "right"){
  //   projectile.x += 3;
  // }
  // if(player.direction == "left"){
  //   projectile.x -= 3;
  // }

}

//----User Input Functions----\\

var keyPressed = function(){
  if(keyCode === RIGHT){
    right = true;
  }
  if(keyCode === LEFT){
    left = true;
  }
  if(keyCode === ENTER){
    interact = !interact;
  }
  if(keyCode === UP){
    up = true;
  }
  if(keyCode === DOWN){
    down = true;
  }
  if(keyCode === 32){
    shoot = true;
  }
};

var keyReleased = function(){
  if(keyCode === RIGHT){
    right = false;
  }
  if(keyCode === LEFT){
    left = false;
  }
    if(keyCode === UP){
    up = false;
  }
  if(keyCode === DOWN){
    down = false;
  }
  if(keyCode === 32){
    shoot = false;
  }
};
