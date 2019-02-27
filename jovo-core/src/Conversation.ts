import * as http from 'http';
import * as fs from 'fs';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import * as crypto from "crypto";

import * as util from "util";
import * as path from 'path';
import {TestSuite} from "./TestSuite";
import {JovoRequest, JovoResponse, SessionData} from "./Interfaces";
import {RequestOptions} from "http";

const fsunlink = util.promisify(fs.unlink);
const fsexists = util.promisify(fs.exists);
const fsreadFile = util.promisify(fs.readFile);
const fswriteFile = util.promisify(fs.writeFile);

export interface ConversationConfig {
    userId?: string;
    locale?: string;
    defaultDbDirectory?: string;
    deleteDbOnSessionEnded?: boolean;
    httpOptions?: RequestOptions;
}

export class Conversation {
    testSuite: TestSuite;
    sessionData: SessionData = {};

    $user = {
        $data: {},
        $metaData: {},
    };

    config: ConversationConfig = {
        userId: randomUserId(),
        locale: 'en-US',
        defaultDbDirectory: './db/tests/',
        deleteDbOnSessionEnded: false,
        httpOptions: {
            host: 'localhost',
            port: process.env.JOVO_PORT || 3000,
            path: '/webhook',
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'jovo-test': 'true'
            },
        },
    };


    constructor(testSuite: TestSuite, config?: ConversationConfig) {
        this.testSuite = testSuite;
        if (config) {
            this.config = _merge(this.config, config);
        }

    }

    applyToRequest(req: JovoRequest): void {
        req.setUserId(this.config.userId || randomUserId());
        req.setTimestamp(new Date().toISOString());
        if (this.config.locale) {
            req.setLocale(this.config.locale);
        }

    }

    /**
     * Prepares post data, returns response
     * @param {JovoRequest} req
     * @returns {Promise<JovoResponse>}
     */
    async send(req: JovoRequest): Promise<JovoResponse> {

        this.applyToRequest(req);
        await this.saveUserData();

        if (req.isNewSession()) {
            this.clearSession();
        } else if(Object.keys(this.sessionData).length > 0) {
            req.setSessionData(this.sessionData);
        }

        const postData = JSON.stringify(req.toJSON());

        try {
            const response = await Conversation.httpRequest(postData, this.config.httpOptions || {});
            const jovoResponse = this.testSuite.responseBuilder.create(JSON.parse(response));
            this.sessionData = jovoResponse.getSessionData() || {};
            await this.updateUserData();
            if (this.config.deleteDbOnSessionEnded === true && jovoResponse.hasSessionEnded()) {
                this.clearDb();
            }
            return jovoResponse;

        } catch (e) {
            throw e;
        }
    }

    /**
     * Clears session data for this conversation object
     */
    clearSession(): void {
        this.sessionData = {};
    }

    /**
     * Resets conversation. Clears database and session
     * @returns {Promise<void>}
     */
    async reset(): Promise<void> {
        this.clearSession();
        await this.clearDb();
    }

    /**
     * Deletes filedb jsonf ile
     * @returns {Promise<void>}
     */
    async clearDb() {
        const pathToDb = path.join(this.config.defaultDbDirectory!, this.config.userId + '.json');
        const exists = await fsexists(pathToDb);
        if (!exists) {
            throw new Error(`Can't find ${pathToDb}`);
        }

        await fsunlink(pathToDb);
    }

    /**
     * Saves conversation.$data and conversation.$metaData to file db json.
     * @returns {Promise<void>}
     */
    private async saveUserData() {
        if (Object.keys(this.$user.$data).length > 0 || Object.keys(this.$user.$metaData).length > 0) {
            const userDataObj = {
                userData: {
                    data: this.$user.$data,
                    metaData: this.$user.$metaData
                }
            };

            const pathToDb = path.join(this.config.defaultDbDirectory!, this.config.userId!  + '.json');
            await fswriteFile(pathToDb, JSON.stringify(userDataObj, null, '\t'));
        }
    }

    /**
     * Updates conversation.$data and conversation.$meta from file db json.
     * @returns {Promise<void>}
     */
    private async updateUserData() {
        const pathToDb = path.join(this.config.defaultDbDirectory!, this.config.userId!  + '.json');
        const dbExists = await fsexists(pathToDb);

        if (dbExists) {
            const fileContent = await fsreadFile(pathToDb);
            const parsedContent = JSON.parse(fileContent.toString());
            this.$user.$data = _get(parsedContent, 'userData.data');
        }
    }

    /**
     * Post request to the separately running jovo voice app instance
     * @param {string} postData
     * @param {RequestOptions} options
     * @returns {Promise<any>}
     */
    private static httpRequest(postData: string, options: RequestOptions): Promise<any> { //tslint:disable-line
        return new Promise((resolve, reject) => {
            const request = http.request(options, (res) => {
                res.setEncoding('utf8');
                let result = '';
                res.on('data', (data) => {
                    result += data;
                });
                res.on('end', () => {
                    resolve(result);
                });
            }).on('error', (e: Error) => {
                if (_get(e, 'code') === 'ECONNREFUSED') {
                                console.log();
                                console.log('Your server must be running for your tests to work.');
                                console.log();
                                console.log(e);
                                console.log();
                            }
                reject(e);
            });
            request.write(postData);
            request.end();
        });
    }

}

/**
 * Generates random user id
 * @returns {string}
 */
function randomUserId(): string {
    return Math.random().toString(36).substring(7);
}

/**
 * Generates projectUserid from the current folder
 * @returns {string}
 */
function projectUserId(): string {
    return `testuser-${crypto.createHash('md5').update(__dirname).digest("hex")}`;
}
