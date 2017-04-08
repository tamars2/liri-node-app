// require npm
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("spotify");
var keys = require("./keys.js");
// var log = require("./log.txt");

//process.argv to variables for command and titles
var inputCommand = process.argv[2];
var title = process.argv[3];

//conditional for user input command
if (inputCommand === "my-tweets") {
	// var client = new twitter(keys.twitterKeys);
	var client = new twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});
 
	var params = {screen_name: 'alecbaldwin'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
  			for (var i = 0; i < 20; i++){
  				var tweet = tweets[i].text + "\r\n" + "Tweeted on: " + tweets[i].created_at + "\r\n" + "===================================" + "\r\n";
    			// console.log(tweets[i].text + "\r\n" + "Tweeted on: " + tweets[i].created_at + "\r\n" + "===================================" + "\r\n");
    			console.log(tweet);
    			writeText(tweet);
    		}
  		}
	});
}

else if (inputCommand === "spotify-this-song") {
	//if title is empty, default to the sign
	if (!title) {
   		title = "ace of base - the sign";
   		console.log(title);
   	}
   	//search spotify based on user input
	spotify.search({ type: 'track', query: title}, function(err, data) {
   			
    	if ( err ) {
        	console.log('Error occurred: ' + err);
        	return;
   		}
   		else {
   			var songData = data.tracks.items;
   			for (var i = 0; i < 1; i++){
   				var song = "Artist: " + songData[i].artists[0].name + "\r\n" + 
  							"Title: " + songData[i].name + "\r\n" +
  							"Album: " + songData[i].album.name + "\r\n" +
  							"Preview Link: " + songData[i].preview_url;
   							console.log(song);
   							writeText("\r\n ////////// \r\n" + song + "\r\n //////////");
   			}
   		}
   	});
     
}

else if (inputCommand === "movie-this") {
	//if title is empty, default to Mr. Nobody
	if (!title) {
   				title = "Mr. Nobody";
   	}
   	//call the api referencing user input movie title
    request("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json", function(error, response, body) {
 	// If there were no errors
	if (!error && response.statusCode === 200) {
	//store OMDB JSON data to variable
  	var movieInfo = "Title: " + JSON.parse(body).Title + "\r\n" + 
  					"Year: " + JSON.parse(body).Year + "\r\n" +
  					"Rating: " + JSON.parse(body).imdbRating + "\r\n" +
  					"Country: " + JSON.parse(body).Country +  "\r\n" +
  					"Language: " +JSON.parse(body).Language + "\r\n" +
  					"Plot: " + JSON.parse(body).Plot + "\r\n" +
  					"Actors: " +JSON.parse(body).Actors + "\r\n" +
  					"Rotten Tomatoes Rating: " +JSON.parse(body).Ratings[1].Value;
  					//log to screen
  					console.log(movieInfo);
				  	writeText(movieInfo);
  	}
});

}

else {
	console.log("Please make a choice: my-tweets / spotify-this-song / movie-this");
}

function writeText(input) {
	fs.appendFile('log.txt', input, function(err) {
		if(err) {
			console.log(err);
		}
	});
} 