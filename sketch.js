var easycam;
let scene;
let angle = 0;
let tweet = [];
let lightTweets = [];

function preload() {
  scene = loadModel('people.obj');
}

////////////////////////////////////////////////AU DESSUS TON ANCIEN CODE
////////////////////////////////////////////////EN DESSOUS LE CODE SOCKET

// Keep track of our socket connection
var socket;

function setup() {
  colorMode(RGB);
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
      for(var i = 0; i < tweet.length; i++) {
        lightTweets[i] = new lightTweet(tweet[i].usr_verified, tweet[i].nb_fav, tweet[i].positionx, tweet[i].positiony, tweet[i].positionz);
      }
    }
  );
}
  
  function draw() {
  background(0);
  
  let locX = mouseX - height / 2;
  let locY = mouseY - width / 2;
  
  scale(3);
  translate(0, -10, 40);
  rotateX(-PI/6);
  rotateZ(PI);
  rotateY(frameCount/500);
  
  for(var i = 0; i < tweet.length; i++) {
    lightTweets[i].display();
  }
  
  normalMaterial();
  ambientMaterial(255);
  model(scene);
}

// Function for sending to the socket
function sendping() {
  // Send that object to the socket
  socket.emit('message', "Data sent");
}

function lightTweet(verified, likes, x, y, z) {
  //this.color = color(0, 0, 0);
  let color = createVector(0, 0, 0);
  this.x = x;
  this.y = y;
  this.z = z;
  
  this.display = function() {
    if(!verified) {
      push();
        pointLight(255  - 255 * (map(likes, 0, 1000, 0.5, 1)), 255  - 255 * (map(likes, 0, 1000, 0.5, 1)), 255  - 255 * (map(likes, 0, 1000, 0.5, 1)), this.x, this.y, this.z); 
        translate(this.x, this.y, this.z);
        normalMaterial();
        specularMaterial(255);
        sphere(1);
      pop();
    }

    if(verified) {
      pointLight(255 - 204 * (map(likes, 0, 10000, 0.5, 1)) - 20, 242 - 204 * (map(likes, 0, 10000, 0.5, 1)) - 20, 204 - 204 * (map(likes, 0, 10000, 0.5, 1)) - 20, this.x, this.y, this.z);
      push();
        translate(this.x, this.y, this.z);
        normalMaterial();
        specularMaterial(255);
        sphere(1);
      pop();
    }
  }
    //TEST MAIS FAUT GARDER AU CAS OU
  //pointLight(80, 80, 80, locX, locY, 10);
  //ambientLight(255,255,255);
  
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
}