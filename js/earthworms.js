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

let x = 0, y = 0, left = false, right = false;
let x2 = 0, y2 = 0, left2 = false, right2 = false;
let anglex = 0, angley = 1;
let anglex2 = 0, angley2 = -1;
let p1r = 0, p1g = 0, p1b = 0, p1button = document.getElementById('p1_0_0_0');
let p2r = 2, p2g = 255, p2b = 36, p2button = document.getElementById('p2_2_255_36');
let alive = false;
let image, ctx;
var fps = 10, fpsInterval, startTime, now, then, elapsed;
var canvas = document.getElementById('canvas_id');
ctx = canvas.getContext("2d");
image = ctx.createImageData(400, 400);

window.addEventListener('keyup', this.keydown, false);

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
      if (anglex == -1 && angley == 0) {
        // jede doleva, otoc doleva = pojede dolu
        anglex = 0; angley = 1;
        return;
      }
      if (anglex == 0 && angley == 1) {
        // jede dolu, otoc doleva = pojede doprava
        anglex = 1; angley = 0;
        return;
      }
      if (anglex == 1 && angley == 0) {
        // jede doprava, otoc doleva = pojede nahoru
        anglex = 0; angley = -1;
        return;
      }
      if (anglex == 0 && angley == -1) {
        // jede nahoru, otoc doleva = pojede doleva
        anglex = -1; angley = 0;
        return;
      }
      break;
    case 39:
      console.log('keydown - RIGHT ARROW');
      if (anglex == -1 && angley == 0) {
        // jede doleva, otoc doprava = pojede nahoru
        anglex = 0; angley = -1;
        return;
      }
      if (anglex == 0 && angley == -1) {
        // jede nahoru, otoc doprava = pojede doprava
        anglex = 1; angley = 0;
        return;
      }
      if (anglex == 1 && angley == 0) {
        // jede doprava, otoc doprava = pojede dolu
        anglex = 0; angley = 1;
        return;
      }
      if (anglex == 0 && angley == 1) {
        // jede dolu, otoc doprava = pojede doleva
        anglex = -1; angley = 0;
        return;
      }
      break;
    case 65:
      console.log('keydown - A');
      if (anglex2 == -1 && angley2 == 0) {
        anglex2 = 0; angley2 = 1;
        return;
      }
      if (anglex2 == 0 && angley2 == 1) {
        anglex2 = 1; angley2 = 0;
        return;
      }
      if (anglex2 == 1 && angley2 == 0) {
        anglex2 = 0; angley2 = -1;
        return;
      }
      if (anglex2 == 0 && angley2 == -1) {
        anglex2 = -1; angley2 = 0;
        return;
      }
      break;
        case 68: 
          console.log ('keydown - D'); 
          if(anglex2==-1 && angley2==0) {
            anglex2=0;angley2=-1;
            return;
          }
          if(anglex2==0 && angley2==-1){
            anglex2=1;angley2=0;
            return;
          }
          if(anglex2==1 && angley2==0){
            anglex2=0;angley2=1;
            return;
          }
          if(anglex2==0 && angley2==1) {
            anglex2=-1;angley2=0;
            return;
          }
          break;
      }
    }

    function start_game() {
      reset_canvas();
      alive = true;
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
      alive = false;
      x = 200;
      y = 200;
      angle = 0;
      x2 = 150;
      y2 = 150;
      angle2 = 0;
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

function draw_playfield() {
  // console.log('frame - x is '+x+', array is '+image.data[0]);
  if (alive) {
    requestAnimationFrame(draw_playfield);
  }
  // calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {

    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    x = x + anglex;
    y = y + angley;
    x2 = x2 + anglex2;
    y2 = y2 + angley2;
    //Pohyb obou dvou cervu

    // doleva : anglex=-1;angley=0
    // nahoru : anglex=0;angley=-1
    // doprava: anglex=1;angley=0
    // dolu   : anglex=0;angley=1

    if (test_pixel(x, y, p1r, p1g, p1b)) {
      console.log("Chcipl Player 1 " + x + ' ' + y);
      reset_canvas();
    } else {
      if (test_pixel(x2, y2, p2r, p2g, p2b)) {
        console.log("Chcipl Player 2 " + x2 + ' ' + y2);
        reset_canvas();
      }
    }
    ctx.putImageData(image, 0, 0);
  }
}