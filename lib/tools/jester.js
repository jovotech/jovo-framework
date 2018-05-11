'use strict';

/**
 *
 * @author Ruben Aegerter
 */

const http = require('http');
const fs = require('fs');
const shelljs = require('shelljs');
const AlexaResponse = require('../platforms/alexaSkill/alexaResponse').AlexaResponse;
const GoogleActionResponse = require('../platforms/googleaction/googleActionResponse').GoogleActionResponse;

let dbPath = './db/db.json';
let sessionAttributes = {};

/**
 * Defines a class with static functions for testing purpose.
 */
class Jester {

    /**
     * Set path for local db file.
     * @param fileName
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
     * @param req
     * @return {Promise<any>} for chaining
     */
    static send(req) {
        for (let sessionAttribute in sessionAttributes) {
            if (sessionAttributes.hasOwnProperty(sessionAttribute)) {
                req.setSessionAttribute(sessionAttributes[sessionAttribute]);
            }
        }

        if (req._req) {
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
     * Add user data for local testing.
     * @param name the key the data is stored by
     * @param value the data that is stored
     * @param index indicates the user, if there is multiple
     * @return {Jester} for chaining
     */
    static addUserData(userId, name, value) {
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
                            [name]: value,
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
                    users[i].userData.data[name] = value;
                    break;
                } else if (i + 1 === users.length) {
                    users.push(
                        {
                            'userId': userId,
                            'userData': {
                                'data': {
                                    [name]: value,
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
        return this;
    }

    /**
     *
     * @param name
     * @param index
     * @return {*}
     */
    static getUserData(userId, key) {
        let users;
        if (fs.existsSync(dbPath)) {
            users = JSON.parse(fs.readFileSync(dbPath));
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
        return;
    }

    /**
     * Remove user data.
     * @param userId
     * @param key
     * @returns {Jester}
     */
    static removeUserData(userId, key) {
        let users;
        if (fs.existsSync(dbPath)) {
            users = JSON.parse(fs.readFileSync(dbPath));
        }
        if (!users) {
            return this;
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
        let users;
        if (fs.existsSync(dbPath)) {
            users = JSON.parse(fs.readFileSync(dbPath));
        }
        users.push(user);
        fs.writeFileSync(dbPath, JSON.stringify(users));
        return this;
    }

    /**
     *
     * @param index
     * @return {Jester}
     */
    static removeUser(userId) {
        if (!userId) {
            fs.unlinkSync(dbPath);
            return this;
        }
        let users;
        if (fs.existsSync(dbPath)) {
            users = JSON.parse(fs.readFileSync(dbPath));
        }
        for (let i = 0; i < users.lenth; i++) {
            if (users[i].userId === userId) {
                delete users[i];
            }
        }
        fs.writeFileSync(dbPath, users);
        return this;
    }
}

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
module.exports.setDbPath = Jester.setDbPath;
