
var height; 
var width;

function fix_dpi(can) {
  let dpi = window.devicePixelRatio;
  let style_height = +getComputedStyle(can).getPropertyValue("height").slice(0, -2);
  let style_width = +getComputedStyle(can).getPropertyValue("width").slice(0, -2);
  console.log(dpi, style_height)
  console.log(dpi, style_width)
  can.setAttribute('height', style_height * dpi);
  can.setAttribute('width', style_width * dpi);
  height = can.getAttribute('height')
  width = can.getAttribute('width')
}

function init() {
  drawBackground()
  drawUserInterface()
}


function drawUserInterface(){
  canvas = document.getElementById('ui-layer');
  ctx = canvas.getContext('2d');
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
    chargingIntervalId = setInterval(gradientPowerBar, 200);
  }

  function gradientPowerBar(){
    if(chargeValue >= 10){return}
    ctx.fillStyle = 'rgba(255, 51, 0,' + (chargeValue+1) / 10 + ')'
    ctx.fillRect(width * .3 + chargeValue * ((width*.4) / 10), 
                height *.01+5, 
                (width * .4) / 10,
                height*.1-10)
    chargeValue++;
  }

  function consumePowerbar(){
    clearInterval(chargingIntervalId)
    console.log(chargeValue)
    drawGameplay(chargeValue)
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


function drawBackground(){
  canvas = document.getElementById('background');
  ctx = canvas.getContext('2d');
  fix_dpi(canvas)
  

  if (canvas.getContext) {
    drawSky()
    drawGround()
    drawCannon()
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
    ctx.fillRect(width*.01, height * .7, width*.13, height * .05)
  }

}

function drawGameplay(power){
  var canvas = document.getElementById('game-layer');
  var ctx = canvas.getContext('2d');
  fix_dpi(canvas)
  var raf;

  var cannonball = {
    x: width*.14,
    y: height*.725,
    vx: power,
    vy: .1,
    radius: 10,
    color: 'white',
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
      cannonball.draw();
      cannonball.x += cannonball.vx;
      cannonball.y += cannonball.vy;
      cannonball.vy *= .99;
      cannonball.vy += .25;
      raf = window.requestAnimationFrame(draw);
    }

    cannonball.draw()
    raf = window.requestAnimationFrame(draw);
};
