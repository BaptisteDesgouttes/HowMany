npm install twit
npm install dotenv
npm install socket.io


sketch envoie un message à server toutes les 1 sec (setInterval dans sketch)
server quand il reçoit ce message, emit les rows. 

--> Quelles rows ? Depuis le lancement du site ? Depuis la veille ? 
Si l'utilisateur peut choisir, il faut que le message envoyé par sketch 
soit la date depuis quand, et faire les get dans le socket.on (avec
des if qui dépendent du message reçu ? Et si "depuis lancé" on envoie 
rows_since_beginning ? On le concatène toujours ?)

--> index.html : page demandée par le client, charge sketch.js
--> .env : permet de se connecter à Twit
--> package-lock.json et package.json : imports nécessaires (sockets entre autres)
--> server.js : Récupère les tweets et envoie les infos utiles
--> sketch.js : crée le data design avec les infos reçues depuis server.js
--> socket.io-1.4.5.js : sockets

Plus d'infos en commentaire de sketch.js

Pour tout lancer :
node server.js
http://localhost:8080/