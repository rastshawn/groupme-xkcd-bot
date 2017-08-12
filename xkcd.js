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
    console.log("test");
    var string = "";
    req.on('data', function(data) {
        string += data;
    });

    req.on('end', function(){
        var message = JSON.parse(string);

        if (message.text == "xkcd") {
            xkcd.random(function(error, response) {
                console.log(response);
                postToGroup(response.img);
                postToGroup("Title: " + response.title + "\nalt: " + response.alt);
            
            });
        }
    });

});


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
