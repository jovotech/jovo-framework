'use strict';


// initialize express server for webhook functionality


const app = require("../index").App;
const webhook = require("../index").Webhook;


webhook.listen(3000, function () {
    console.log('Example server listening on port 3000!')
});


// listen for post requests
webhook.post('/webhook/voice', function (req, res) {
    app.initWebhook(req, res, handlers);
    app.setInputMap({"given-name" : "name"});
    // app.setIntentMap(intentMap);
    app.logRequest();
    app.execute();

});


let handlers = {

    "LAUNCH" : function() {
        app.tell("with card").withSimpleCard("title","content");

        // let standardCard = app.alexa().getCardBuilder()
        //     .createStandardCard("Pizza is love", "Pizza is life", "https://www.swetlow.de/pizzaSmall.jpg", "https://www.swetlow.de/pizzaLarge.jpg" ).build();

        // console.log(standardCard);
        //
        // app.tell("with image card").withImageCard("Pizza is love", "Pizza is life", "https://www.swetlow.de/pizzaSmall.jpg");



        // app.ask("What's your name?","Name?")
        //     .addSessionAttribute("foo","bar")
        //     .addSessionAttribute("hello","world");
            // .addSessionAttribute("foo","bar")
            // .addSessionAttribute("hello","world");


        // app.goTo("TestTellInput","tests");
        // app.goTo("TestTellSlot","tests", app.getSlotValue("name"));

        // app.toState("onboarding").ask("Hey! What is your name?", "Your name please?");
        // app.ask("hey","ho");
        // app.tell("hey").addGoogleAssistantBasicCard();//.withCard("title","subtitle","content");
        // app.tell("hey123").addAssistantBasicCard("title", "formattedText");

        // app.tell("hey ho").addAssistantBasicCard("title", "formattedText");
        //     app.ask("What's your name?", "Your name please.");

        // app.response = "bla";
        // app.goTo("HelloWorldIntent");
    },


    "END" : function() {
        // clean up
        console.log(app.getEndReason());

        // app.tell("bye");

    },

    "HelloWorldIntent" : function() {
        // app.tell("hey hey").addAssistantBasicCard("title", "formattedText");
        app.ask("What's your name?","Name?")
            .addSessionAttribute("foo","bar")
            .addSessionAttribute("hello","world");

    },

    "PinActivate" : function() {
        app.linking(function(body) {
            app.tell("Linked!");
        });
    },


    "NameIntent" : function() {

        app.tell("with card").withSimpleCard("title","content");
        // app.tell("with image card").withImageCard("Pizza is love", "Pizza is life", "https://www.swetlow.de/pizzaSmall.jpg");
        //



        // console.log(app.alexa().getCardBuilder().createStandardCard("title", "content", "smallimage","largeimage"));

        // app.goTo("TestTell","tests");
        // console.log(app.getSessionAttributes());

        // app.tell("with card").withSimpleCard("title","subtitle","content");

        // app.goTo("TestTellInput","tests", app.getInput("name"));


        // let speech = app.speechBuilder()
        //     .addText("hey")
        //     .addBreak("500ms")
        //     .addAudio("https://www.swetlow.de/meinruf_nitdeiner2.mp3")
        //     .addText("yoyoyo")
        //     .build();

        // app.tell("hey " + app.getSessionAttribute("foo"));

        // app.ask("Hey " + app.getSlotValue("name"), "bla");


        // app.setAttribute("name", app.getSlotValue("name"));
        // app.tell("Hey").addAssistantBasicCard("title", "formattedText");//.addCard("title", "subtitle","content");
        // console.log(app.getSlotValue("name"));
        // app.tell("hey ho")
        //     .addSimpleCard("Hey " + app.getSlotValue("name"),
        //                     "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.");
        //
        //
        // app.tell("hey ho").addAlexaSimpleCard("title","subtitle", "content","content");
        //
        // app.tell("hey ho").addImageCard("Hey " + app.getSlotValue("name"), "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        //     "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png");

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

    "tests" : {

        "TestTell" : function () {
            app.tell("test tell");
        },

        "TestTellInput" : function (arg) {
            app.tell("test tell slot " + arg);
        },

        'TestPlay' : function () {
            app.play("https://www.swetlow.de/meinruf_nitdeiner2.mp3","Something bla");
        }



    },

};