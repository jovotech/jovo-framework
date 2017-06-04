'use strict';

const GoogleHome = class {

    constructor(request, response) {
        this.request = request;
        this.response = response;

        this.responseObj = {
            speech : "<speak></speak>",
            contextOut : this.request.result.contexts
        }

    }


    /*******************************************************
     *
     * Platform specific functions
     *
     ************************************/

    /**
     * Returns request JSON sent by alexa
     * @returns {Alexa.request}
     */

    request() {
        return this.request;
    }


    /*******************************************************
     *
     * JOVO wrapper functions
     *
     ************************************/


    /**
     * Returns unique user id
     *
     * @returns {string} UserId
     */

    getUserId () {
        return ""; //TODO
    }

    /**
     * Returns intent name
     */

    getIntentName () {
        return this.request.result.metadata.intentName;
    }

    /**
     * Returns request type
     *
     * LaunchRequest, IntentRequest SessionEndedRequest
     *
     */

    getRequestType() {
        if (this.request.result.resolvedQuery === "GOOGLE_ASSISTANT_WELCOME") {
            return "LaunchRequest";
        }

        return "IntentRequest";
    }


    /**
     * TODO: possible with GoogleHome?
     *
     * @returns {*}
     */

    getEndReason() {
        return "DUMMY"
    }

    /**
     * Returns object with name => value objects
     *
     * {
     *   inputame1 : value1,
     *   inputname2 : value2
     * }
     *
     * @returns {{}}
     */

    getInputs () {
        return this.request.result.parameters;
    }


    /**
     * Get input object by name
     * @param name
     * @returns {*}
     */
    getInput (name) {
        return this.getInputs()[name];
    }

    /**
     * Returns type of platform
     * @returns {string}
     */

    getType () {
        return "GoogleHome";
    }


    /**
     * Returns state value stored in the request session
     *
     * @returns {*}
     */

    getState () {
        if(typeof(this.request.contexts) === "undefined") {
            return null;
        }
        for (let i = 0; i < this.request.contexts.length; i++) {
            let context = this.request.contexts[i];

            if(typeof(context["name"]) !== "undefined" && context["name"] === 'state') {
                return context["parameters"]["state"];
            }

        }
        return null;
    }

    /*************************************************************
     *
     * RESPONSE BUILDER FUNCTIONS
     *
     */



    /**
     * Stores state in response object session
     *
     * @param state
     */

    setState (state) {
        this.responseObj.contextOut.push(
            {
                'name' : "state",
                lifespan : 1,
                parameters : {
                    "state" : state,
                }
            }
        );

    }

    setSessionAttribute (name, value) {


        // iterate context objects
        let existingSessionContext = false;
        for(let i = 0; i < this.responseObj.contextOut.length; i++) {

            //find session context
            if(this.responseObj.contextOut[i].name === "session") {
                this.responseObj.contextOut[i].parameters[name] = value;
                existingSessionContext = true;
            }
        }

        if(existingSessionContext === false) {

            let sessionContext = {};
            sessionContext["name"] = "session";
            sessionContext["lifespan"] = 10000; //TODO: check max
            sessionContext["parameters"] = {};
            sessionContext["parameters"][name] = value;
            this.responseObj.contextOut.push(
                sessionContext
            );

        }
     }

    getSessionAttribute (name) {

        for(let i = 0; i < this.responseObj.contextOut.length; i++) {

            //find session context
            if(this.responseObj.contextOut[i].name === "session") {
                return this.responseObj.contextOut[i].parameters[name];
            }
        }

    }



    getSessionAttributes () {
        for(let i = 0; i < this.responseObj.contextOut.length; i++) {

            //find session context
            if(this.responseObj.contextOut[i].name === "session") {
                return this.responseObj.contextOut[i].parameters;
            }
        }
        return {};
    }


    /**
     *
     * Sets speech output with ShouldEndSession = true
     *
     * @param speech
     */


    tell  (speech) {

        this.responseObj.speech = speech;
        this.responseObj.data = {
            google : {
                expect_user_response: false,
                rich_response: {
                    items: [
                        {
                            simpleResponse: {
                                ssml: speech
                            }
                        }
                    ]
                }

            }
        };

        return this.responseObj;
    }

    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @param audio_url
     * @returns {*}
     */


    play (audio_url, fallbackText) {
        let speech = '<speak> <audio src="'+audio_url+'">' + fallbackText + '</audio></speak>';
        return this.tell(speech);
    }




    ask (speech, repromptSpeech) {
        this.responseObj.speech = speech;

        this.responseObj.data = {
                google : {
                    expectUserResponse: true,
                    rich_response: {
                        items: [
                            {
                                simpleResponse: {
                                    ssml: speech
                                }
                            }
                        ]
                    },
                    noInputPrompts: [
                        {
                            ssml: repromptSpeech
                        }
                    ]
                }

        };
        return this.responseObj;
    }


    getResponseObject() {
        return this.responseObj;
    }


    // tell (speech, repromptSpeech) {
    //     console.log("bla")
    //
    //     let responseObj = {
    //         speech : speech,
    //         data : {
    //             google : {
    //                     // expectUserResponse: false,
    //                 "expect_user_response": true,
    //                 "rich_response": {
    //                     "items": [
    //                         {
    //                             "simpleResponse": {
    //                                 "textToSpeech":"This is the first simple response for a basic card"
    //                             }
    //                         },
    //
    //                         // {
    //                         //     "basicCard": {
    //                         //         "title":"Title: this is a title",
    //                         //         "formattedText":"This is a basic card.  Text in a\n      basic card can include \"quotes\" and most other unicode characters\n      including emoji 📱.  Basic cards also support some markdown\n      formatting like *emphasis* or _italics_, **strong** or __bold__,\n      and ***bold itallic*** or ___strong emphasis___ as well as other things\n      like line  \nbreaks",
    //                         //         "subtitle":
    //                         //             "This is a subtitle",
    //                         //         "image": {
    //                         //             "url":"https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
    //                         //             "accessibilityText":"Image alternate text"
    //                         //         },
    //                         //         "buttons": [
    //                         //             {
    //                         //                 "title":"This is a button",
    //                         //                 "openUrlAction":{
    //                         //                     "url":"https://assistant.google.com/"
    //                         //                 }
    //                         //             }
    //                         //         ]
    //                         //     }
    //                         // },
    //                         {
    //                             "simpleResponse": {
    //                                 "textToSpeech":"This is the 2nd simple response ",
    //                                 "displayText":"This is the 2nd simple response"
    //                             }
    //                         }
    //                     ],
    //                     "suggestions":
    //                         [
    //                             {"title":"Basic Card"},
    //                             {"title":"List"},
    //                             {"title":"Carousel"},
    //                             {"title":"Suggestions"}
    //                         ]
    //                 }
    //
    //             }
    //
    //         }
    //
    //     };
    //     if(typeof(this.contextOut) !== "undefined") {
    //         responseObj.contextOut = this.contextOut;
    //     }
    //     return responseObj;
    // }


    withSimpleCard (title, formattedText ) {
        this.responseObj.data.google.rich_response.items.push(new CardBuilder().createBasicCard(title, formattedText).build());
        return this.responseObj;
    }

    withImageCard (title, formattedText, imageUrl ) {
        this.responseObj.data.google.rich_response.items.push(new CardBuilder().createImageCard(title, formattedText, imageUrl, title).build());
        return this.responseObj;
    }




};


module.exports.GoogleHome = GoogleHome;


const CardBuilder = class {

    constructor() {
        this.card = {};
    }

    createBasicCard(title, formattedText) {
        this.card = {
            basicCard : {
                title : title,
                formattedText : formattedText,
            }
        };
        return this;
    }

    createImageCard(title, formattedText, imageUrl, accessibilityText) {
        this.card = {
            basicCard : {
                title : title,
                formattedText : formattedText,
                image: {
                    url: imageUrl,
                    accessibilityText: accessibilityText
                },
            }
        };

        return this;
    }

    build() {
        return this.card;
    }

};