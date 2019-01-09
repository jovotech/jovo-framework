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

    config: ConversationConfig = {
        userId: randomUserId(),
        locale: 'en-US',
        defaultDbDirectory: './db/tests/',
        deleteDbOnSessionEnded: true,
        httpOptions: {
            host: 'localhost',
            port: 3000,
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
    }

    async send(req: JovoRequest): Promise<JovoResponse> {
        this.applyToRequest(req);
        if (req.isNewSession()) {
            this.sessionData = {};
        } else if(Object.keys(this.sessionData).length > 0) {
            req.setSessionData(this.sessionData);
        }

        const postData = JSON.stringify(req.toJSON());

        try {
            const response = await Conversation.httpRequest(postData, this.config.httpOptions || {});
            const jovoResponse = this.testSuite.responseBuilder.create(JSON.parse(response));
            this.sessionData = jovoResponse.getSessionData() || {};
            if (this.config.deleteDbOnSessionEnded === true && jovoResponse.hasSessionEnded()) {
                // this.clearDb();
            }
            return jovoResponse;

        } catch (e) {
            throw e;
        }
    }

    clearSession(): void {
        this.sessionData = {};
    }

    async reset(): Promise<void> {
        this.clearSession();
        await this.clearDb();
    }

    async clearDb() {
        const pathToDb = path.join(this.config.defaultDbDirectory!, this.config.userId + '.json');
        const exists = await fsexists(pathToDb);
        if (!exists) {
            throw new Error(`Can't find ${pathToDb}`);
        }

        await fsunlink(pathToDb);
    }

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

function randomUserId(): string {
    return Math.random().toString(36).substring(7);
}

function projectUserId(): string {
    return `testuser-${crypto.createHash('md5').update(__dirname).digest("hex")}`;
}
