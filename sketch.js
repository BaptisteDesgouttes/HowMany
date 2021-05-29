var easycam;
let scene;
let angle = 0;
let tweet = [];
let lightTweets = [];

function preload() {
  scene = loadModel('people.obj');
  // scene = loadModel('scene.obj');
  // scene = loadModel('sol_avec_corps-petit.obj');
}

// function setup() {
//   createCanvas(1536, 864, WEBGL);
// }

// function draw() {
//   background(0);
//   ambientLight(255,0,0);
//   directionalLight(255,255,255,0,0,1);
//   scale(100);
//   rotateX(angle);
//   rotateY(angle*1.3);
//   rotateZ(angle*0.7);
//   //box(100);
//   model(monkey);
//   angle+=0.03;
// }


////////////////////////////////////////////////AU DESSUS TON ANCIEN CODE
////////////////////////////////////////////////EN DESSOUS LE CODE SOCKET

// Keep track of our socket connection
var socket;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //easycam = createEasyCam();
  background(0);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:8080');
  // We make a named event called 'mouse' and write an
  // anonymous callback function

  setInterval(sendping, 1000);
  socket.on('tweets',
    // When we receive data
    function(data) {
      tweet = data;
      // ICI data C EST LA LISTE DES TWEETS ENVOYES
      // SI TU TE CO SUR localhost:8080 TU PEUX LES CONSOLE LOG POUR VOIR COMMENT
      // LES UTILISER. C'EST UN TABLEAU DE TWEET ET CHAQUE TWEET EST UN OBJET 
      // DE CETTE FORME : 
      // {id, keywords, nb_fav, nb_rt, is_quote, usr_followers, usr_location, usr_verified, usr_language}
      // DU COUP data[0].nb_rt CA TE DONNE LES RT DU PREMIER TWEET

      // ACTUELLEMENT LES TWEETS ENVOYES C EST DEPUIS LE 20/04 DONC JSUIS PAS SUR QUE CA MARCHE BIEN OU QUOI
      // DEMANDE MOI SI TU VOIS AUCUN TWEET
    }
  );

  
}

function draw() {
  background(0);
  
  scale(2);    
  translate(20, -8, 0);
  
  let locX = mouseX - height / 2;
  let locY = mouseY - width / 2;
  //pointLight(80, 80, 80, locX, locY, 10);
  //ambientLight(255,255,255);
  
  for(var i = 0; i < tweet.length; i++) {
    lightTweets[i] = new lightTweet(tweet[i].usr_verified, tweet[i].nb_fav);
    lightTweets[i].display();
  }
  
    // pointLight(90  * cos(2 * frameCount/100) + 30, 90  * cos(2 * frameCount/100) + 30, 90  * cos(2 * frameCount/100) + 30, 100, -50, -30);
    // push();
    //   translate(100,-50, -30);
    //   normalMaterial();
    //   specularMaterial(255);
    //   sphere(1);
    // pop();

    // pointLight((255 - 204) * sin(frameCount/60) + 30, (242 - 204) * sin(frameCount/60) + 30, (204 - 204) * sin(frameCount/60) + 30, -100, 0, 200);
    // push();
    //   translate(-100, 0, 200);
    //   normalMaterial();
    //   specularMaterial(255);
    //   sphere(1);
    // pop();

    rotateX(-PI/6);
    rotateY(-PI/3);
    rotateZ(PI);
    
    normalMaterial();
    ambientMaterial(255);
    model(scene);
}

// Function for sending to the socket
function sendping() {
  // Send that object to the socket
  socket.emit('message', "Data sent");
}

function lightTweet(verified, likes) {
  
  this.color = color(0, 0, 0);
  
  this.x = random(-100,100); 
  this.y = random(0,100);
  this.z = random(-100,100);

  if(verified) {
    this.color.setRed((255 - 203) * map(likes, 0, 1000000, 0, 1));
    this.color.setBlue((242 - 203) * map(likes, 0, 1000000, 0, 1));
    this.color.setGreen((204 - 203) * map(likes, 0, 1000000, 0, 1));
  }

  else {
    this.color.setRed((90) * map(likes, 0, 1000000, 0, 1));
    this.color.setBlue((90) * map(likes, 0, 1000000, 0, 1));
    this.color.setGreen((90) * map(likes, 0, 1000000, 0, 1));
  }
  
  this.display = function() {
    pointLight(this.color, this.x, this.y, this.z);
    push();
      translate(this.x, this.y, this.z);
      normalMaterial();
      specularMaterial(255);
      sphere(1);
    pop();
  }

}