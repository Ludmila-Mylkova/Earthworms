// blok deklarace promennych
var x = [0,0], y = [0,0];
var width = 6;
var worm_count = 2;
var anglex = [0,0], angley = [width,-width];
var p_r = [0,2], p_g = [0,255], p_b = [0,36]
var p1button = document.getElementById('p1_0_0_0'), p2button = document.getElementById('p2_2_255_36');
var alive = [false,false];
var image, ctx;
var fps = 10, fpsInterval, startTime, lastspeedtime, now, then, elapsed;
var canvas = document.getElementById('canvas_id');

ctx = canvas.getContext("2d");
image = ctx.createImageData(400, 400);

// listener zavola metodu keyup pro kazdou klavesu, ktera je stisknuta a pustena
window.addEventListener('keyup', this.keyup, false);

start_button = document.getElementById('start_button');

// zatoc cerva doleva dle toho, kterym smerem jede
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

// zatoc cerva doprava dle toho, kterym smerem jede
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
function keyup(key) {
  // doleva : anglex=-1;angley=0
  // nahoru : anglex=0;angley=-1
  // doprava: anglex=1;angley=0
  // dolu   : anglex=0;angley=1
  var code = key.keyCode;
  switch (code) {
    case 37:
      //console.log('keydown - LEFT ARROW');
      turn_left(0);
      break;
    case 39:
      //console.log('keydown - RIGHT ARROW');
      turn_right(0);
      break;
    case 65:
      //console.log('keydown - A');
      turn_left(1);
      break;
    case 68:
      //console.log('keydown - D');
      turn_right(1);
      break;
  }
}

slider = document.getElementById('scale');
slider_label = document.getElementById('scale_label');
//pokazde, kdyz nekdo pohne sliderem, zavola se oninput
slider.oninput = function () {
  //dat pozor na konverzi do cisla - jinak zustane string a v javascriptu zacne zlo
  width = Number(slider.value);
  console.log('Width set to ' + width);
  slider_label.innerHTML = "Worm width: "+width;
  reset_canvas();
}

// zavolano po stisku tlacitka Start
function start_game() {
  reset_canvas();
  alive = [true, true];
  fpsInterval = 1000 / fps;
  then = startTime = lastspeedtime = Date.now();
  for (var i = 1; i <= 5; i = i + 1) {
    document.getElementById('name' + i).style.backgroundColor = "white";
    document.getElementById('score' + i).style.backgroundColor = "white";
  }
  start_button.style.backgroundColor = "orange";
  start_button.innerHTML = "Speed : " + fps;

  draw_playfield();
}

// metoda zmeny barvy cerva - zajistuje take zhasnuti stejne barvy druheho hrace
function choose_color(player, button) {
  //console.log('Player:' + player + 'Button color:' + button.style.backgroundColor);
  //zapsani logu konzole jakou si hrac vybral barvu a jake je cislo hrace
  
  //button.style.backgroundColor hodnota je string "rgb(r, g, b)"
  //nasledujici kod vyzobne ze stringu tri cisla r,g,b a ulozi je do pole
  var colorArray = button.style.backgroundColor.slice(
    button.style.backgroundColor.indexOf("(") + 1,
    button.style.backgroundColor.indexOf(")"),
  ).split(", ");
  if (player == 1) {
    p2_twin_button = document.getElementById('p2_' + p_r[0] + '_' + p_g[0] + '_' + p_b[0]);
    p2_twin_button.style.backgroundColor = "rgb(" + p_r[0] + ", " + p_g[0] + ", " + p_b[0] + ")";
    p2_twin_button.disabled = 0;
    p_r[0] = colorArray[0];
    p_g[0] = colorArray[1];
    p_b[0] = colorArray[2];
    button.style.borderColor = "rgb(44, 131, 49)";
    p1button.style.borderColor = "rgb(255, 255, 255)";
    p1button = button;
    p2_twin_button = document.getElementById('p2_' + p_r[0] + '_' + p_g[0] + '_' + p_b[0]);
    p2_twin_button.style.backgroundColor = "rgb(255, 255, 255)";
    p2_twin_button.disabled = 1;
  }
  if (player == 2) {
    p1_twin_button = document.getElementById('p1_' + p_r[1] + '_' + p_g[1] + '_' + p_b[1]);
    p1_twin_button.style.backgroundColor = "rgb(" + p_r[1] + ", " + p_g[1] + ", " + p_b[1] + ")";
    p1_twin_button.disabled = 0;
    p_r[1] = colorArray[0];
    p_g[1] = colorArray[1];
    p_b[1] = colorArray[2];
    button.style.borderColor = "rgb(44, 131, 49)";
    p2button.style.borderColor = "rgb(255, 255, 255)";
    p2button = button;
    p1_twin_button = document.getElementById('p1_' + p_r[1] + '_' + p_g[1] + '_' + p_b[1]);
    p1_twin_button.style.backgroundColor = "rgb(255, 255, 255)";
    p1_twin_button.disabled = 1;
  }
}

