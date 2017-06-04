/**
 * Created by Alex on 26-May-17.
 */
'use strict';

var request = require('request');
const API_URL = "https://api.jovo.tech";

const MessengerBot = class {

    constructor(options) {
        this.token = options.token;
        this.skillId = options.skillId;

    }

    sendMessage(msg, callback, user_skill_id)  {
        let data = {
            skill_id : this.skillId,
            user_skill_id : user_skill_id,
            message : msg
        };


        this.post('/messenger/send', data, callback);

    }

    post(path, data, callback) {
        request(
            {
                url: API_URL+path,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer "+this.token,
                },
                method: "POST",
                json: data
            }, function(error, response, body) {
                callback(body);
            }
        );
    }


};


module.exports.MessengerBot = MessengerBot;