// JavaScript code goes here, implementing game logic
// Generic syntax : https://www.w3schools.com/js/js_syntax.asp
// 1, learn how to use window.addEventListener and register keyboard keys being held down
//        https://www.w3schools.com/jsref/met_win_addeventlistener.asp
// 2, find out how to modify image data each render loop to draw moving earthworm(s)
//        https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
//        https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
// 3, create and polish game logic
// -- earthworm angle of movement can be controlled by keyboard
// -- movement speed gradually increase
// -- add multiplayer (second earthworm)
// -- add possibility to configure them (colors)
// 4, presentation layer
// -- main page graphics / layout
// -- sounds or music?
// 5, continue implementing ideas to have greatest possible game

let x = 0, y = 0;
let x2 = 0, y2 = 0;
let width = 6;
let worm_count = 2;
let anglex = [0,0], angley = [width,-width];
let p1r = 0, p1g = 0, p1b = 0, p1button = document.getElementById('p1_0_0_0');
let p2r = 2, p2g = 255, p2b = 36, p2button = document.getElementById('p2_2_255_36');
let alive = [false,false];
let image, ctx;
var fps = 10, fpsInterval, startTime, now, then, elapsed;
var canvas = document.getElementById('canvas_id');
ctx = canvas.getContext("2d");
image = ctx.createImageData(400, 400);

window.addEventListener('keyup', this.keydown, false);

function turn_left(player) {

  if (anglex[player] == -width && angley[player] == 0) {
    // jede doleva, otoc doleva = pojede dolu
    anglex[player] = 0; angley[player] = width;
    return;
  }
  if (anglex[player] == 0 && angley[player] == width) {
    // jede dolu, otoc doleva = pojede doprava
    anglex[player] = width; angley[player] = 0;
    return;
  }
  if (anglex[player] == width && angley[player] == 0) {
    // jede doprava, otoc doleva = pojede nahoru
    anglex[player] = 0; angley[player] = -width;
    return;
  }
  if (anglex[player] == 0 && angley[player] == -width) {
    // jede nahoru, otoc doleva = pojede doleva
    anglex[player] = -width; angley[player] = 0;
    return;
  }
}

function turn_right(player) {
  if (anglex[player] == -width && angley[player] == 0) {
    // jede doleva, otoc doprava = pojede nahoru
    anglex[player] = 0; angley[player] = -width;
    return;
  }
  if (anglex[player] == 0 && angley[player] == -width) {
    // jede nahoru, otoc doprava = pojede doprava
    anglex[player] = width; angley[player] = 0;
    return;
  }
  if (anglex[player] == width && angley[player] == 0) {
    // jede doprava, otoc doprava = pojede dolu
    anglex[player] = 0; angley[player] = width;
    return;
  }
  if (anglex[player] == 0 && angley[player] == width) {
    // jede dolu, otoc doprava = pojede doleva
    anglex[player] = -width; angley[player] = 0;
    return;
  }
}

    //Ovladani pro oba dva hrace pomoci klavesnice