// funkce se zavola pri nacteni scriptu na zacatku existence stranky
function on_load() {
  if (localStorage.getItem('name1') == null) {
    //persistentni ulozeni highscore do browser pameti localStorage globalniho objektu
    //pokud je to prvni spusteni hry na tomto browseru
    for (var j = 1; j <= 5; j = j + 1) {
      localStorage.setItem('name' + j, document.getElementById('name' + j).innerHTML);
      localStorage.setItem('score' + j, document.getElementById('score' + j).innerHTML);
    }
  } else {
    for (var j = 1; j <= 5; j = j + 1) {
      document.getElementById('name' + j).innerHTML = localStorage.getItem('name' + j);
      document.getElementById('score' + j).innerHTML = localStorage.getItem('score' + j);
    }
  }
  reset_canvas();
}

// zavolame pokazde, kdyz potrebujeme cistit canvas ~ konec hry, reset hry
function reset_canvas() {
  console.log('Reset Canvas');
  image.data.fill(255);
  alive = [false, false];
  anglex = [0, 0];
  angley = [width, -width];
  x[0] = 200;
  y[0] = 200;
  x[1] = 150;
  y[1] = 150;
  for (var i = 0; i < 400; i = i + 1) {
    image.data[400 * 4 * 0 + i * 4] = 0;
    image.data[400 * 4 * 0 + i * 4 + 1] = 0;
    image.data[400 * 4 * 0 + i * 4 + 2] = 0;
    image.data[400 * 4 * 0 + i * 4 + 3] = 255;
  }
  for (var i = 0; i < 400; i = i + 1) {
    image.data[400 * 4 * i + 0 * 4] = 0;
    image.data[400 * 4 * i + 0 * 4 + 1] = 0;
    image.data[400 * 4 * i + 0 * 4 + 2] = 0;
    image.data[400 * 4 * i + 0 * 4 + 3] = 255;
  }
  for (var i = 0; i < 400; i = i + 1) {
    image.data[400 * 4 * 399 + i * 4] = 0;
    image.data[400 * 4 * 399 + i * 4 + 1] = 0;
    image.data[400 * 4 * 399 + i * 4 + 2] = 0;
    image.data[400 * 4 * 399 + i * 4 + 3] = 255;
  }
  for (var i = 0; i < 400; i = i + 1) {
    image.data[400 * 4 * i + 399 * 4] = 0;
    image.data[400 * 4 * i + 399 * 4 + 1] = 0;
    image.data[400 * 4 * i + 399 * 4 + 2] = 0;
    image.data[400 * 4 * i + 399 * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);

  start_button.style.backgroundColor = "aquamarine";
  start_button.innerHTML = "Start";
  fps = 10;
} 

// nastavi pixel canvasu se souradnicemi x,y na barvu r,g,b
function set_pixel(x, y, r, g, b) {
  image.data[400 * 4 * y + x * 4] = r;
  image.data[400 * 4 * y + x * 4 + 1] = g;
  image.data[400 * 4 * y + x * 4 + 2] = b;
  image.data[400 * 4 * y + x * 4 + 3] = 255;
  // vsechny 3 255 = bila, vsechny 0 = cerna
}

//false pokud bily pixel (a nakresli), jinak true (naraz)
function test_pixel(x, y, r, g, b) {
  if (
    image.data[400 * 4 * y + x * 4] == 255 &&
    image.data[400 * 4 * y + x * 4 + 1] == 255 &&
    image.data[400 * 4 * y + x * 4 + 2] == 255 &&
    image.data[400 * 4 * y + x * 4 + 3] == 255
  ) {
    set_pixel(x, y, r, g, b);
    return false;
  } else {
    //naraz = cerv umre
    return true;
  }
}

// zjisti, jestli hrac dosahl na high score a pokud ano, updatuj zebricek a localStorage
function test_highscore(player) {
  score = Date.now() - startTime;
  for (var i = 1; i <= 5; i = i + 1) {
    target_score = document.getElementById('score' + i).innerHTML;
    console.log('Score:' + target_score);
    if (score > target_score) {
      //posun vsechny nadchazejici o jedna dolu
      for (var j = 5; j > i; j = j - 1) {
        document.getElementById('score' + j).innerHTML = document.getElementById('score' + (j - 1)).innerHTML;
        document.getElementById('score' + j).style.backgroundColor = document.getElementById('score' + (j - 1)).style.backgroundColor;
        document.getElementById('name' + j).innerHTML = document.getElementById('name' + (j - 1)).innerHTML;
        document.getElementById('name' + j).style.backgroundColor = document.getElementById('name' + (j - 1)).style.backgroundColor
      }
      document.getElementById('score' + i).innerHTML = score;
      document.getElementById('score' + i).style.backgroundColor = "yellow";
      document.getElementById('name' + i).innerHTML = document.getElementById('fname' + player).value;
      document.getElementById('name' + i).style.backgroundColor = "yellow";
      //persistentni ulozeni highscore do browser pameti localStorage globalniho objektu
      for (var j = 1; j <= 5; j = j + 1) {
        localStorage.setItem('name' + j, document.getElementById('name' + j).innerHTML);
        localStorage.setItem('score' + j, document.getElementById('score' + j).innerHTML);
      }

      break;
    }
  }
}

// pomocna funkce - vykresli image game over pres canvas
function game_over() {
  reset_canvas();
  base_image = new Image();
  base_image.src = 'Imgs/IMG_1176.PNG';
  base_image.onload = function () {
    ctx.drawImage(base_image, 5, 5);
  }
}

// vola browser pri behu hry, zde probiha cela logika hry krok za krokem
// snazime se drzet pocet kroku vykresleni ~ nastavenemu FPS = snimky za sekundu
// 1s = 1000ms, 1000ms / fps ~ casu, ktery uplyne mezi jednotlivymi kroky hry
function draw_playfield() {
  //oba cervi mrtvi = neni co dal pocitat
  if(alive[0]==false && alive[1]==false) return;
  // vypocitej cas ktery ubehl
  now = Date.now();
  elapsed = now - then;

  if(now - lastspeedtime > 5000){
    // zvys pocet pohybu za sekundu a tim rychlost jednou za 5s
    lastspeedtime = now;
    fps = fps + 2;
    console.log('interval' + fps);
    start_button.innerHTML = "Speed : " + fps;
  }
  fpsInterval = 1000 / fps;

  //ubehlo dost casu mezi kroky = proved update cervu
  if(elapsed > fpsInterval) {
    // korekce "presvihnuti" casu mezi kroky
    then = now - (elapsed % fpsInterval);
    x[0] = x[0] + anglex[0];
    y[0] = y[0] + angley[0];
    x[1] = x[1] + anglex[1];
    y[1] = y[1] + angley[1];
    //Pohyb obou dvou cervu
    //vykresli ctverec width*width spravne barvy v kazdem kroku simulace
    for(var iy=0; iy<width; iy=iy+1) {
      //vnoreny for cyklus pro kombinovani radku a sloupcu
      for(var ix=0; ix<width; ix=ix+1) {
        if(alive[0]) {
          if (test_pixel(x[0]+ix, y[0]+iy, p_r[0], p_g[0], p_b[0])) {
            //console.log("Chcipl Player 1 " + x[0] + ' ' + y[0] + ' Width:'+width);
            // zjisti, jestli ma high score
            test_highscore(0);
            alive[0]=false;
            if(alive[1]==false) {
              game_over();
            }
          }
        }
        if(alive[1]) {
          if (test_pixel(x[1]+ix, y[1]+iy, p_r[1], p_g[1], p_b[1])) {
            //console.log("Chcipl Player 2 " + x[1] + ' ' + y[1]);
            test_highscore(1);
            alive[1]=false;
            if(alive[0]==false) {
              game_over();
            }
          }
        }
      }
    }
    //teprve nasledujici kod opravdu promitne zmeny do canvasu
    ctx.putImageData(image, 0, 0);
  }

  if (alive[0] || alive[1]) {
    //pokud zije aspon jeden cerv, hrajeme dal - rekneme se i dalsi zavolani
    requestAnimationFrame(draw_playfield);
  }
}