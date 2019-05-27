import * as path from "path";
import {RequestOptions} from "https";
import _merge = require('lodash.merge');
import * as url from 'url';
import * as https from "https";
import * as http from "http";

export class Util {

    /**
     * Console log helper
     *
     * Prints the file and line number where it has been called.
     * @param {number} pathDepth
     */
    static consoleLog(pathDepth = 1) {
        const _privateLog:Function = console.log;
        console.log = (...msgs: any[]) => { // tslint:disable-line
            if (pathDepth === -1) {
                return;
            }
            const newMessages: any[] = []; // tslint:disable-line
            let stack: string = (new Error()).stack!.toString();
            stack = stack.substring(stack.indexOf('\n', 8) + 2);

            for (const msg of msgs) {
                stack = stack.substring(0, stack.indexOf('\n'));
                const matches = /\(([^)]+)\)/.exec(stack);

                if (matches) {
                    stack = matches[1].substring(matches[1].lastIndexOf(path.sep) + 1);
                    const filePathArray = matches[1].split(path.sep);
                    let filePath = '';

                    for (let i = filePathArray.length-pathDepth; i < filePathArray.length; i++) {
                        filePath += path.sep + filePathArray[i];
                    }

                    newMessages.push(filePath.substring(1), '\n');
                    newMessages.push(msg);
                }
            }
            _privateLog.apply(console, newMessages); // eslint-disable-line
        };
    }

    /**
     * Creates random string of length 7
     */
    static randomStr(length = 6) {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
    }

    /**
     * Async delay helper
     * @param delayInMilliseconds
     */
    static delay(delayInMilliseconds: number) {
        return new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
    }

    /**
     * Returns random in a given range.
     * @param min
     * @param max
     */
    static randomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Post https
     * @param options
     * @param payload
     */
    static httpsPost(options: RequestOptions, payload: object): void;
    static httpsPost(url: string, payload: object): void;
    static httpsPost(urlOrOptions: string | RequestOptions, payload: object) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(payload);
            const options = {
                port: '443',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            if (typeof urlOrOptions === 'string') {
                const parsedUrl = url.parse(urlOrOptions);

                _merge(options, {
                    host: parsedUrl.host,
                    path: parsedUrl.path
                });

            } else {
                _merge(options, urlOrOptions);
            }


            // Set up the request
            const req = https.request(options, (res) => {
                res.setEncoding('utf8');

                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });

                res.on('end', () => {
                    resolve(res);
                });

                res.on('error',  (e) => {
                    reject(e);
                });
            }).on('error', (e) => {
                reject(e);
            });

            // post the data
            req.write(data);
            req.end();

        });
    }
    /**
     * Post http
     * @param options
     * @param payload
     */
    static httpPost(options: RequestOptions, payload: object): void;
    static httpPost(url: string, payload: object): void;
    static httpPost(urlOrOptions: string | RequestOptions, payload: object) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(payload);
            const options = {
                port: '80',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            if (typeof urlOrOptions === 'string') {
                const parsedUrl = url.parse(urlOrOptions);

                _merge(options, {
                    host: parsedUrl.host,
                    path: parsedUrl.path
                });

            } else {
                _merge(options, urlOrOptions);
            }

            // Set up the request
            const req = http.request(options, (res) => {
                res.setEncoding('utf8');

                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });

                res.on('end', () => {
                    resolve(res);
                });

                res.on('error',  (e) => {
                    reject(e);
                });
            }).on('error', (e) => {
                reject(e);
            });

            // post the data
            req.write(data);
            req.end();

        });
    }
}
