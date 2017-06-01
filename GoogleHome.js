'use strict';

const GoogleHome = class {

    constructor(request, response) {
        this.request = request;
        this.response = response;

        this.responseObj = {
            speech : "<speak></speak>",
            contextOut : []
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
        let attribute = {};
        attribute["name"] = name;
        attribute["lifespan"] = 10000; //TODO: check max
        attribute["parameters"][name] = value;


        this.responseObj.contextOut.push(
            attribute
        );
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


    addSimpleCard (responseObj, title, content ) {
        let basicCard = {
            basicCard : {
                title : title,
                formattedText : content
            }
        };

        responseObj.data.google.rich_response.items.push(basicCard);

        return responseObj;
    }

    addImageCard (responseObj, title, content, image_url) {
        let basicCard = {
            basicCard : {
                title : title,
                formattedText : content,
                image: {
                    url: image_url,
                    accessibilityText: title
                    },
            }
        };

        responseObj.data.google.rich_response.items.push(basicCard);
        return responseObj;
    }


    addBasicCard (responseObj, title, formattedText ) {

        let basicCard = {
            basicCard : {
                title : title,
                formattedText : formattedText,
                // image: {
                //     url: "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                //     accessibilityText: "Image alternate text"
                //     },
            }
        };

        responseObj.data.google.rich_response.items.push(basicCard);

        return responseObj;

    }



};


module.exports.GoogleHome = GoogleHome;