function keydown(key) {
  // console.log('Key up event detected:', key.keyCode);
  // doleva : anglex=-1;angley=0
  // nahoru : anglex=0;angley=-1
  // doprava: anglex=1;angley=0
  // dolu   : anglex=0;angley=1
  var code = key.keyCode;
  switch (code) {
    case 37:
      console.log('keydown - LEFT ARROW');
      turn_left(0);
      break;
    case 39:
      console.log('keydown - RIGHT ARROW');
      turn_right(0);
      break;
    case 65:
      console.log('keydown - A');
      turn_left(1);
      break;
    case 68: 
      console.log ('keydown - D'); 
      turn_right(1);
      break;
  }
}

    function start_game() {
      reset_canvas();
      alive = [true,true];
      fpsInterval = 1000 / fps;
      then = startTime = Date.now();
      draw_playfield();
      //Funkce start game
    }

    function choose_color(player, button) {
      console.log('Player:' + player + 'Button color:' + button.style.backgroundColor);
      //zapsani konzole jakou si hrac vybral barvu a jake je cislo hrace
      let colorArr = button.style.backgroundColor.slice(
        button.style.backgroundColor.indexOf("(") + 1,
        button.style.backgroundColor.indexOf(")"),
      ).split(", ");
      if (player==1) {
        p2_twin_button = document.getElementById('p2_'+p1r+'_'+p1g+'_'+p1b);
        p2_twin_button.style.backgroundColor = "rgb("+p1r+", "+p1g+", "+p1b+")";
        p2_twin_button.disabled = 0;
        p1r = colorArr[0];
        p1g = colorArr[1];
        p1b = colorArr[2];
        button.style.borderColor = "rgb(44, 131, 49)";
        p1button.style.borderColor = "rgb(255, 255, 255)";
        p1button = button;
        p2_twin_button = document.getElementById('p2_'+p1r+'_'+p1g+'_'+p1b);
        p2_twin_button.style.backgroundColor = "rgb(255, 255, 255)";
        p2_twin_button.disabled = 1;
      }
      if (player==2) {
        p1_twin_button = document.getElementById('p1_'+p2r+'_'+p2g+'_'+p2b);
        p1_twin_button.style.backgroundColor = "rgb("+p2r+", "+p2g+", "+p2b+")";
        p1_twin_button.disabled = 0;
        p2r = colorArr[0];
        p2g = colorArr[1];
        p2b = colorArr[2];
        button.style.borderColor = "rgb(44, 131, 49)";
        p2button.style.borderColor = "rgb(255, 255, 255)";
        p2button = button;
        p1_twin_button = document.getElementById('p1_'+p2r+'_'+p2g+'_'+p2b);
        p1_twin_button.style.backgroundColor = "rgb(255, 255, 255)";
        p1_twin_button.disabled = 1;
      }

    }
    function reset_canvas() {
      console.log ('Reset Canvas');
      image.data.fill(255);
      alive = [false,false];
      x = 200;
      y = 200;
      x2 = 150;
      y2 = 150;
      for(i=0; i<400; i=i+1) {
        image.data[400*4*0 + i*4] = 0;
        image.data[400*4*0 + i*4 + 1] = 0;
        image.data[400*4*0 + i*4 + 2] = 0;
        image.data[400*4*0 + i*4 + 3] = 255;
      }
      for(i=0; i<400; i=i+1) {
        image.data[400*4*i + 0*4] = 0;
        image.data[400*4*i + 0*4 + 1] = 0;
        image.data[400*4*i + 0*4 + 2] = 0;
        image.data[400*4*i + 0*4 + 3] = 255;
      }
      for(i=0; i<400; i=i+1) {
        image.data[400*4*399 + i*4] = 0;
        image.data[400*4*399 + i*4 + 1] = 0;
        image.data[400*4*399 + i*4 + 2] = 0;
        image.data[400*4*399 + i*4 + 3] = 255;
      }
      for(i=0; i<400; i=i+1) {
        image.data[400*4*i + 399*4] = 0;
        image.data[400*4*i + 399*4 + 1] = 0;
        image.data[400*4*i + 399*4 + 2] = 0;
        image.data[400*4*i + 399*4 + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    }

    function set_pixel(x,y,r,g,b) {
      image.data[400*4*y + x*4] = r;
      image.data[400*4*y + x*4 + 1] = g;
      image.data[400*4*y + x*4 + 2] = b;
      image.data[400*4*y + x*4 + 3] = 255;
      // colors; full 255= white, full 0= black
    }

    //false pokud bily pixel (a nakresli), jinak true (naraz)
    function test_pixel(x,y,r,g,b) {
      if (
        image.data[400*4*y + x*4] == 255 &&
        image.data[400*4*y + x*4 + 1] == 255 &&
        image.data[400*4*y + x*4 + 2] == 255 &&
        image.data[400*4*y + x*4 + 3] == 255
      ) {
        set_pixel(x,y,r,g,b);
        return false;
      } else {
        return true;
      }
    }

    function game_over(){
      if(alive[0]==false && alive[1]==false ){
      }
    }

function draw_playfield() {
  if(alive[0]==false && alive[1]==false) return;
  // console.log('frame - x is '+x+', array is '+image.data[0]);
  // calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {

    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    x = x + anglex[0];
    y = y + angley[0];
    x2 = x2 + anglex[1];
    y2 = y2 + angley[1];
    //Pohyb obou dvou cervu
    //vykresli ctverec width * width spravne barvy v kazdem kroku simulace
    for (let iy=0; iy<width; iy=iy+1) {
      //vnoreny for cyklus pro kombinovani radku a sloupcu
      for (let ix=0; ix<width; ix=ix+1) {
        //console.log('For:'+ix+' '+iy);
        if(alive[0]) {
          if (test_pixel(x+ix, y+iy, p1r, p1g, p1b)) {
            //console.log("Chcipl Player 1 " + x + ' ' + y);
            // zjisti, jestli ma high score
            alive[0]=false;
            if(alive[1]==false) {
              reset_canvas();
            }
          }
        }
        if(alive[1]) {
          if (test_pixel(x2+ix, y2+iy, p2r, p2g, p2b)) {
            //console.log("Chcipl Player 2 " + x2 + ' ' + y2);
            alive[1]=false;
            if(alive[0]==false) {
              reset_canvas();
            }
          }
        }
      }
    }
    ctx.putImageData(image, 0, 0);
  }

  if (alive[0] || alive[1]) {
    requestAnimationFrame(draw_playfield);
  }
}