// Initializing Required Packages
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require("inquirer");
var asciify = require("asciify");
var cp = require("copy-paste");
var opn = require('opn');
require("dotenv").config();

// Importing Twitter and Sptify Keys
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var tweets = "View my Tweets";
var spotifier = "Spotify a Song"
var movier = "Get Movie Data";
var randomizer = "Do Something Random";
var liriFunctions = [{type: "list", message: "What can I do for you?", choices: [tweets, spotifier, movier, randomizer], name: "initializeFunction"}];
var spottyFunctions = [{type: "input", message: "What song can I find for you?", name: "spottySong"}];
var restartVar = [{type: "confirm", message: "Would you like me to do anything else for you?", name: "reboot", default: true}];
var openPreview = [{type: "confirm", message: "Would you like me to play this preview for you?", name: "playPreview", default: true}];
var moviefierFunctions = [{type: "input", message: "What movie can I find for you?", name: "moviefierMovie"}];
var songSelected = false;
var spottySongSelected = "";
var movieSelected = false;
var moviefierMovieSelected = "";

// Welcome Screen
function liriBanner() {
	process.stdout.write('\033c')
	asciify("  I   a m   L I R I", {font:"3-d",color:"yellow"}, function(err, res) {
		console.log(res)
		console.log("")
	});
	setTimeout(modeSelection, 500)
};

// Select The App Mode
function modeSelection() {
	inquirer.prompt(liriFunctions).then(function(data) {
		switch (data.initializeFunction) {
			case tweets:
				tweeter()
				break;
			case spotifier:
				spotty()
				break;
			case movier:
				moviefier()
				break;
			case randomizer:
				randomizer()
				break;
		}
	})
};

// Restart a new process or exit
function postProcess() {
	console.log("")
	console.log("")
	console.log("")
	inquirer.prompt(restartVar).then(function(data) {
		if (data.reboot === true) liriBanner()
		else if (data.reboot === false) return;
	});
};

// Tweeter Functions
function tweeter() {
	process.stdout.write('\033c')
	asciify(" T w e e t e r", {font:"3-d",color:"blue"}, function(err, res) {
		console.log(res)
		console.log("")
	});
	asciify(" F e e d e r", {font:"3-d",color:"blue"}, function(err, res) {
		console.log(res)
		console.log("")
		setTimeout(tweeterPopulation, 500)
	});
};

function tweeterPopulation() {
	// home_timeline for all tweets I see, user_timeline for all tweets I post
	client.get('statuses/home_timeline', function(error, tweets, response) {
		if(error) throw error;
		for (var i = 0; i < tweets.length; i++) {
			var k = i + 1
			console.log("\x1b[34m","______________________________________________________________________________")
			console.log("\x1b[33m%s\x1b[0m", "     Tweet " + k + ": ")
			console.log("")
			console.log(tweets[i].text)
			console.log("")
			console.log("\x1b[36m", "     Author: ", "\x1b[0m", tweets[i].user.name)
		}
	});
	setTimeout(postProcess, 5000)
};

// Spotty Functions

function spotty() {
	process.stdout.write('\033c')
	asciify("  S p o t t y  ", {font:"3-d",color:"green"}, function(err, res) {
		console.log(res)
		console.log("")
		if (songSelected === false)	{
			songSelected = true;
			setTimeout(spottyInput, 500)
		} else if (songSelected === true) {
			songSelected = false;
			setTimeout(spottyPopulation, 500)
		}
	});
};

function spottyInput() {
	inquirer.prompt(spottyFunctions).then(function(data) {
		spottySongSelected = data.spottySong;
		spotty()
	});
};

function spottyPopulation() {
	spotify.search({ type: 'track', query: spottySongSelected, limit: 1}).then(function(response) {
	  	var preview = response.tracks.items[0].preview_url;
	    console.log("\x1b[33m%s\x1b[0m", "Artist(s): ", "\x1b[0m", response.tracks.items[0].album.artists[0].name)
	    console.log("\x1b[33m%s\x1b[0m", "Title:     ", "\x1b[0m", response.tracks.items[0].name)
	    console.log("\x1b[33m%s\x1b[0m", "Album:     ", "\x1b[0m", response.tracks.items[0].album.name)
	    console.log("\x1b[33m%s\x1b[0m", "Preview:   ", "\x1b[0m", preview)
	    console.log("")
	    if (preview !== null) {
		    inquirer.prompt(openPreview).then(function(data) {
				if (data.playPreview === true) opn(preview);
				else if (data.playPreview === false) {
					cp.copy(preview, function () {
				    	console.log("")
					 	console.log("\x1b[31m", "For your convenience, I copied the preview URL to the clipboard.", "\x1b[0m")
					});
				}
			});
		} else {
			console.log("")
			console.log("\x1b[31m", "I couldn't find a preview for this song, sorry.", "\x1b[0m")
		}
	})
	.catch(function(err) {
	    console.log(err)
	});
	setTimeout(postProcess, 10000)
};

// Moviefier functions
function moviefier() {
	process.stdout.write('\033c')
	asciify(" Moviefier", {font:"3-d",color:"red"}, function(err, res) {
		console.log(res)
		console.log("")
		if (movieSelected === false)	{
			movieSelected = true;
			setTimeout(moviefierInput, 500)
		} else if (movieSelected === true) {
			movieSelected = false;
			setTimeout(moviefierPopulation, 500)
		}
	});
};

function moviefierInput() {
	inquirer.prompt(moviefierFunctions).then(function(data) {
		moviefierMovieSelected = data.moviefierMovie;
		moviefier()
	});
};

function moviefierPopulation() {
	var queryUrl = "http://www.omdbapi.com/?t=" + moviefierMovieSelected + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("\x1b[34m","______________________________________________________________________________")
		    console.log("\x1b[31m", "Title:                  ", "\x1b[0m", JSON.parse(body).Title);
		    console.log("\x1b[31m", "Release Year:           ", "\x1b[0m", JSON.parse(body).Released);
		    console.log("\x1b[31m", "IMDB Rating:            ", "\x1b[0m", JSON.parse(body).Ratings[0].Value);
		    console.log("\x1b[31m", "Rotten Tomatoes Rating: ", "\x1b[0m", JSON.parse(body).Ratings[1].Value);
		    console.log("\x1b[31m", "Country of Production:  ", "\x1b[0m", JSON.parse(body).Country);
		    console.log("\x1b[31m", "Language:               ", "\x1b[0m", JSON.parse(body).Language);
		    console.log("\x1b[34m","______________________________________________________________________________")
		    console.log("\x1b[31m", "Plot: ", "\x1b[0m")
		    console.log("")
		    console.log(JSON.parse(body).Plot);
		    console.log("\x1b[34m","______________________________________________________________________________")
		    console.log("\x1b[31m", "Actors: ", "\x1b[0m")
		    console.log("")
		    console.log(JSON.parse(body).Actors);
		    console.log("\x1b[34m","______________________________________________________________________________")
		    setTimeout(postProcess, 1000)
  		} else {
  			console.log("Sorry, I cannot locate that movie.")
  			setTimeout(postProcess, 1000)
  		}
	});
};

// Randomizer functions
function randomizer() {
	process.stdout.write('\033c')
	asciify(" Randomizer", {font:"3-d",color:"cyan"}, function(err, res) {
		console.log(res)
		console.log("")
	});
};

liriBanner()
