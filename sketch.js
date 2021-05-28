// let monkey;
// let angle = 0;

// function preload() {
//   monkey = loadModel('monkey.obj');
// }

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
  createCanvas(windowWidth, windowHeight);
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
  // Nothing
}

// Function for sending to the socket
function sendping() {
  // Send that object to the socket
  socket.emit('message', "Data sent");
}
