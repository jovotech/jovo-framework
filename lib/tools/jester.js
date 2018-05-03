'use strict';

/**
 *
 * @author Ruben Aegerter
 */

const request = require('request');
const fs = require('fs');
const AlexaResponse = require('../platforms/alexaSkill/alexaResponse').AlexaResponse;
const GoogleActionResponse = require('../platforms/googleaction/googleActionResponse').GoogleActionResponse;

const UserObjects = require('./UserObjects');
const DefaultUser = UserObjects.DefaultUser;

const url = 'https://webhook.jovo.cloud/1ec8cb17-ff88-4840-8c01-625521934acb';
const dbPath = './db/db.json';
let sessionAttributes = {};

/**
 *
 */
class Jester {

    /**
     * Method for chaining requests and sending them to localhost.
     * @param req the request object
     * @return {Promise<any>} for chaining
     */
    static send(req) {
        if (req._req) {
            req = req._req;
        }
        if (Object.keys(sessionAttributes).length > 0) {
            req.session.attributes = sessionAttributes;
        }

        let options = {
            method: 'POST',
            url: url,
            timeout: 2000,
            json: req
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log('hello');
                        if (body.sessionAttributes && Object.keys(body.sessionAttributes).length > 0) {
                            let attributes = body.sessionAttributes;
                            for (let attr in attributes) {
                                sessionAttributes[attr] = attributes[attr];
                            }
                        } else {
                            // if no session attributes exist, none should be saved
                            sessionAttributes = {};
                        }
                        if (req.originalRequest && req.originalRequest.source === 'google') {
                            resolve(new GoogleActionResponse(body));
                        } else {
                            resolve(new AlexaResponse(body));
                        }
                    }
                }
            )
            ;
        });
    }

    /**
     * Add user data for local testing.
     * @param name the key the data is stored by
     * @param value the data that is stored
     * @param index indicates the user, if there is multiple
     * @return {Jester} for chaining
     */
    static addUserData(name, value, index) {
        let user = JSON.parse(fs.readFileSync(dbPath));
        if (!user) {
            user = [{
                "userId": "amzn1.account.AM3B00000000000000000000000",
                "userData": {
                    "data": {},
                    "metaData": {
                        "createdAt": "2018-04-25T11:50:07.140Z",
                        "lastUsedAt": "2018-04-25T12:00:19.032Z",
                        "sessionsCount": 0
                    }
                }
            }];
        }
        user[!index ? 0 : index].userData.data[name] = value;
        fs.writeFileSync(dbPath, JSON.stringify(user));
        return this;
    }

    /**
     *
     * @param name
     * @param index
     * @return {*}
     */
    static getUserData(name, index) {
        let user = JSON.parse(fs.readFileSync(dbPath));
        if (!user) {
            return;
        }
        return user[index ? 0 : index].userData.data[name];
    }

    /**
     * Remove specific user data.
     * @param name
     * @param index
     * @return {Jester}
     */
    static removeUserData(name, index) {
        let user = JSON.parse(fs.readFileSync(dbPath));
        if (!user) {
            return this;
        }

        if (!name) {
            user[0].userData.data = {};
            user[0].userData.metaData.sessionsCount = 0;
        } else {
            delete user[!index ? 0 : index].userData.data[name];
        }

        fs.writeFileSync(dbPath, JSON.stringify(user));
        return this;
    }

    /**
     *
     * @param user
     * @return {*}
     */
    static addUser(user) {
        if (!user) {
            return;
        }
        let userFile = fs.readFileSync(dbPath);
        userFile.push(user);
        return this;
    }

    /**
     *
     * @param index
     * @return {Jester}
     */
    static removeUser(index) {
        if (!index) {
            fs.unlinkSync(dbPath);
            return this;
        }
        let user = fs.readFileSync(dbPath);
        delete user[index];
        fs.writeFileSync(dbPath, user);
        return this;
    }
}

let RequestBuilder = require('../util').getPlatformRequestBuilder();

module.exports.send = Jester.send;
module.exports.addUserData = Jester.addUserData;
module.exports.getUserData = Jester.getUserData;
module.exports.removeUserData = Jester.removeUserData;
module.exports.removeUser = Jester.removeUser;
module.exports.RequestBuilder = RequestBuilder;
module.exports.googleActionRequestBuilder = RequestBuilder[0];
module.exports.alexaRequestBuilder = RequestBuilder[1];