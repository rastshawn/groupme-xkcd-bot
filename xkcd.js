var express = require('express');
var app = express();
var fs = require('fs');
var spawn = require('child_process').spawn;
var xkcd = require('xkcd-api');
var request = require('request');

app.get('/groupme', function(req, res) {
    console.log(req);
    console.log("get");
});

var botID = "";

app.post('/groupme', function(req, res) {
    var string = "";
    req.on('data', function(data) {
        string += data;
    });

    req.on('end', function(){
        var message = JSON.parse(string);
        var args = message.text.split(' ');

        if (args[0].toLowerCase() == "xkcd") {

            if (args[1]) {
                var arg = args[1].toLowerCase();
                if (arg == "latest") {
					xkcd.latest(function(error, response) {
						if (error) {
							console.error(error);
					  	} else {
					  		makePost(response);
						}
					});
                } else if (arg == "random") {
                    xkcd.random(function(error, response) {
                    	makePost(response);
					});
                } else if (arg == "help") {
                    makePost("Get latest comic: 'xkcd latest'\n" + 
                            "Get random comic: 'xkcd' or 'xkcd random'\n" + 
                            "Get specific comic: 'xkcd #' (ex: 'xkcd 274')"
                    );
			    } else if (isNan(arg)) {

                    postToGroup(arg + " is not a recognized command. try 'xkcd help' for a list of what you can do.");
                } else {

 					xkcd.get('comic-id', function(error, response) {
 						if (error) {
 							console.error(error);
 						} else {
 							makePost(response);
						}
					});
                }


            } else {

                xkcd.random(function(error, response) {
          			makePost(response); 
                });
            }
        }
    });

});

function makePost(comic) {
	postToGroup(comic.img);
	postToGroup("Title: " + comic.title + "\nalt: " + comic.alt);

}

function postToGroup(text) {
                request({
                    url: 'https://api.groupme.com/v3/bots/post',
                    method: "POST",
                    json: true,
                    body : {
                        "bot_id" : botID,
                        "text" : text 
                    }
                },
                  function(error, response, body) {
                    console.log(body);
                    console.log(error);
                  }
                );
}
app.listen(3500, function() {
    console.log('listening on 3500');
});
