var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  fs = require('fs');

var osc = require('node-osc');

app.use(express.static(__dirname + '/public'));


server.listen(3000);
console.log('Server listening on port 3000');
console.log('Point your browser to http://localhost:3000');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// var fps = 30;
var fps = 1000;
var loginNumber = 0;
var frameCount = 0;
var player_list = [];
var oscServer = new osc.Server(3333, '0.0.0.0'); 


io.sockets.on("connection", function(socket) {
  var player = {
    id : socket.id,
    loginNumber: loginNumber
  };

  player_list.push(player);

  socket.on("disconnect", function() {
      delete player_list[ player.login_id ];
   });

  // socket.on( "start", function () {
  // setInterval( function () {
  //   for (var i = 0; i < player_list.length; i ++) {
  //     if (io.sockets.connected[player_list[i].id]) {
  //       io.sockets.connected[player_list[i].id].emit('click', (frameCount + player_list[i].loginNumber) % 120);
  //     }
  //   }

  //   if (frameCount % 119 == 0 && frameCount != 0) {
  //     frameCount = 0;
  //   } else {
  //     frameCount += 24;
  //   }
  // }, fps);
  // })
  
  oscServer.on("clock", function (msg, rinfo) { 
    for (var i = 0; i < player_list.length; i ++) {
      if (io.sockets.connected[player_list[i].id]) {
        io.sockets.connected[player_list[i].id].emit('click', (frameCount + player_list[i].loginNumber) % 120);
      }
    }

    if (frameCount % 119 == 0 && frameCount != 0) {
      frameCount = 0;
    } else {
      frameCount += 24;
    }
  });

  loginNumber += 1;
});






  


