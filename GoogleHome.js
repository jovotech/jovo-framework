'use strict';

const GoogleHome = class {

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    getIntentName () {
        return this.request.result.metadata.intentName;
    }

    getRequestType() {
        if (this.request.result.resolvedQuery === "GOOGLE_ASSISTANT_WELCOME") {
            return "LaunchRequest";
        }

        return "IntentRequest";
    }

    getSlots () {
        return this.request.result.parameters;
    }

    getState () {
        if(typeof(this.contexts) === "undefined") {
            return null;
        }
        for (let i = 0; i < this.contexts.length; i++) {
            let context = this.contexts[i];

            if(typeof(context["name"]) !== "undefined" && context["name"] === 'state') {
                return context["parameters"]["state"];
            }

        }
        return null;
    }

    setState (state) {
        this.contextOut = [
            {
                'name' : "state",
                lifespan : 1,
                parameters : {
                    "state" : state,
                }
            }
        ]

    }

    getSlot (name) {
        return this.getSlots()[name];
    }


    getSlotValue (name) {
        return this.getSlot(name).value;
    }

    // tell  (speech) {
    //
    //     let responseObj = {
    //         speech : speech,
    //         displayText : "blabla"
    //     };
    //     if(typeof(this.contextOut) !== "undefined") {
    //         responseObj.contextOut = this.contextOut;
    //     }
    //     return responseObj;
    // }

    play (audio_url, fallbackText) {
        let speech = '<speak> <audio src="'+audio_url+'">' + fallbackText + '</audio></speak>';
        return this.tell(speech);
    }

    ask (speech, repromptSpeech) {


        let responseObj = {
            speech : speech,
            data : {
                google : {
                    expectUserResponse: true,
                    noInputPrompts: [ {
                        textToSpeech : repromptSpeech
                    }
                    ]
                }

            }

        };
        if(typeof(this.contextOut) !== "undefined") {
            responseObj.contextOut = this.contextOut;
        }
        return responseObj;
    }

    tell (speech, repromptSpeech) {
        console.log("bla")

        let responseObj = {
            speech : speech,
            data : {
                google : {
                        // expectUserResponse: false,
                    "expect_user_response": true,
                    "rich_response": {
                        "items": [
                            {
                                "simpleResponse": {
                                    "textToSpeech":"This is the first simple response for a basic card"
                                }
                            },
                            {
                                "basicCard": {
                                    "title":"Title: this is a title",
                                    "formattedText":"This is a basic card.  Text in a\n      basic card can include \"quotes\" and most other unicode characters\n      including emoji 📱.  Basic cards also support some markdown\n      formatting like *emphasis* or _italics_, **strong** or __bold__,\n      and ***bold itallic*** or ___strong emphasis___ as well as other things\n      like line  \nbreaks",
                                    "subtitle":
                                        "This is a subtitle",
                                    "image": {
                                        "url":"https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                                        "accessibilityText":"Image alternate text"
                                    },
                                    "buttons": [
                                        {
                                            "title":"This is a button",
                                            "openUrlAction":{
                                                "url":"https://assistant.google.com/"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "simpleResponse": {
                                    "textToSpeech":"This is the 2nd simple response ",
                                    "displayText":"This is the 2nd simple response"
                                }
                            }
                        ],
                        "suggestions":
                            [
                                {"title":"Basic Card"},
                                {"title":"List"},
                                {"title":"Carousel"},
                                {"title":"Suggestions"}
                            ]
                    }

                }

            }

        };
        if(typeof(this.contextOut) !== "undefined") {
            responseObj.contextOut = this.contextOut;
        }
        return responseObj;
    }


    addBasicCard () {


        let responseObj

        // let responseObj = {
        //     "conversationToken": "{\"state\":null,\"data\":{}}",
        //     "expectUserResponse": true,
        //     "expectedInputs": [
        //         {
        //             "inputPrompt": {
        //                 "richInitialPrompt": {
        //                     "items": [
        //                         {
        //                             "simpleResponse": {
        //                                 "textToSpeech": "Math and prime numbers it is!"
        //                             }
        //                         },
        //                         {
        //                             "basicCard": {
        //                                 "title": "Math & prime numbers",
        //                                 "formattedText": "42 is an even composite number. It \n      is composed of three distinct prime numbers multiplied together. It \n      has a total of eight divisors. 42 is an abundant number, because the \n      sum of its proper divisors 54 is greater than itself. To count from \n      1 to 42 would take you about twenty-one…",
        //                                 "image": {
        //                                     "url": "https://www.google.com/search?q=42",
        //                                     "accessibilityText": "Image alternate text"
        //                                 },
        //                                 "buttons": []
        //                             }
        //                         }
        //                     ],
        //                     "suggestions": []
        //                 }
        //             },
        //             "possibleIntents": [
        //                 {
        //                     "intent": "actions.intent.TEXT"
        //                 }
        //             ]
        //         }
        //     ]
        // };
        return responseObj;
        };



    emptyResponse () {
        return {
            speech : "<speak></speak>",
        };
    }

    getType () {
        return "GoogleHome";
    }

};


module.exports.GoogleHome = GoogleHome;