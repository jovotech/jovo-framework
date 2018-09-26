'use strict';

/**
 *
 * @author Ruben Aegerter
 */

const http = require('http');
const fs = require('fs');
const util = require('../util');
const AlexaResponse = require('../platforms/alexaSkill/alexaResponse').AlexaResponse;
const GoogleActionResponse = require('../platforms/googleaction/googleActionResponse').GoogleActionResponse;
const GoogleActionResponseV2 = require('../platforms/googleaction/googleActionResponseV2').GoogleActionResponseV2;

let dbPath = './db/db.json';
let sessionAttributes = {};

/**
 * Defines a class with static functions for testing purpose.
 */
class TestSuite {

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
        if (!req) {
            return;
        }
        // only take the session attributes for intentRequest
        if (typeof req.setSessionAttribute === 'function') {
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
                    try {
                        result = JSON.parse(result);

                        if (res.statusCode === 400 && result.msg) {
                            reject(new Error(result.msg));
                            return;
                        }

                        let requestType = util.getRequestType(req);
                        if (requestType === 'GoogleActionDialogFlowRequest' ||
                            requestType === 'DialogFlowRequest') {
                            response = new GoogleActionResponse(result);
                        } else if (requestType === 'GoogleActionDialogFlowV2Request' ||
                            requestType === 'DialogFlowV2Request') {
                            response = new GoogleActionResponseV2(result, req.getSession());
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
                    } catch (e) {
                    }
                });
            }).on('error', (e) => {
                if (e.code === 'ECONNREFUSED') {
                    console.log();
                    console.log('Your server must be running for your tests to work.');
                    console.log();
                    console.log(e);
                    console.log();
                }
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
        if (!key || !value) {
            return;
        }
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
            util.makeDirRecursive('./db');
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
        // if no userId is passed, return all users
        if (!userId) {
            return users;
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
        // return undefined either if users.length is 0 or the given userId is not found
        return;
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

    /**
     * Removes session attributes.
     * @param {*} attr
     */
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

module.exports.send = TestSuite.send;
module.exports.getUserData = TestSuite.getUserData;
module.exports.addUserData = TestSuite.addUserData;
module.exports.addUser = TestSuite.addUser;
module.exports.removeUserData = TestSuite.removeUserData;
module.exports.removeUser = TestSuite.removeUser;
module.exports.removeSessionAttribute = TestSuite.removeSessionAttribute;
module.exports.removeSessionAttributes = TestSuite.removeSessionAttributes;
module.exports.setDbPath = TestSuite.setDbPath;
