// forked from y.sannohe's "ボールを投げられるように改造してください" http://jsdo.it/y.sannohe/dolb
/* -------------- <今後の課題> ------------------------ */
/* 
/* ダブルクリックで円を画面と同じくらいに拡張。かつ、文字、写真および動画を表示
/* 円を拡張した後、円内をダブルクリックもしくは、円外をクリックで縮小できるように。
/* 慣性をつける。
/* 
/* 
/* -------------------------------------- */
/*
* とりあえず、それっぽく実装してみた。ちょっと投げにくいので要改良
*/

// 定型文
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var txt = canvas.getContext("2d");
var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;
width = width-16;
height = height -60;
canvas.width =  width;
canvas.height = height;

// windowサイズを決定
window.onload = window.onresize = function(){
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  width = width-16;
  height = height -120;
  canvas.width =  width;
  canvas.height = height;
};


var _ball = null;

/*txt.font = 'bold 20px Verdana';
txt.textAlign = 'left';
txt.stroke = '俺';
*/

// -------------------------- マウス操作時 ------------------------------------------------- //
//                                                                                        //
//                                                                                        //
document.onmousedown = function(e){
  var x = e.clientX;
  var y = e.clientY;
  for(i = 0; i < balls.length; i++) {
    var ball = balls[i];
    if(ball.hitTest(x,y)){
      ball.lock = true;
      _ball = ball;
      break;
    }
  }
  return false;
};

// ボールの移動処理 & 投げる処理
document.onmousemove = function(e){
  if (_ball){
    var _x = _ball.x;
    var _y = _ball.y;
    _ball.x = e.clientX//_ball.x = ((e.clientX) * (_ball.vx)*0.001);   //_ball.x = e.clientX
    _ball.y = e.clientY//_ball.y = ((e.clientY) * (_ball.vy)*0.001);
    // 前回との移動距離で投げる強さを決める
    // ほんとはmouseupのときに決めればいいので改良したいね
    _ball.vx = (_ball.x - _x);
    _ball.vy = (_ball.y - _y);
    //_ball.x = e.clientX + (_ball.vx);
    //_ball.y = e.clientY + (_ball.vx);
  }
};

// 放した時の処理
document.onmouseup = function(e){
  if(_ball){
    _ball.lock = false;
    _ball = null;
  }
};

// ダブルクリック時の処理
document.ondblclick = function(e){
  var x = e.clientX;
  var y = e.clientY;//-60;
  for(i = 0; i < balls.length; i++) {
    var ball = balls[i];
    if(ball.hitTest(x,y)){
    //  ball.lock = true;
      ball.radius += 10
      _ball = ball;
      break;
    }
  }
  if(_ball){
    _ball.lock = false;
    _ball = null;
  }  //return false;
};

//                                                                                        //
//                                                                                        //
// -------------------------------------------------------------------------------------- //

// -------------------- 関数・オブジェクト・変数群 ----------------------------------------------- //
//                                                                                        //
//                                                                                        //
// センターオブジェクト
var center = {
  x: width/2,
  y: height/2
};

// ボールの設定
function Ball(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = 90;//radius || RandomArb(30,70);
  this.vx = Math.random() * RandomArb(-0.5,0.5);//30 - 15;
  this.vy =   Math.random() * RandomArb(-0.5,0.5);//30 - 15;
  this.red = Math.ceil(Math.random() * (20-0) + 0);
  this.green = Math.ceil(Math.random() * (50-0) + 0);
  this.blue = Math.ceil(Math.random() * (255-190) + 140);
  this.alpha = Math.random() * (55-10) + 10;
  this.fillStyle = "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
  this.strokeStyle = "rgb(6,24,214)";
  this.lock = false;
  this.text = "HUGE";
}

// ボールの描画
Ball.prototype.draw = function(){
  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  context.beginPath();
  context.fillStyle = this.fillStyle;
  context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  context.fill();
  // 線の描画
  context.strokeText(this.text, this.x, this.y);//"Sample String HUGEHUGEHUGE"
  context.strokeRect(center.x*2-250,0,center.x*2-16,center.y);
  context.strokeRect(center.x*2-250,center.y,center.x*2-16,center.y*2);
  //ctx.stroke();
};

