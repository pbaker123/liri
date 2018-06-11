// Initializing Required Packages
require("dotenv").config();
var preloads = { 
	asciify: require("asciify"), 
	keys: require("./keys.js"), 
	cp: require("copy-paste"), fs: require("fs"), 
	inquirer: require("inquirer"), 
	opn: require('opn'), 
	request: require('request'),
	Spotify: require('node-spotify-api'),
	Twitter: require('twitter') 
};

// Importing Twitter and Sptify Keys
var spotify = new preloads.Spotify(preloads.keys.spotify);
var client = new preloads.Twitter(preloads.keys.twitter);

// Contains all the messages used and created
var messages = {
	choice: ["View my Tweets", "Spotify a Song", "Get Movie Data", "Do Something Random", "My tweets, please", "View all the tweets!", "tweetRun", "spottyRun", "moviefierRun"],
	questions: ["What can I do or you?", "What tweets would you like me to find?", "What song can I find for you?", "Would you like me to do anything else for you?", "Would you like me to play this preview for you?", "What movie can I find for you?"],
	titles: ["  I   a m   L I R I", " T w e e t e r", " F e e d e r", "  S p o t t y  ", " Moviefier","Randomize"],
	titlesPrint: function(i, color) {
		preloads.asciify(messages.titles[i], {font:"3-d",color:color}, function(err, res) {
			console.log(res + "\n")
		});
	},
	colors: {
		blue: "\x1b[34m",
		yellow: "\x1b[33m",
		default: "\x1b[0m",
		cyan: "\x1b[36m",
		red: "\x1b[31m"
	},
	reset: function() { 
		process.stdout.write('\033c') 
	},
	tweeterPop: function(k, i, tweets) { 
		console.log(messages.colors.blue,defaults.line, messages.colors.yellow, "\n     Tweet " + k + ": " + "\n" + "\n", messages.colors.default, tweets[i].text + "\n", messages.colors.cyan, "\n     Author: ", messages.colors.default, tweets[i].user.name) 
	},
	spottyPopMain: function(response, preview) { 
		console.log(messages.colors.yellow, "\nArtist(s): ", messages.colors.default, response.tracks.items[0].album.artists[0].name, messages.colors.yellow, "\nTitle:     ", messages.colors.default, response.tracks.items[0].name, messages.colors.yellow, "\nAlbum:     ", messages.colors.default, response.tracks.items[0].album.name, messages.colors.yellow, "\nPreview:   ", messages.colors.default, preview + "\n") 
	},
	spottyPopPreview: function(preview) { 
		preloads.inquirer.prompt(inquiries.openPreview).then(function(data) {
			if (data.playPreview === true) preloads.opn(preview); 
			else if (data.playPreview === false) {
				preloads.cp.copy(preview, function () {
					console.log(messages.colors.red, "\nFor your convenience, I copied the preview URL to the clipboard.", messages.colors.default)
				});
			}
		}); 
	},
	spottyPopNoPreview: function(response, preview) { 
		console.log(messages.colors.red, "\nI couldn't find a preview for this song, sorry.", messages.colors.default) 
	},
	

	// replace JSON.parse(body) and pass it as a variable into here!
	moviefierPop: function(mov) {
		console.log(messages.colors.blue,defaults.line,messages.colors.red, "\nTitle:                  ",messages.colors.default, mov.Title,messages.colors.red, "\nRelease Year:           ",messages.colors.default, mov.Released,messages.colors.red, "\nIMDB Rating:            ",messages.colors.default, mov.Ratings[0].Value,messages.colors.red, "\nRotten Tomatoes Rating: ",messages.colors.default, mov.Ratings[1].Value,messages.colors.red, "\nCountry of Production:  ",messages.colors.default, mov.Country,messages.colors.red, "\nLanguage:               ",messages.colors.default,mov.Language,messages.colors.blue,"\n",defaults.line,messages.colors.red, "\nPlot: ",messages.colors.default,"\n",mov.Plot,"\n",messages.colors.blue,defaults.line, messages.colors.red, "\nActors: ",messages.colors.default,"\n",mov.Actors,"\n",messages.colors.blue,defaults.line)
	}
};

var inquiries = {
	liriFunctions: [{type: "list", message: messages.questions[0], choices: [messages.choice[0], messages.choice[1], messages.choice[2], messages.choice[3]], name: "initializeFunction"}],
	moviefierFunctions: [{type: "input", message: messages.questions[5], name: "moviefierMovie"}],
	openPreview: [{type: "confirm", message: messages.questions[4], name: "playPreview", default: true}],
	restartVar: [{type: "confirm", message: messages.questions[3], name: "reboot", default: true}],
	spottyFunctions: [{type: "input", message: messages.questions[2], name: "spottySong"}],
	tweeterFunctions: [{type: "list", message: messages.questions[1], choices: [messages.choice[4], messages.choice[5]], name: "initializeTweeter"}],
};

var defaults = {
	moviefierMovieSelected: "",
	movieSelected: false,
	songSelected: false,
	spottySongSelected: "",
	tweeterMode: "",
	tweeterSelected: false,
	line: "______________________________________________________________________________"
};

// Common function to print titles for each Liri command
function titles(i, color) {
	asciify(messages.titles[i], {font:"3-d",color:color}, function(err, res) {
		console.log(res)
		console.log("")
	});
}

// Welcome Screen
function liriBanner() {
	messages.reset();
	messages.titlesPrint(0, "yellow")
	setTimeout(modeSelection, 500)
};

// Select The App Mode
function modeSelection() {
	preloads.inquirer.prompt(inquiries.liriFunctions).then(function(data) {
		switch (data.initializeFunction) {
			case messages.choice[0]:
				tweeter()
				break;
			case messages.choice[1]:
				spotty()
				break;
			case messages.choice[2]:
				moviefier()
				break;
			case messages.choice[3]:
				randomizerFunction()
				break;
		}
	})
};

