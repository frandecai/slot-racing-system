'use strict';

// Listening port
var port = 9000;

// Variables for change state for every sensor
var state1Changed = false;
var state2Changed = false;

// Declare vars for arduino board
var five = require("johnny-five");
var board = new five.Board();

// Declare vars for websockets
var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);

app.use(express.static('public'));

// Read sensors status from Arduino 
board.on("ready", function() {
    var sensor1 = new five.Pin(8);
    var sensor2 = new five.Pin(9);
    
    // Read for sensor on PIN 8
    five.Pin.read(sensor1, function(error, value1) {
        if ((value1 == 1) && (!state1Changed)) {
            state1Changed = true;
            var sensors = [{  
                sensor1: true,
                sensor2: false}];
            
            console.log('Sensor1: ' + value1);
            io.sockets.emit('sensors', sensors);
        }

        if ((value1 == 0) && (state1Changed)) {
            state1Changed = false;
        }
    });

    // Read for sensor on PIN 9
    five.Pin.read(sensor2, function(error, value2) {
        if ((value2 == 1) && (!state2Changed)) {
            state2Changed = true;
            var sensors = [{  
                sensor1: false,
                sensor2: true}];

            console.log('Sensor2: ' + value2);
            io.sockets.emit('sensors', sensors);
        }

        if ((value2 == 0) && (state2Changed)) {
            state2Changed = false;
        }
    });
});

server.listen(port, function() {
    console.log('Server running on http://localhost:' + port);
});
