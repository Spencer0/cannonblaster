
var height; 
var width;
var target_value;
var score = 0;

function fix_dpi(can){
  let dpi = window.devicePixelRatio;
  let style_height = +getComputedStyle(can).getPropertyValue("height").slice(0, -2);
  let style_width = +getComputedStyle(can).getPropertyValue("width").slice(0, -2);
  can.setAttribute('height', style_height * dpi);
  can.setAttribute('width', style_width * dpi);
  height = can.getAttribute('height')
  width = can.getAttribute('width')
}

function init(){
  drawBackground()
  drawUserInterface()
  drawLayover()
}

function drawUserInterface(){
  canvas = document.getElementById('ui-layer');
  ctx = canvas.getContext('2d');
  ctx.clearRect(0,0, canvas.width, canvas.height);
  fix_dpi(canvas)
  var chargeValue = 0;
  var charging = false;
  var chargingIntervalId = 0;
  drawPowerBar()

  function drawPowerBar(){
    ctx.fillStyle = 'rgb(255, 51, 0)'
    ctx.fillRect(width * .3, height *.01, width*.4, height*.1)
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.fillRect(width * .3 +5, height *.01+5, width*.4-10, height*.1-10)
  }

  function beginPowerBar(){
    chargingIntervalId = setInterval(gradientPowerBar, 20);
  }

  function gradientPowerBar(){
    if(chargeValue >= 100){return}
    ctx.fillStyle = 'rgba(255, 51, 0,' + (chargeValue+10) / 100 + ')'
    ctx.fillRect((width * .3 + chargeValue * ((width*.4) / 100)), 
                height *.01+5, 
                (width * .4) / 100,
                height*.1-10)
    chargeValue++;
  }

  function consumePowerbar(){
    clearInterval(chargingIntervalId)
    drawCannonball(chargeValue*3)
    chargeValue = 0;
    drawPowerBar()
  }

  document.addEventListener("keydown", function onEvent(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
        if(!charging){
          charging = true
          beginPowerBar()
        }
    }
  });

  document.addEventListener("keyup", function onEvent(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      charging = false
      consumePowerbar()
    }
  });
}

function drawLayover(){
  var canvas = document.getElementById('layover-layer');
  var ctx = canvas.getContext('2d');
  fix_dpi(canvas)
  drawTarget()
  drawScore()

  function drawTarget(){
    starting_spot = Math.random()
    while(starting_spot < .25 || starting_spot > .85){
      starting_spot = Math.random()
    }
    ctx.fillStyle = 'rgb(255, 51, 0)'
    ctx.fillRect(width * starting_spot, height *.8, width*.05, height*.01)
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.fillRect(width * starting_spot +5, height *.8+5, width*.05-10, height*.01-10)
    target_value = width * starting_spot +5;
  }

  function drawScore(){
    ctx.font = "12px Arial";
    ctx.fillText("Confirmed Kills: " + score, width *.8, height*.05);
  }

}

function drawBackground(){
  canvas = document.getElementById('background');
  ctx = canvas.getContext('2d');
  fix_dpi(canvas)
  

  if (canvas.getContext) {
    drawSky()
    drawGround()
    drawCannon()
    drawInstructions()
  }

  function drawInstructions(){
    ctx.font = "12px Arial";
    ctx.fillText("Hold Spaccebar to charge your cannon", width *.01, height*.05);
  } 

  function drawGround(){
    ctx.strokeStyle = 'green'
    ctx.lineWidth = height * .20
    ctx.beginPath()
    ctx.moveTo(0,height * .90)
    ctx.lineTo(width,height * .90)
    ctx.stroke()
  }

  function drawSky(){
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawCannon(){
    ctx.fillStyle = 'rgb(0, 176, 164)'
    ctx.fillRect(0, height * .3, width*.14, height * .05)
  }

  

}

function drawCannonball(power){
  actual_power = (width / 7500) * (power / 2) 
  var canvas = document.getElementById('game-layer');
  var ctx = canvas.getContext('2d');
  fix_dpi(canvas)
  var raf;

  var cannonball = {
    x: width*.14,
    y: height*.325,
    vx: actual_power,
    vy: .1,
    radius: 10,
    color: 'black',
    draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    //console.log("drawing ball")
    cannonball.draw();
    cannonball.x += cannonball.vx;
    cannonball.y += cannonball.vy;
    cannonball.vy *= .99;
    cannonball.vy += .25;
    raf = window.requestAnimationFrame(draw)
  
    //console.log("About to pass the ground", cannonball.y, height)
    if(cannonball.y > height * .8 - 5 && cannonball.y < height * .8 + 5){
      console.log("Passed ground")
      if(cannonball.x > target_value && cannonball.x < target_value + width*.05+10){
        console.log("victory")
        score++;
        drawLayover()
        window.cancelAnimationFrame(raf);
      }
      window.cancelAnimationFrame(raf);
    }
  }
  
  cannonball.draw()
  draw()
}
