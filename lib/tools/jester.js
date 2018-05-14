'use strict';

/**
 *
 * @author Ruben Aegerter
 */

const http = require('http');
const fs = require('fs');
const shelljs = require('shelljs');
const AlexaIntentRequest = require('../platforms/alexaSkill/request/intentRequest').IntentRequest;
const GoogleActionIntentRequest = require('../platforms/googleaction/request/googleActionDialogFlowRequest').GoogleActionDialogFlowRequest;
const AlexaResponse = require('../platforms/alexaSkill/alexaResponse').AlexaResponse;
const GoogleActionResponse = require('../platforms/googleaction/googleActionResponse').GoogleActionResponse;

let dbPath = './db/db.json';
let sessionAttributes = {};

/**
 * Defines a class with static functions for testing purpose.
 */
class Jester {

    /**
     * Set DbPath for FilePersistence.
     * @param {string} fileName
     */
    static setDbPath(fileName) {
        if (!fileName) {
            dbPath = './db/db.json';
        } else {
            dbPath = `./db/${fileName}.json`;
        }
    }

    /**
     * Method for chaining requests and sending them to localhost.
     * @param {object} req
     * @return {Promise<any>} for chaining
     */
    static send(req) {
        // if req is derived from requestObject, it has property _req
        if (req._req) {
            // only take the session attributes for intentRequest
            if (req._req.constructor === new AlexaIntentRequest().constructor ||
                req._req.constructor === new GoogleActionIntentRequest().constructor) {
                // if session is new, delete session attributes
                if (req.getSessionNew()) {
                    sessionAttributes = {};
                } else {
                    for (let sessionAttribute in sessionAttributes) {
                        if (sessionAttributes.hasOwnProperty(sessionAttribute)) {
                            req.setSessionAttribute(sessionAttribute,
                                sessionAttributes[sessionAttribute]);
                        }
                    }
                }
            }
            req = req._req;
        }

        let postData = JSON.stringify(req);

        let options = {
            host: 'localhost',
            port: 3000,
            path: '/webhook',
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            },
        };

