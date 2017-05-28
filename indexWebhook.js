'use strict';

var express = require('express')
    , bodyParser = require('body-parser');

var server = express();

server.use(bodyParser.json());



var app = require('./jovo');
var http = require( "http" ).createServer( server );
var io = require( "socket.io" )( http );
http.listen(8080, "127.0.0.1");


server.post('/webhook/voice', function (req, res) {

    app.initWebhook(req.body, res, handlers, slotMap);
    app.setSocketIO(io);
    app.execute();
    //

})
server.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
    console.log('a user connected');
});

server.listen(3000, function () {
  console.log('Example server listening on port 3000!')
})


var slotMap = {
    'given-name' : 'name'
};


var handlers = {

    "LAUNCH" : function() {
        app.toState("onboarding").ask("Hey! What is your name?", "Your name please?");

    },

    "END" : function() {
        // clean up


    },

    "PinActivate" : function() {
       app.linking(function(body) {
            app.tell("Linked!");
       });
    },

    "HelpIntent" : function() {
        app.tell("Help Intent");
    },


    "NameIntent" : function() {
        app.setAttribute("name", app.getSlotValue("name"));
        app.ask("Hey");

        app.getSocketIO().emit('event', { name: app.getSlotValue("name") });
    },



    "onboarding" : {
        "NameIntent" : function() {
            app.setAttribute("name", app.getSlotValue("name"));
            app.toState("onboarding").ask("Hey " + app.getAttribute('name') + ". How old are you?", "I didn't get your age. Please repeat");
            app.getSocketIO().emit('event', { name: app.getSlotValue("name") });
            },

        "AgeIntent" : function() {
            app.setAttribute("age", app.getSlotValue("age"));
            app.toState("onboarding").ask("Where are you from?","I didnt't get that. Where are you from?");
        },
        "LocationIntent" : function() {
            app.setAttribute("location", app.getSlotValue("location"));

            var name = app.getAttribute("name");
            var age = app.getAttribute("age");
            var location = app.getAttribute("location");

            app.tell("Hey " + name + "! You are " + age + " years old. You are from " + location);

        }
    },

    "start_game" : {

        "StartGame" : function () {
            app.tell("BLA");


        },

    },



}