// hitTest 円の中心との距離が半径未満ならヒット
Ball.prototype.hitTest = function(x, y){
  var sx = x - this.x;
  var sy = y - this.y;
  return Math.sqrt(sx*sx+sy*sy) < this.radius;
};

// さまざまな値の設定
var balls = [];
var num = 6;          // ボールの数
var gravity = 0.00001;      // 重力   2
var bounce = -0.95;   // はずみ
var friction = 0.9999;  // 摩擦 0.98
var spring = 1.2;     // ボール同士の反発力
var limit = 0.95;

// 最初のボールの位置 -------- 別のボールと位置が被らないように描画したい -----------------
for(var i = 0, j = 225; i < num; i++, j=j+250) {
//  balls.push(new Ball(Math.random() * width, Math.random() * height));
  var balltext = ["about","profile","link"];
  balls.push(new Ball(j, center.y,balltext[i]));
//  for ( var j = 0; j < i; j++ )
}

// minからmaxまでのランダム整数を返す
function RandomArb(min, max) {
  return Math.random() * (max - min) + min;
}

/*
$(function(){
    $('body').on('mouseover', function(){
    $('this').css('color', '#ebc000');
  });
    $('body').on('mouseout', function(){
    $('this').css('color', '#ebc33f');
  });

});*/

//                                                                                        //
//                                                                                        //
// -------------------------------------------------------------------------------------- //

// -------------------- ボールの処理 ------------------------------------------------------- //
//                                                                                        //
//                                                                                        //
//  loop関数処理のインターバルを設定
setInterval(loop, 5);  // 33

// 残像処理
function loop() {
  //context.strokeStyle = "rgba(55,0,0,0.8)";
  //context.lineWidth = 10;
  //context.lineJoin = "round";
  context.shadowColor = "rgba(0,0,100,0.25)";
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 3;
  context.shadowBlue = 8;
  // 残像を残すために半透明な黒で塗る
  context.fillStyle = 'rgba(200,200,200,0.25)';
  context.fillRect(0, 0, width, height);

  // １のボール
  for(var i = 0; i < balls.length - 1; i++) {
    var ball1 = balls[i];
    // ２ボール
    for(var j = i + 1; j < balls.length; j++) {
      var ball2 = balls[j];

      // 二つのボールの間の距離を調べる
      var dx = ball2.x - ball1.x;
      var dy = ball2.y - ball1.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var minDist = ball1.radius + ball2.radius;

      // もしもballs[i]と[j]が当たっているなら
      if(dist < minDist) {
        var angle = Math.atan2(dy, dx);
        var tx = ball1.x + Math.cos(angle) * minDist;
        var ty = ball1.y + Math.sin(angle) * minDist;
        var ax = (tx - ball2.x) * spring;
        var ay = (ty - ball2.y) * spring;

        // 二つのボールを反発させる
        //if (!ball1.lock){
          ball1.vx -= ax*0.002*ball2.radius;
          ball1.vy -= ay*0.002*ball2.radius;
        //}
        //if (!ball2.lock){
          ball2.vx += ax*0.002*ball1.radius;
          ball2.vy += ay*0.002*ball1.radius;
        //}
      }
    }
  }

  // ボールをを描画している
  for(i = 0; i < balls.length; i++) {
    var ball = balls[i];      // balls[i]をball変数に入れる
    ball.lock || move(ball);  // 掴んだボールとそうじゃないボールで処理を分けている
    ball.draw();
  }
}

// ボールの動き
function move(ball) {
  ball.vx *= friction;
  ball.vy *= friction;
  ball.vy += gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;
  if ( ball.vx>0.9　) ball.vx = ball.vx*limit;
  if ( ball.vy>0.9　) ball.vy = ball.vy*limit;

// ボールが動ける幅を指定
  if(ball.x > width - ball.radius - 250 && ball.lock != true) {
    ball.x = width - ball.radius - 250 ;
    ball.vx *= bounce;
  } else if(ball.x < ball.radius) {
    ball.x = ball.radius;
    ball.vx *= bounce;
  } else if(ball.y > height - ball.radius) {
    ball.y = height - ball.radius;
    ball.vy *= bounce;
  } else if(ball.y < ball.radius) {
    ball.y = ball.radius;
    ball.vy *= bounce;
  }
}
//                                                                                        //
//                                                                                        //
// -------------------------------------------------------------------------------------- //