// Restart a new process or exit
function postProcess() {
	console.log("")
	console.log("")
	console.log("")
	preloads.inquirer.prompt(inquiries.restartVar).then(function(data) {
		if (data.reboot === true) liriBanner()
		else if (data.reboot === false) return;
	});
};

// Tweeter Functions
function tweeter() {
	messages.reset();
	for (var i = 1; i < 3; i++) {
		messages.titlesPrint(i, "blue")
	};
	if (defaults.tweeterSelected === false)	{
		defaults.tweeterSelected = true;
		setTimeout(tweeterInput, 500)
	} else if (defaults.tweeterSelected === true) {
		defaults.tweeterSelected = false;
		setTimeout(tweeterPopulation, 500)
	};
};

function tweeterInput() {
	preloads.inquirer.prompt(inquiries.tweeterFunctions).then(function(data) {
		defaults.tweeterMode = data.initializeTweeter;
		tweeter()
	});
};

function tweeterPopulation() {
	// home_timeline for all tweets I see, user_timeline for all tweets I post
	if (defaults.tweeterMode === messages.choice[4]) var tweeterModeSelection = "user";
	else var tweeterModeSelection = "home";
	client.get("statuses/" + tweeterModeSelection + "_timeline", function(error, tweets, response) {
		if(error) throw error;
		for (var i = 0; i < tweets.length; i++) {
			var k = i + 1;
			messages.tweeterPop(k, i, tweets)
		}
	});
	setTimeout(postProcess, 5000)
};

// Spotty Functions
function spotty() {
	messages.reset();
	messages.titlesPrint(3, "green");
	if (defaults.songSelected === false)	{
		defaults.songSelected = true;
		setTimeout(spottyInput, 500)
	} else if (defaults.songSelected === true) {
		defaults.songSelected = false;
		setTimeout(spottyPopulation, 500)
	}
};

function spottyInput() {
	preloads.inquirer.prompt(inquiries.spottyFunctions).then(function(data) {
		defaults.spottySongSelected = data.spottySong;
		spotty()
	});
};

function spottyPopulation() {
	spotify.search({ type: 'track', query: defaults.spottySongSelected, limit: 1}).then(function(response) {
	  	var preview = response.tracks.items[0].preview_url;
	    messages.spottyPopMain(response, preview)
	    if (preview !== null) {
		    messages.spottyPopPreview(preview)
		} else {
			messages.spottyPopNoPreview(response, preview)
		}
	})
	.catch(function(err) {
	    console.log(err)
	});
	setTimeout(postProcess, 10000)
};

// Moviefier functions
function moviefier() {
	messages.reset();
	messages.titlesPrint(4, "red");
	if (defaults.movieSelected === false)	{
		defaults.movieSelected = true;
		setTimeout(moviefierInput, 500)
	} else if (defaults.movieSelected === true) {
		defaults.movieSelected = false;
		setTimeout(moviefierPopulation, 500)
	}
};

function moviefierInput() {
	preloads.inquirer.prompt(inquiries.moviefierFunctions).then(function(data) {
		defaults.moviefierMovieSelected = data.moviefierMovie;
		moviefier()
	});
};

function moviefierPopulation() {
	preloads.request("http://www.omdbapi.com/?t=" + defaults.moviefierMovieSelected + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var mov = JSON.parse(body);
			messages.moviefierPop(mov)
			setTimeout(postProcess, 1000)
  		} else {
  			console.log("Sorry, I cannot locate that movie.")
  			setTimeout(postProcess, 1000)
  		}
	});
};

// Randomizer functions
function randomizerFunction() {
	messages.reset();
	messages.titlesPrint(5, "red");
	setTimeout(randomizerInput, 500);

};

function randomizerInput() {
	preloads.fs.readFile("random.txt", "utf8", function(error, data) {
	  	if (error) {
	  		console.log(error);
	  		setTimeout(liriBanner, 5000)
	  	}
	  	// get even random number (0-dataArr.length/2) *2 so it is only even
	  	// Designed to take multiple lines formatted as [function],input and pick one at random to perform.  [functions] are tweetRun, spottyRun, and moviefierRun.  For tweetRun accepted inputs are user and home.  For the other two any valid title.  Every line needs a function and input
	  	var dataArr = data.replace(/\n/g, ",").replace(/\r/g, "").split(",");
		console.log(dataArr);
		if (dataArr.length % 2 === 0) {
			var runNumber = Math.floor(Math.random() * dataArr.length * .5) * 2;
			console.log(runNumber);
			console.log(dataArr[runNumber]);
			switch (dataArr[runNumber]) {
				case messages.choice[6]:
					if (dataArr[runNumber + 1] === "user" || dataArr[runNumber + 1] === "home") {
					defaults.tweeterSelected = true;
					defaults.tweeterMode = dataArr[runNumber + 1];
					console.log("Tweeter" + defaults.tweeterMode)
					tweeter()
					break;
					} else {
						defaults.tweeterSelected = true;
						defaults.tweeterMode = "home";
						tweeter()
					}
				case messages.choice[7]:
					defaults.songSelected = true;
					defaults.spottySongSelected = dataArr[runNumber + 1];
					console.log("Spott" + defaults.spottySongSelected)
					spotty()
					break;
				case messages.choice[8]:
					defaults.movieSelected = true;
					defaults.moviefierMovieSelected = dataArr[runNumber + 1];
					console.log("Movieier" + defaults.moviefierMovieSelected)
					moviefier()
					break;
			}
		} else {
			console.log("Sorry the input file is corrupt")
		}
	});
};

liriBanner()
