'use strict';
const _ = require('lodash');
const BaseApp = require('./../../app');
const https = require('https');

/**
 * Implementation of Chatbase's analytics module
 */
class Chatbase {

    /**
     * Constructor
     * @param {*} config
     * @param {Jovo.PLATFORM_ENUM} platformType Alexa Skill or Google Action
     */
    constructor(config, platformType) {
        this.apiKey= _.get(config, 'key');
        this.appVersion = _.get(config, 'version');
        this.platformType = platformType;
    };

  buildMessages(app, platform, session_id, time_stamp, message) {
                var slots = [];
    var intentSlots = app.getInputs();
    var intentName = "";
    let user_id = app.getUserId();

    if (app.handler.route.type === "INTENT") {
      if (intentSlots) {
        for (var name in intentSlots) {
                        var value = intentSlots[name].value;
                        slots.push(`${name}: ${value}`);
                    }
        intentName = app.handler.route.intent;
        message = intentName + "\n" + slots.join("\n");
                }
            } else {
      intentName = app.handler.route.type;
            }

    const data = {
      messages: [
        {
                api_key: this.apiKey,
          type: "user",
          user_id,
          time_stamp,
          platform,
                intent: intentName,
                message,
          not_handled: app.handler.route.path.endsWith("Unhandled"),
                version: this.appVersion,
          session_id
            },
            {
                api_key: this.apiKey,
          type: "agent",
          user_id,
                time_stamp: Date.now(),
          platform,
          message,
                version: this.appVersion,
          session_id
            }
      ]
    };

            return data;
  }

  /**
   * Creates the data object from an Alexa request needed for the API request
   * @param {Object} app jovo app object
   * @return {object} data needed to submit the message
   */
  createChatbaseDataAlexa(app) {
    if (app.alexaSkill().getRequest().session) {
      // Uses intent name if available, else request type (LaunchRequest)

      let responseMessage = "";

      let outputSpeech = app.alexaSkill().getResponse().responseObj.response
        .outputSpeech;

      if (outputSpeech.type === "SSML") {
        responseMessage = outputSpeech.ssml.replace(/<[^>]*>/g, "");
      } else {
        responseMessage = outputSpeech.text;
      }

      let time_stamp = Date.parse(
        app.alexaSkill().getRequest().request.timestamp
      );

      return this.buildMessages(
        app,
        "Alexa",
        app.alexaSkill().getRequest().session.sessionId,
        time_stamp,
        responseMessage
      );
        } else {
            return null;
        }
  }

    /**
     * Creates the data object from a Google Action request needed for the API request
     * @param {Object} app jovo app object
     * @return {object} data needed to submit the message
     */
    createChatbaseDataGoogleAction(app) {
    let sessionId = "";
    if (
      app.googleAction().getRequest().constructor.name ===
      "GoogleActionDialogFlowRequest"
    ) {
            sessionId = app.googleAction().getRequest().sessionId;
    } else if (
      app.googleAction().getRequest().constructor.name ===
      "GoogleActionDialogFlowV2Request"
    ) {
      sessionId = app.googleAction().getRequest().originalDetectIntentRequest
        .payload.conversation.conversationId;
        }
        const data = {
            api_key: this.apiKey,
      type: "user",
            user_id: app.googleAction().getUserId(),
            time_stamp: Date.now(),
      platform: "Actions",
            intent: app.googleAction().getIntentName(),
            version: this.appVersion,
      session_id: sessionId
        };
        return data;
  }

    /**
     * Send data to Chatbase API
     * @param {object} data
     */
    sendDataToChatbase(data) {
        if (data) {
            var multiple = data.messages !== undefined;

            const objectAsString = JSON.stringify(data);
            const options = {
        host: "chatbase.com",
        path: multiple ? "/api/messages" : "/api/message",
        method: "POST",
                headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(objectAsString)
        }
            };
      const httpRequest = https.request(options, res => {
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);
        let data = "";

        res.on("data", d => {
                      data += d;
                    process.stdout.write(d);
                  });

        res.on("end", () => {
                      console.info(data);
                  });
            });
      httpRequest.on("error", function(error) {
        console.error("Error while logging to Chatbase Services", error);
            });
            httpRequest.end(objectAsString);
        }
    }

    /**
     * Calls the Chatbase API
     * @param {Jovo} app jovo app object
     */
    track(app) {
    const data =
      this.platformType === BaseApp.PLATFORM_ENUM.ALEXA_SKILL
        ? this.createChatbaseDataAlexa(app)
        : this.createChatbaseDataGoogleAction(app);
        this.sendDataToChatbase(data);
  }
}

/**
 * Chatbase Alexa Analytics
 */
class ChatbaseAlexa extends Chatbase {
    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        super(config, BaseApp.PLATFORM_ENUM.ALEXA_SKILL);
    }
}

/**
 * Chatbase GoogleAction Analytics
 */
class ChatbaseGoogleAction extends Chatbase {
    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        super(config, BaseApp.PLATFORM_ENUM.GOOGLE_ACTION);
    }
}

module.exports.ChatbaseAlexa = ChatbaseAlexa;
module.exports.ChatbaseGoogleAction = ChatbaseGoogleAction;
