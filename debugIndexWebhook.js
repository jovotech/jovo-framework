'use strict';


// initialize express server for webhook functionality
let express = require('express')
let bodyParser = require('body-parser');
let server = express();
server.use(bodyParser.json());


const Jovo = require('./Jovo').Jovo;

const app = new Jovo();


server.listen(3000, function () {
    console.log('Example server listening on port 3000!')
})

// listen for post requests
server.post('/webhook/voice', function (req, res) {

    app.initWebhook(req, res, handlers);
    app.setSlotMap(slotMap);
    // app.setIntentMap(intentMap);
    app.logRequest();
    app.execute();

});




let slotMap = {
    'given-name' : 'name'
};

let intentMap = {
    'NameIntent' : 'HelpIntent'
};


let handlers = {

    "LAUNCH" : function() {
        // app.toState("onboarding").ask("Hey! What is your name?", "Your name please?");
        // app.ask("hey","ho");
        // app.tell("hey").addGoogleAssistantBasicCard();//.withCard("title","subtitle","content");
        app.tell("hey123");
    },


    "END" : function() {
        // clean up
        console.log(app.getEndReason());

        app.tell("bye");

    },

    "HelloWorldIntent" : function() {
      app.tell("hey hey");
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
        // app.setAttribute("name", app.getSlotValue("name"));
        app.tell("Hey").withCard("title", "subtitle","content");
        // console.log(app.getSlotValue("name"));

        // app.tell('<amazon:effect name="whispered">hi '+app.getSlotValue('name')+'. I am watching you.</amazon:effect>.');
        // app.play("https://www.swetlow.de/meinruf_nitdeiner2.mp3","Something bla");

        // app.send("Kommt das an? Bin zu faul in die Logs zu schauen.", function(body) {
        //    console.log(body);
        //     app.tell("yo");
        // });
        // app.tell('<speak>My name is <break time="500ms"/> ' + app.getSlotValue('name') + '</speak>');
        // app.goTo("HelpIntent",'state');
        // app.getSocketIO().emit('event', { name: app.getSlotValue("name") });
        // app.tell("hey");
        // app.sayNothingEndSession();
    },


    "state" : {
        "HelpIntent" : function() {
            app.tell("test");
        }
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

};