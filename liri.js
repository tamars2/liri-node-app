// require npm packages for use in functions
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("spotify");
var keys = require("./keys.js");
// var log = require("./log.txt");

//process.argv to variables for command and titles
var inputCommand = process.argv[2];
var title = process.argv[3];

//switch statement to test the condition of the inputCommand
switch(inputCommand) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifySearch(title);
		break;
	case "movie-this":
		movieSearch(title);
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
	case undefined:
		console.log("Try again!");
		break;
}
//designate tweets function
function myTweets() {
	//setup client with my keys stored in keys.js
	var client = new twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
		});
		//default screen name to search 
		var params = {screen_name: 'alecbaldwin'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
  			if (!error) {
  				for (var i = 0; i < tweets.length; i++){
  					//display tweets index starting number as 1 and not 0
  					// Tweet #0 makes no sense!
  					var tweetNum = i + 1;
  					var tweet = "Tweet #" + tweetNum + ": " + "\r\n" + 
  					"===================================" + "\r\n" + 
  					tweets[i].text + "\r\n" + "Tweeted on: " + 
  					tweets[i].created_at + "\r\n" + 
  					"===================================" + "\r\n";
    				console.log(tweet);
    				log(tweet);
    			}
  			}
  			else {
  				console.log(error);
  			}
		});
}

//pass title from node input to spotify search engine
function spotifySearch(title) {
	//if there title is undefined, default to the sign
	if (!title) {
   		title = "ace of base - the sign";
   	}
   	//search spotify based on user input
	spotify.search({ type: 'track', query: title}, function(err, data) {
   		//if we receive an error, log it	
    	if ( err ) {
        	console.log('Error occurred: ' + err);
        	return;
   		}
   		else {
   			//store the object into a shorter variable for readability
   			var songData = data.tracks.items;
   			//print one result from spotify
   			for (var i = 0; i < 1; i++){
   				//build song info screen
   				var song = "===================================" + "\r\n" +
   							"Artist: " + songData[i].artists[0].name + "\r\n" + 
  							"Title: " + songData[i].name + "\r\n" +
  							"Album: " + songData[i].album.name + "\r\n" +
  							"Preview Link: " + songData[i].preview_url + "\r\n" +
  							"===================================";
   							console.log(song);
   							log("\r\n %%%%%%%%%% \r\n" + song + "\r\n %%%%%%%%%%");
   			}
   		}
   	});
}

//OMDB search function
function movieSearch(title) {
	//if title is undefined, default to Mr. Nobody
	if (!title) {
   				title = "Mr. Nobody";
   	}
   	//call the api referencing user input movie title
    request("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json", function(error, response, body) {
 		// If there were no errors
		if (!error && response.statusCode === 200) {
			//store OMDB JSON data to variable
			//JSON.parse seems to work best here
  			var movieInfo = "===================================" + "\r\n" +
  							"Title: " + JSON.parse(body).Title + "\r\n" + 
  							"Year: " + JSON.parse(body).Year + "\r\n" +
  							"IMDB Rating: " + JSON.parse(body).imdbRating + "\r\n" +
  							"Country: " + JSON.parse(body).Country +  "\r\n" +
  							"Language: " +JSON.parse(body).Language + "\r\n" +
  							"Plot: " + JSON.parse(body).Plot + "\r\n" +
  							"Actors: " +JSON.parse(body).Actors + "\r\n" +
  							"Rotten Tomatoes Rating: " +JSON.parse(body).Ratings[1].Value + "\r\n" + 
  							"===================================";
  			//log to screen
  			console.log(movieInfo);
  			log("\r\n %%%%%%%%%% \r\n" + movieInfo + "\r\n %%%%%%%%%%");
 		}
	});
}

//do what it says to read random.txt and perform spotify search with data from the txt file
function doWhatItSays() {
	fs.readFile('random.txt', 'utf8', function(error, data){
		var dataArr = data.split(",");
		spotifySearch(dataArr[1]);
	})
}

//BONUS append every succesful query to log.txt
function log(input) {
	fs.appendFile('log.txt', input, function(err) {
		if(err) {
			console.log(err);
		}
	});
}