/**
 * Created by Alex on 26-May-17.
 */
'use strict';

var request = require('request');
const API_URL = "https://api.jovo.tech";

const SoftAccountLinking = class {

    constructor(options) {
        this.token = options.token;
        this.skillId = options.skillId;

    }

    activate(pin, user_skill_id, callback) {
        var data = {
            skill_id : this.skillId,
            user_skill_id : user_skill_id,
            pin : pin
        };

        this.post('/authentication/pins/activate',
            data,
            callback)
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


module.exports.SoftAccountLinking = SoftAccountLinking;