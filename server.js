var Twit = require('twit');
require('dotenv/config');

// Get accessors to the API 
const apikey = process.env.apikey;
const apiKeySecret = process.env.apikeysecret;
const accessToken = process.env.accesstoken;
const accessTokenSecret = process.env.accesstokensecret;

// Create a Twit instance used to make requests to the API
var client = new Twit({
    consumer_key: apikey,
    consumer_secret: apiKeySecret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
    timeout_ms: 60*1000,
    strictSSL: true,
});

let keywords = [
    'Ouïghours',
    'Uyghurs',
    'Xinjiang',
    'camps de rééducation', 'rehabilitation camp', 'reeducation camp',
    'génocide', 'genocide',
    'ségrégation', 'segregation',
    'minorités', 'Minority', 'minorities',
    'Chine', 'china',
    'Musulman', 'Muslim',
    'boycott',
    'persécutions', 'persecutions',
    'FreeUyghurs',
    'abus', 'abuses',
    'défaillance', 'failure',
    'injustice',
    'maltraitance', 'abuse', 'mistreatment',
    'dictature',
    'prison', 'jail',
    'pression', 'pressure',
    'travail forcé', 'forced labor',
    'slave labor',
    'esclavage',
    'inhumain', 'inhuman',
    'faux', 'fake'
];

let word = 'uyghur';

// params GET
let paramsGet = {q: word, count: 50, result_type: 'popular', since: "2021-04-20"};

// params real time
let paramsStream = { track: word }
//track : A comma-separated list of phrases, you can think of commas as logical ORs, while spaces are
// equivalent to logical ANDs (e.g. ‘the twitter’ is the AND twitter, and ‘the,twitter’ is the OR twitter)
// Each phrase must be between 1 and 60 bytes, inclusive.

// A row of data for one tweet
let createRow = (tweet) => {
    // get the text of the tweet
    let text = tweet.text;
    if(tweet.extended_tweet)
    {
        text = tweet.extended_tweet.full_text;
    }

    // creation of an array of keywords that we can find in the tweet.
    let keywordsInTweet = [];
    keywords.map(keyword => {
        if(text.includes(keyword)) { 
            keywordsInTweet.push(keyword); 
        }
    });

    // creation of the row of datas
    let row = {
        id: tweet.id_str,
        keywords: keywordsInTweet,
        nb_fav: tweet.favorite_count,
        nb_rt: tweet.retweet_count,
        is_quote: tweet.is_quote_status,
        // nb_quote: tweet.quote_count,
        // nb_reply: tweet.reply_count,
        usr_followers: tweet.user.followers_count,
        usr_location: tweet.user.location,
        usr_verified: tweet.user.verified,
        usr_language: tweet.user.lang
    };

    return row;
}

let rows = [];
let tweets_id =[];
//GET RECENT TWEETS
client.get('search/tweets', paramsGet, function(error, tweets, response) {
    if(!error)
    {
        tweets.statuses.map((tweet) => {
            if(!tweet.text.includes('RT @'))
            {
                tweets_id.push(tweet.id_str)
                rows.push(createRow(tweet));
            }
        });
        // console.log(rows);
    }
})

// id_str of the tweets allows to retrieve them
let ids_since_beginning = [];
// datas needed for each tweet
let rows_since_beginning = [];
//REAL TIME MONITORING USING STREAM
let stream = client.stream('statuses/filter', paramsStream)
stream.on('tweet', function (tweet) {
    if(!tweet.text.includes('RT @'))    // we only consider tweets and quotes, not RTs
    {
        ids_since_beginning.push(tweet.id_str)
        
        rows_since_beginning.push(createRow(tweet));

        // console.log(tweet.text);
    }
})

// Update tweet datas each 10s
setInterval(
    function(){
        console.log('CHANGEMENT:');
        tweets_id.map(
            // get each tweet emitted since the beginning
            (tweet_id) => client.get('statuses/show/:id', { id: tweet_id }, function(error, tweet, response) {
                if(!error) {
                    // update the data (followers and favs and rts) of rows 
                    const toChangeIndex = rows.findIndex(element => element.id == tweet_id);
                    rows[toChangeIndex].usr_followers = tweet.user.followers_count;
                    rows[toChangeIndex].nb_fav = tweet.favorite_count;
                    rows[toChangeIndex].nb_rt = tweet.retweet_count;
                }
            }));
        console.log(rows);
    },
    10000 // all 10s
);


/////////////////////////////////////////////////////////////////////////// Server management

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html


// HTTP Portion
var http = require('http');
// URL module
var url = require('url');
var path = require('path');

// Using the filesystem module
var fs = require('fs');

var server = http.createServer(handleRequest);
server.listen(8080);

console.log('Server started on port 8080');

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;
  
  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }
  
  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('message',
      function(data) {
        console.log(data);
        // Send it to all other clients
        socket.emit('tweets', rows);
        console.log("tweets sent");
      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);