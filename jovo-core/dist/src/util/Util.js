"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const https = require("https");
const path = require("path");
const _merge = require("lodash.merge");
const url = require("url");
class Util {
    /**
     * Console log helper
     *
     * Prints the file and line number where it has been called.
     * @param {number} pathDepth
     */
    static consoleLog(pathDepth = 1) {
        const _privateLog = console.log; // tslint:disable-line
        // tslint:disable-next-line:no-console
        console.log = (...msgs) => {
            // tslint:disable-line
            // tslint:disable-line
            if (pathDepth === -1) {
                return;
            }
            const newMessages = []; // tslint:disable-line
            let stack = new Error().stack.toString();
            stack = stack.substring(stack.indexOf('\n', 8) + 2);
            for (const msg of msgs) {
                stack = stack.substring(0, stack.indexOf('\n'));
                const matches = /\(([^)]+)\)/.exec(stack);
                if (matches) {
                    stack = matches[1].substring(matches[1].lastIndexOf(path.sep) + 1);
                    const filePathArray = matches[1].split(path.sep);
                    let filePath = '';
                    for (let i = filePathArray.length - pathDepth; i < filePathArray.length; i++) {
                        filePath += path.sep + filePathArray[i];
                    }
                    newMessages.push(filePath.substring(1), '\n');
                    newMessages.push(msg);
                }
            }
            // @ts-ignore
            _privateLog.apply(console, newMessages); // tslint:disable-line
        };
    }
    /**
     * Creates random string of length 7
     */
    static randomStr(length = 6) {
        return Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, length);
    }
    /**
     * Async delay helper
     * @param delayInMilliseconds
     */
    static delay(delayInMilliseconds) {
        return new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
    }
    /**
     * Returns random in a given range.
     * @param min
     * @param max
     */
    static randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static httpsPost(urlOrOptions, payload) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(payload);
            const options = {
                headers: {
                    'Content-Length': Buffer.byteLength(data),
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                port: '443',
            };
            if (typeof urlOrOptions === 'string') {
                const parsedUrl = url.parse(urlOrOptions);
                _merge(options, {
                    host: parsedUrl.host,
                    path: parsedUrl.path,
                });
            }
            else {
                _merge(options, urlOrOptions);
            }
            // Set up the request
            const req = https
                .request(options, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(rawData));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
                res.on('error', (e) => {
                    reject(e);
                });
            })
                .on('error', (e) => {
                reject(e);
            });
            // post the data
            req.write(data);
            req.end();
        });
    }
    static httpPost(urlOrOptions, payload) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(payload);
            const options = {
                headers: {
                    'Content-Length': Buffer.byteLength(data),
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                port: '80',
            };
            if (typeof urlOrOptions === 'string') {
                const parsedUrl = url.parse(urlOrOptions);
                _merge(options, {
                    host: parsedUrl.host,
                    path: parsedUrl.path,
                });
            }
            else {
                _merge(options, urlOrOptions);
            }
            // Set up the request
            const req = http
                .request(options, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(rawData));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
                res.on('error', (e) => {
                    reject(e);
                });
            })
                .on('error', (e) => {
                reject(e);
            });
            // post the data
            req.write(data);
            req.end();
        });
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map