        return new Promise((resolve, reject) => {
            let r = http.request(options, (res) => {
                res.setEncoding('utf8');
                let result = '';
                res.on('data', (data) => {
                    result += data;
                });
                res.on('end', () => {
                    let response;
                    result = JSON.parse(result);
                    if (req.originalRequest && req.originalRequest.source === 'google') {
                        response = new GoogleActionResponse(result);
                    } else {
                        response = new AlexaResponse(result);
                    }
                    if (response.hasSessionAttributes()) {
                        let attributes = response.getSessionAttributes();
                        for (let attr in attributes) {
                            if (attributes.hasOwnProperty(attr)) {
                                sessionAttributes[attr] = attributes[attr];
                            }
                        }
                    } else {
                        sessionAttributes = {};
                    }
                    resolve(response);
                });
            }).on('error', (e) => {
                reject(e);
            });
            r.write(postData);
            r.end();
        });
    }

    /**
     * Add user data.
     * @param {string} userId
     * @param {string} key
     * @param {string} value
     */
    static addUserData(userId, key, value) {
        let users;
        if (fs.existsSync(dbPath)) {
            users = JSON.parse(fs.readFileSync(dbPath));
        }
        if (!users) {
            users = [
                {
                    'userId': userId,
                    'userData': {
                        'data': {
                            [key]: value,
                        },
                        'metaData': {
                            'createdAt': '2018-04-25T11:50:07.140Z',
                            'lastUsedAt': '2018-04-25T12:00:19.032Z',
                            'sessionsCount': 0,
                        },
                    },
                },
            ];
        } else {
            // check if id is already included in user array
            for (let i = 0; i < users.length; i++) {
                if (users[i].userId === userId) {
                    users[i].userData.data[key] = value;
                    break;
                } else if (i + 1 === users.length) {
                    users.push(
                        {
                            'userId': userId,
                            'userData': {
                                'data': {
                                    [key]: value,
                                },
                                'metaData': {
                                    'createdAt': '2018-04-25T11:50:07.140Z',
                                    'lastUsedAt': '2018-04-25T12:00:19.032Z',
                                    'sessionsCount': 0,
                                },
                            },
                        }
                    );
                }
            }
        }
        if (!fs.existsSync('./db')) {
            shelljs.mkdir('-p', './db');
        }
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 4));
    }


    /**
     * Gets user data.
     * @param {string} userId
     * @param {string} key
     * @return {*}
     */
    static getUserData(userId, key) {
        let users;
        if (fs.existsSync(dbPath)) {
            users = readUserData(dbPath);
        }
        if (!users) {
            return;
        }
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId === userId) {
                if (key) {
                    return users[i].userData.data[key];
                } else {
                    return users[i].userData.data;
                }
            }
        }
    }

    /**
     * Removes user data. If key is not given, deletes all data for userId.
     * @param {string} userId
     * @param {string} key
     */
    static removeUserData(userId, key) {
        let users;
        if (fs.existsSync(dbPath)) {
            users = JSON.parse(fs.readFileSync(dbPath));
        }
        if (!users) {
            return;
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].userId === userId) {
                if (!key) {
                    users[i].userData.data = {};
                    users[i].userData.metaData.sessionsCount = 0;
                } else {
                    delete users[i].userData.data[key];
                }
            }
        }
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 4));
    }

    /**
     * Adds user.
     * TODO template user?
     * @param {object} user
     */
    static addUser(user) {
        if (!user) {
            return;
        }
        let users;
        if (fs.existsSync(dbPath)) {
            users = JSON.parse(fs.readFileSync(dbPath));
        }
        users.push(user);
        fs.writeFileSync(dbPath, JSON.stringify(users));
    }

    /**
     * Removes a whole user. If userId is not provided, all users will be deleted.
     * @param {string} userId
     */
    static removeUser(userId) {
        if (!userId) {
            fs.unlinkSync(dbPath);
            return;
        }
        let users;
        if (fs.existsSync(dbPath)) {
            users = JSON.parse(fs.readFileSync(dbPath));
        }
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId === userId) {
                delete users[i];
            }
        }
        fs.writeFileSync(dbPath, users);
    }

    static removeSessionAttribute(attr) {
        if (attr && sessionAttributes[attr]) {
            delete sessionAttributes[attr];
        }
    }

    /**
     * Remove Session Attributes.
     */
    static removeSessionAttributes() {
        sessionAttributes = {};
    }
}

/**
 * Workaround for async it() calls:
 *  Mocha it() registers tests to list-like object, so getUserData() reads data, when another send()
 *  writes data to the very same file.
 *  This method reads again and again, as long as a SyntaxError is thrown.
 * @param {string} path
 * @return {*}
 */
function readUserData(path) {
    try {
        return JSON.parse(fs.readFileSync(path));
    } catch (err) {
        return readUserData(path);
    }
}

/* ===============================================================
*  module.exports
*  ===============================================================
*/

let RequestBuilder = require('../util').getPlatformRequestBuilder();
module.exports.RequestBuilder = RequestBuilder;
module.exports.googleActionRequestBuilder = RequestBuilder[0];
module.exports.alexaRequestBuilder = RequestBuilder[1];

module.exports.send = Jester.send;
module.exports.getUserData = Jester.getUserData;
module.exports.addUserData = Jester.addUserData;
module.exports.addUser = Jester.addUser;
module.exports.removeUserData = Jester.removeUserData;
module.exports.removeUser = Jester.removeUser;
module.exports.removeSessionAttribute = Jester.removeSessionAttribute;
module.exports.removeSessionAttributes = Jester.removeSessionAttributes;
module.exports.setDbPath = Jester.setDbPath;
