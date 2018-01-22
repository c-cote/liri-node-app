// import keys.js + store twitter access keys 
var keys = require('./keys');
var twitterKeys = keys.twitterKeys;

// variables + packages for running app
var Twitter = require('Twitter');
var Spotify = require('Spotify');
var fs = require('fs');
var colors = require('colors/safe');
var prompt = require('prompt');
var request = require('require');
var userInput = '';
var userSelection = '';

// options
var myTweets = 'tweets';
var songs = 'spotify-this-song';
var movies = 'movie';
var doWhat = 'backstreet';


// start prompt
prompt.message = colors.green("Please type one of the following: tweets, spotify-this-song, movie, or backstreet");

prompt.start();

// ask the user what they choose
prompt.get({
  properties: {
    userInput: {
      description: colors.blue('Well? How about it?')
    }
  }
},
  // collect user input
  function (err, result) {
    userInput = result.userInput;

    // if tweets is entered, then myTwitter function runs
    if (userInput == myTweets) {
      myTwitter();
    }

    // if spotify-this-song is entered, then the system asks what song 
    else if (userInput == songs) {
      prompt.get({
        userSelection: {
          description: colors.blue('What song do you want to check out?')
        }
      },
        function (err, result) {
          if (result.userSelection === "") {
            userSelection = "The Sounds of Science";
          } else {
            userSelection = result.userSelection;
          }
          mySpotify(userSelection);
        });
    }

    // if movie is selected, the system asks what movie to look up
    else if (userInput == movies) {
      prompt.get({
        properties: {
          userSelection: {
            description: colors.blue('What movie do you want to check out?')
          }
        }
      },

        // if user hite enter, they get to see Ice Pirates
        function (err, result) {
          if (result.userSelection === "") {
            userSelection = "Ice Pirates";
          } else {
            userSelection = result.userSelection;
          }
          myMovies(userSelection);
        });
      }
  
      // serving up some backstreet from random.txt
      else if (userInput == doWhat) {
      lastOne();
    };
  });

// twitter
function myTwitter(){
  // assign variable to client to access twitterKeys
  var client = new Twitter({
    consumer_key: tiwtterKeys.consumer.key,
    consumer_secret: twitterKeys.consumer.secret,
    access_token_key: twitterKeys.access.token.key,
    access_token_secret: twitterKeys.access_token_secret
  });
  // set params to search juanDonDango
  var params = {
    screen_name: 'juanDonDango',
    count: '20',
    trim_user: false
  }
  // call twitter based on params
  client.get('statuses/user_timeline', params, function(error, timeline, response){
    if(!error){
      for(tweet in timeline){

        // store variable tdate from twitter call
        var tDate = new Date(timeline[tweet].created_at);
      }
    }
  })
}  

// spotify 

function mySpotify(userSelection){
  
  // search criteria to send to spotify
  Spotify.search({
    type: 'track',
    query: userSelection
  }, 
  function(err, data){
    if(err) throw err;

    // set music to get info from object to call in loop
    var music = data.tracks.items;

    // loops through the object returned from Spotify
      for(var i = 0; i < music.length; i++){
        for(var j = 0; j < music[i].artists.length; j++){
          console.log(colors.green("Artist: ") + music[i].artists[j].name);
          console.log(colors.green("Song Name: ") + music[i].name);
          console.log(colors.green("Preview Link: ") + music[i].preview_url);
          console.log(colors.green("Album Name: ") + music[i].album.name + "\n")                              
        }
      }
  });
}

// movie 

function myMovies(type){

  // send request to omdb 
  request('http://www.omdbapi.com/?t='+type+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body){
  if(error) throw error;

  //parse the body
  json = JSON.parse(body);

  // display results with separate console listings
  console.log(colors.green('Title: ') + json.Title);
  console.log(colors.green('Year: ') + json.Year);
  console.log(colors.green('Rated: ') + json.Rated);
  console.log(colors.green('Country: ') + json.Country);
  console.log(colors.green('Language: ') + json.Language);
  console.log(colors.green('Director: ') + json.Director);
  console.log(colors.green('Actors: ') + json.Actors);
  console.log(colors.green('Plot: ') + json.Plot);
  console.log(colors.green('imdbRating: ') + json.imdbRating);
  console.log(colors.green('Rotten Tomatoes Rating: ') + json.tomatoRating);
  console.log(colors.green('Rotten Tomatoes url: ') + json.tomatoURL);
  })
}

// serving up backstreet

var lastOne = function(last){

  // grab backstreet info from random.txt
  fs.readFile('random.txt', 'utf-8', function(err, data){
    
    // display the returned data comma-separated
    var chops = data.split(',');

    // pass into spotify funciton and run userSelection
    if(chops[0] === songs){
      userSelection = chops[1];
      mySpotify(userSelection);
    }
  })
}