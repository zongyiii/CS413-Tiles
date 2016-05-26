var GAME_WIDTH = 600;
var GAME_HEIGHT = 600;
var GAME_SCALE = 1;


var gameport = document.getElementById("gameport");
var renderer = new PIXI.autoDetectRenderer(GAME_WIDTH,
                                           GAME_HEIGHT,
                                           {backgroundColor: 0x99D5FF});
                                           
                
gameport.appendChild(renderer.view);
var stage = new PIXI.Container();
//---------main screen-----------------------------------


//--------game screen--------------------------------------

stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;

var player;
var world;


var MOVE_NONE = 0;

// The move function starts or continues movement
function move() {
  if (player.direction == MOVE_NONE) {
    player.moving = false;
    console.log(player.y);
    return;
  }
  player.moving = true;
  console.log("move");
  
  if (player.direction == 1) //go left
    createjs.Tween.get(player).to({x: player.x - 32}, 500).call(move);
  
  if (player.direction == 2) //go right
    createjs.Tween.get(player).to({x: player.x + 32}, 500).call(move);

  if (player.direction == 3) //go up
    createjs.Tween.get(player).to({y: player.y - 32}, 500).call(move);
  
  if (player.direction == 4) // go down
    createjs.Tween.get(player).to({y: player.y + 32}, 500).call(move);
}


window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!player) return;
  if (player.moving) return;
  if (e.repeat == true) return;
  
  player.direction = MOVE_NONE;

  if (e.keyCode == 87)
    player.direction = 3;
  if (e.keyCode == 83)
    player.direction = 4;
  if (e.keyCode == 65)
    player.direction = 1;
  if (e.keyCode == 68)
    player.direction = 2;
  //add some naive collision detection
  if (player.x >= 760) 
     player.x = 760;
  else if (player.x <= 9) 
     player.x = 8;
  if (player.y > 760) 
     player.y = 760;
   else if (player.y <= 9) 
     player.y = 8;
    
  
  
  console.log(e.keyCode);
  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map_json', 'map.json')
  .add('map', 'map.png')
  .add('face', 'assets/sillyfaceyellow.png')
  .add("spritesheet.json")
  .load(ready);




function ready() {
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map_json", "map.png");
  stage.addChild(world);

  var frame = [];
  frame.push(PIXI.Texture.fromFrame("rolling1.png"));
  frame.push(PIXI.Texture.fromFrame("rolling2.png"));
  frame.push(PIXI.Texture.fromFrame("rolling3.png"));
  frame.push(PIXI.Texture.fromFrame("rolling4.png"));
  
  
  
  
  player = new PIXI.extras.MovieClip(frame);
  player.play();
  player.animationSpeed = 0.1;
  player.position.x = 0;
  player.position.y = 144;
 
  world.addChild(player);
  player.direction = MOVE_NONE;
  player.moving = false;
  animate();
}


function changeView(view){
    for(var i = 0; i<stage.children.length; i++){
        stage.children[i].visible = false;
        stage.children[i].interactive = false;
    }
    view.visible = true;
    view.interative = true;
}


function animate() {
  requestAnimationFrame(animate);
  update_camera();
  renderer.render(stage);
}

function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

