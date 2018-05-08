'use strict';

/**
 *
 * @author Ruben Aegerter
 */

const http = require('http');
const fs = require('fs');
const AlexaResponse = require('../platforms/alexaSkill/alexaResponse').AlexaResponse;
const GoogleActionResponse = require('../platforms/googleaction/googleActionResponse').GoogleActionResponse;

const dbPath = './db/db.json';
let sessionAttributes = {};

/**
 * Defines a class with static functions for testing purpose.
 */
class Jester {

    /**
     * Method for chaining requests and sending them to localhost.
     * @param req
     * @return {Promise<any>} for chaining
     */
    static send(req) {
        for (let sessionAttribute in sessionAttributes) {
            if (sessionAttributes.hasOwnProperty(sessionAttribute)) {
                req.setState(sessionAttributes[sessionAttribute]);
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
        let user;
        if (fs.existsSync(dbPath)) {
            user = JSON.parse(fs.readFileSync(dbPath));
        }
        if (!user) {
            user = [
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
            for (let i = 0; i < user.length; i++) {
                if (user[i].userId === userId) {
                    user[i].userData.data[name] = value;
                    break;
                } else if (i + 1 === user.length) {
                    user.push(
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
        fs.writeFileSync(dbPath, JSON.stringify(user, null, 4));
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

        fs.writeFileSync(dbPath, JSON.stringify(user, null, 4));
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
