// Initializing Required Packages
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require("inquirer");
require("dotenv").config();

// Importing Twitter and Sptify Keys
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var tweets = "View my Tweets";
var spotifier = "Spotify a Song"
var movier = "Get Movie Data";
var randomizer = "Do Something Random";
var liriFunctions = [{type: "list", message: "What would you like to do?", choices: [tweets, spotifier, movier, randomizer], name: "initializeFunction"}];


// Select The App Mode
function modeSelection() {
	inquirer.prompt(liriFunctions).then(function(data) {
		switch (data.initializeFunction) {
			case tweets:
				console.log("Tweet Tweet");
				break;
			case spotifier:
				console.log("Lalalalal");
				break;
			case movier:
				console.log("MOOOOOvie");
				break;
			case randomizer:
				console.log("RANDO");
				break;
		}
	})
}

modeSelection()