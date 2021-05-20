let monkey;
let angle = 0;

function preload() {
  monkey = loadModel('monkey.obj');
}

function setup() {
  createCanvas(1536, 864, WEBGL);
}

function draw() {
  background(0);
  ambientLight(255,0,0);
  directionalLight(255,255,255,0,0,1);
  scale(100);
  rotateX(angle);
  rotateY(angle*1.3);
  rotateZ(angle*0.7);
  //box(100);
  model(monkey);
  angle+=0.03;
}
