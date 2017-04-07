//process.argv to variables for command and titles

var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");

var inputCommand = process.argv[2];
console.log(inputCommand);

if (inputCommand === "my-tweets") {
	var client = new twitter({
		consumer_key: 'keys.twitterKeys.consumer_key',
		consumer_secret: 'keys.twitterKeys.consumer_secret',
		access_token_key: 'keys.twitterKeys.access_token_key',
		access_token_secret: 'keys.twitterKeys.access_token_secret'
	});
 
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
    	console.log(tweets);
  	}
});

}