var fs = require("fs");
var config =  JSON.parse(fs.readFileSync(__dirname + "/config.json"));

var express = require('express');
var app = express();
var server = app.listen(config.webport);
app.use('/vendor', express.static('bower_components'));
app.use('/', express.static('public'));

var io = require('socket.io')(server);

var matchManager = require(__dirname + "/matchManager.js");
var mm = new matchManager({
  matchPlayers: 2,
  io: io
});

var Game = require(__dirname + "/game.js");
var game = new Game({

});


io.on('connection', function (socket) {
  mm.connect(socket.id);
	socket.emit('welcome', game.generateWelcome(socket.id));

	socket.on('joinMatch', function(params){
    mm.joinRequest(socket.id);

	});

  socket.on('disconnect', function () {
    mm.disconnect(socket.id);
  });
});

io.on
