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

  //let x=0,y=0,angle=0;
  //if ( (int_y == y) && (int_x == x, false) ) {
  //  angle=0;
  //  image.data[400*4*int_y + int_x*4] = p1r;
  //  image.data[400*4*int_y + int_x*4 + 1] = p1g;
  //  image.data[400*4*int_y + int_x*4 + 2] = p1b;
  //  image.data[400*4*int_y + int_x*4 + 3] = 255;
  //}
  //if ((key.keyCode(int_x == x) && (int_y == y, false)) {
  //  angle=90;
  //  image.data[400*4*int_y + int_x*4] = p1r;
  //  image.data[400*4*int_y + int_x*4 + 1] = p1g;
  //  image.data[400*4*int_y + int_x*4 + 2] = p1b;
  //  image.data[400*4*int_y + int_x*4 + 3] = 255;
  // }

    let x=0,y=0,angle=0,angleStep=10*Math.PI/180;
    let x2=0,y2=0,angle2=0,angleStep2=10*Math.PI/180;
    let p1r=0, p1g=0, p1b=0, p1button = document.getElementById('p1_0_0_0');
    let p2r=2, p2g=255, p2b=36, p2button = document.getElementById('p2_2_255_36');
    let image, ctx;
    var fps = 5, fpsInterval, startTime, now, then, elapsed;
    var canvas = document.getElementById('canvas_id');
    ctx=canvas.getContext("2d");
    image = ctx.createImageData(400, 400);

    window.addEventListener('keyup',this.keydown,false);

    function keydown(key) {
      //console.log('Key up event detected:', key.keyCode);
      var code = key.keyCode;
      switch(code) {
        case 37: console.log('LEFT DOWN'); angle-=angleStep; break;
        case 39: console.log('RIGHT DOWN'); angle+=angleStep; break;
        case 65: console.log ('Left down_2'); angle2-=angleStep2; break;
        case 68: console.log ('Right down_2'); angle2+=angleStep2; break;
        //Ovladani pro oba dva hrace pomoci klavesnice
      }
    }
    function start_game() {
      reset_canvas();
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

    function draw_playfield() {
      // console.log('frame - x is '+x+', array is '+image.data[0]);
      requestAnimationFrame(draw_playfield);

      // calc elapsed time since last loop
      now = Date.now();
      elapsed = now - then;

      // if enough time has elapsed, draw the next frame
      if (elapsed > fpsInterval) {

          // Get ready for next frame by setting then=now, but also adjust for your
          // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
          then = now - (elapsed % fpsInterval);

          var int_y = Math.floor(y);
          var int_x = Math.floor(x);

          var int_y2 = Math.floor(y2);
          var int_x2 = Math.floor(x2);

          x = x + Math.cos(angle);
          y = y + Math.sin(angle);

          x2 = x2 + Math.cos(angle2);
          y2 = y2 + Math.sin(angle2);
          //Pohyb obou dvou cervu

          if ( (int_x == Math.floor(x)) && (int_y == Math.floor(y)) ) {
            console.log('STEJNE!');
          } else {
            if(image.data[400*4*int_y + int_x*4] == 255 &&
              image.data[400*4*int_y + int_x*4 + 1] == 255 &&
              image.data[400*4*int_y + int_x*4 + 2] == 255 &&
              image.data[400*4*int_y + int_x*4 + 3] == 255) {
                image.data[400*4*int_y + int_x*4] = p1r;
                image.data[400*4*int_y + int_x*4 + 1] = p1g;
                image.data[400*4*int_y + int_x*4 + 2] = p1b;
                image.data[400*4*int_y + int_x*4 + 3] = 255;
                // colors; full 255= white, full 0= black
                ctx.putImageData(image, 0, 0);
            } else {
             console.log('Umrel jsi lol'); 
             reset_canvas();
             return;
            }
          }

          

          if( (int_x2 == Math.floor(x2) && int_y2 == Math.floor(y2)) ) {
            console.log('STEJNE_2!');
          } else {
            if (image.data[400*4*int_y2 + int_x2*4] == 255 &&
              image.data[400*4*int_y2 + int_x2*4 + 1] == 255 &&
              image.data[400*4*int_y2 + int_x2*4 + 2] == 255 &&
              image.data[400*4*int_y2 + int_x2*4 + 3] == 255) {
                image.data[400*4*int_y2 + int_x2*4] = p2r;
                image.data[400*4*int_y2 + int_x2*4 + 1] = p2g;
                image.data[400*4*int_y2 + int_x2*4 + 2] = p2b;
                image.data[400*4*int_y2 + int_x2*4 + 3] = 255;
                // colors; full 255= white, full 0= black
                ctx.putImageData(image, 0, 0);
            }
            else {
              console.log('Umrel jsi lol_2'); 
             reset_canvas();
            }
          }
         
      }
    }
   