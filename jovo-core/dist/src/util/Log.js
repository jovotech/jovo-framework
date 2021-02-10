"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncctx_1 = require("asyncctx");
const _merge = require("lodash.merge");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["NONE"] = -1] = "NONE";
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["VERBOSE"] = 3] = "VERBOSE";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * Prints to console and exits process.
 * @param {object} obj
 */
// tslint:disable-next-line:no-console
console.dd = (obj) => {
    // tslint:disable-line:no-console
    console.log(obj); // tslint:disable-line:no-console
    process.exit(0);
};
class Logger {
    constructor() {
        this.config = {
            appenderLength: 70,
            appenderOffset: '  ',
            appenderSymbol: '-',
            appenders: {},
            disableAsyncHooks: false,
            ignoreFormatting: false,
        };
        this.timeMap = {};
    }
    /**
     * Check, if LogLevel matches current LogLevel
     * @param {LogLevel} logLevel
     * @returns {boolean}
     */
    static isLogLevel(logLevel) {
        if (!process.env.JOVO_LOG_LEVEL) {
            return false;
        }
        const jovoLog = Number(process.env.JOVO_LOG_LEVEL);
        if (!isNaN(jovoLog)) {
            return logLevel <= jovoLog;
        }
        else {
            return (logLevel <=
                (Logger.getLogLevelFromString(process.env.JOVO_LOG_LEVEL || 'error') || LogLevel.ERROR));
        }
    }
    /**
     * Convert string LogLevel to enum LogLevel
     * @param {string} logLevelStr
     * @returns {LogLevel | undefined}
     */
    static getLogLevelFromString(logLevelStr) {
        logLevelStr = logLevelStr.toUpperCase();
        switch (logLevelStr) {
            case 'ERROR':
                return LogLevel.ERROR;
            case 'WARN':
                return LogLevel.WARN;
            case 'INFO':
                return LogLevel.INFO;
            case 'VERBOSE':
                return LogLevel.VERBOSE;
            case 'DEBUG':
                return LogLevel.DEBUG;
            default:
                return;
        }
    }
    /**
     * Used just by BaseApp to add the request to the context, if request tracking has been enabled.
     */
    setRequestContext(request) {
        if (this.cls) {
            this.cls.setContext(request);
        }
    }
    /**
     * Adds appender to Log instance
     */
    addAppender(name, appender) {
        this.config.appenders[name] = appender;
        if (appender.trackRequest) {
            this.activateRequestTracking();
        }
        return this;
    }
    /**
     * Remove specified appender
     * @param {string} name
     */
    removeAppender(name) {
        if (!this.config.appenders[name]) {
            throw new Error(`Can't remove non-existing appender.`);
        }
        delete this.config.appenders[name];
    }
    /**
     * Remove all appenders
     */
    removeAllAppenders() {
        this.config.appenders = {};
    }
    /**
     * Adds console appender to Log instance
     * @param options
     * @returns {this}
     */
    addConsoleAppender(options) {
        // tslint:disable-line
        const appender = {
            ignoreFormatting: false,
            logLevel: LogLevel.DEBUG,
            trackRequest: false,
            write: (logEvent, breakline = true) => {
                const msg = String(logEvent.msg) || '';
                if (logEvent.isFormat) {
                    process.stdout.write(msg);
                }
                else {
                    process.stdout.write(this.config.appenderOffset);
                    process.stdout.write(msg.split('\n').join('\n' + this.config.appenderOffset));
                    if (breakline) {
                        process.stdout.write('\n');
                    }
                }
            },
        };
        _merge(appender, options);
        return this.addAppender((options && options.name) || 'console', appender);
    }
    /**
     * Adds file appender to Log instance
     * @param {string} path
     * @param options
     * @returns {this}
     */
    addFileAppender(path, options) {
        // tslint:disable-line
        const appender = {
            ignoreFormatting: true,
            logLevel: LogLevel.DEBUG,
            stream: require('fs').createWriteStream(path, { flags: 'a' }),
            trackRequest: false,
            write: (logEvent, breakline = true) => {
                const msg = logEvent.msg || '';
                this.config.appenders.file.stream.write(msg);
                if (breakline) {
                    this.config.appenders.file.stream.write('\n');
                }
            },
        };
        _merge(appender, options);
        return this.addAppender((options && options.name) || 'file', appender);
    }
    /**
     * Adds data to output stream of all appenders.
     * @param {string} format
     * @returns {this}
     */
    addFormat(format) {
        Object.keys(this.config.appenders).forEach((key) => {
            const appender = this.config.appenders[key];
            if (appender.ignoreFormatting === false) {
                appender.write({
                    isFormat: true,
                    logLevel: LogLevel.NONE,
                    msg: format,
                });
            }
        });
        return this;
    }
    /**
     * Writes data to output stream of all appenders.
     * @param msg
     * @param {LogLevel} logLevel
     */
    writeToStreams(msg, logLevel, breakline = true) {
        Object.keys(this.config.appenders).forEach((key) => {
            const appender = this.config.appenders[key];
            if (appender.logLevel >= logLevel) {
                if (typeof msg === 'object') {
                    msg = JSON.stringify(msg).trim();
                    msg += '\b\b';
                }
                appender.write({
                    isFormat: false,
                    logLevel,
                    msg,
                    requestContext: this.cls ? this.cls.getContext() : undefined,
                }, breakline);
            }
        });
    }
    /**
     * Main log() method. Checks if the current LogLevel allows to write.
     * @param {LogLevel} logLevel
     * @param msg
     * @returns {this}
     */
    log(logLevel, msg) {
        if (!Logger.isLogLevel(logLevel)) {
            return this.clear();
        }
        this.writeToStreams(msg, logLevel);
        this.clear();
        return this;
    }
    /**
     * Print message, if the current LogLevel is ERROR
     * @param msg
     * @returns {this}
     */
    error(msg = '') {
        return this.log(LogLevel.ERROR, msg);
    }
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    errorStart(obj, printStart = false) {
        if (!Logger.isLogLevel(LogLevel.ERROR)) {
            return;
        }
        this.setTime(obj);
        if (printStart) {
            this.error(obj);
        }
    }
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    errorEnd(obj) {
        if (!Logger.isLogLevel(LogLevel.ERROR)) {
            return;
        }
        const msg = `${obj.toString()} (${this.getTime(obj)} ms)`;
        this.removeTime(obj);
        return this.error(msg);
    }
    /**
     * Print message, if the current LogLevel is WARN
     * @param msg
     * @returns {this}
     */
    warn(msg = '') {
        return this.log(LogLevel.WARN, msg);
    }
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    warnStart(obj, printStart = false) {
        if (!Logger.isLogLevel(LogLevel.WARN)) {
            return;
        }
        this.setTime(obj);
        if (printStart) {
            this.warn(obj);
        }
    }
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    warnEnd(obj) {
        if (!Logger.isLogLevel(LogLevel.WARN)) {
            return;
        }
        const msg = `${obj.toString()} (${this.getTime(obj)} ms)`;
        this.removeTime(obj);
        return this.warn(msg);
    }
    /**
     * Print message, if the current LogLevel is INFO
     * @param msg
     * @returns {this}
     */
    info(msg = '') {
        return this.log(LogLevel.INFO, msg);
    }
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    infoStart(obj, printStart = false) {
        if (!Logger.isLogLevel(LogLevel.INFO)) {
            return;
        }
        this.setTime(obj);
        if (printStart) {
            this.info(obj);
        }
    }
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    infoEnd(obj) {
        if (!Logger.isLogLevel(LogLevel.INFO)) {
            return;
        }
        const msg = `${obj.toString()} (${this.getTime(obj)} ms)`;
        this.removeTime(obj);
        return this.info(msg);
    }
    /**
     * Print message, if the current LogLevel is VERBOSE
     * @param msg
     * @returns {this}
     */
    verbose(msg = '') {
        return this.log(LogLevel.VERBOSE, msg);
    }
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    verboseStart(obj, printStart = false) {
        if (!Logger.isLogLevel(LogLevel.VERBOSE)) {
            return;
        }
        this.setTime(obj);
        if (printStart) {
            this.verbose(obj);
        }
    }
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    verboseEnd(obj) {
        if (!Logger.isLogLevel(LogLevel.VERBOSE)) {
            return;
        }
        const msg = `${obj.toString()} (${this.getTime(obj)} ms)`;
        this.removeTime(obj);
        return this.verbose(msg);
    }
    /**
     * Print message, if the current LogLevel is DEBUG
     * @param msg
     * @returns {this}
     */
    debug(msg = '') {
        return this.log(LogLevel.DEBUG, msg);
    }
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    debugStart(obj, printStart = false) {
        if (!Logger.isLogLevel(LogLevel.DEBUG)) {
            return;
        }
        this.setTime(obj);
        if (printStart) {
            this.debug(obj);
        }
    }
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    debugEnd(obj) {
        if (!Logger.isLogLevel(LogLevel.DEBUG)) {
            return;
        }
        const msg = `${obj.toString()} (${this.getTime(obj)} ms)`;
        this.removeTime(obj);
        return this.debug(msg);
    }
    /**
     * Remove time from temporary object.
     * @param obj
     */
    removeTime(obj) {
        const key = obj.toString();
        if (this.timeMap[key]) {
            delete this.timeMap[key];
        }
    }
    /**
     * Set time to instance object
     * @param obj
     */
    setTime(obj) {
        const key = obj.toString();
        this.timeMap[key] = new Date().getTime();
    }
    /**
     * Return time difference between start* and end*
     * @param obj
     * @returns {number}
     */
    getTime(obj) {
        const key = obj.toString();
        const now = new Date().getTime();
        if (!this.timeMap[key]) {
            return -1;
        }
        return now - this.timeMap[key];
    }
    /**
     * Header formatting
     * @param {string} header
     * @param {string} module
     * @returns {string}
     */
    header(header, module) {
        header = header ? header : '';
        module = module ? ' (' + module + ')' : '';
        this.bold();
        let str = header + module + ' ';
        for (let i = 0; i < this.config.appenderLength - (header.length + module.length); i++) {
            str += this.config.appenderSymbol;
        }
        return '\n' + str + '\n';
    }
    /**
     * Subheader formatting
     * @param {string} subheader
     * @param {string} module
     * @returns {string}
     */
    subheader(subheader, module) {
        subheader = subheader ? subheader : '';
        module = module ? ' (' + module + ')' : '';
        let str = this.config.appenderOffset + '-- ' + subheader + module + ' ';
        for (let i = 0; i < this.config.appenderLength - (subheader.length + module.length); i++) {
            str += this.config.appenderSymbol;
        }
        return '\n' + str + '\n';
    }
    /**
     * Clear formatting.
     * @returns {this}
     */
    clear() {
        return this.addFormat('\x1b[0m');
    }
    /**
     * Add underscore.
     * @returns {this}
     */
    underscore() {
        return this.addFormat('\x1b[4m');
    }
    /**
     * Add bold.
     * @returns {this}
     */
    bold() {
        return this.addFormat('\x1b[1m');
    }
    /**
     * Add dim.
     * @returns {this}
     */
    dim() {
        return this.addFormat('\x1b[2m');
    }
    /**
     * Add blink.
     * @returns {this}
     */
    blink() {
        return this.addFormat('\x1b[5m');
    }
    /**
     * Add reverse.
     * @returns {this}
     */
    reverse() {
        return this.addFormat('\x1b[7m');
    }
    /**
     * Add hidden.
     * @returns {this}
     */
    hidden() {
        return this.addFormat('\x1b[8m');
    }
    /**
     * Add black.
     * @returns {this}
     */
    black() {
        return this.addFormat('\x1b[30m');
    }
    /**
     * Add red.
     * @returns {this}
     */
    red() {
        return this.addFormat('\x1b[31m');
    }
    /**
     * Add green.
     * @returns {this}
     */
    green() {
        return this.addFormat('\x1b[32m');
    }
    /**
     * Add yellow.
     * @returns {this}
     */
    yellow() {
        return this.addFormat('\x1b[33m');
    }
    /**
     * Add blue.
     * @returns {this}
     */
    blue() {
        return this.addFormat('\x1b[34m');
    }
    /**
     * Add magenta.
     * @returns {this}
     */
    magenta() {
        return this.addFormat('\x1b[35m');
    }
    /**
     * Add cyan.
     * @returns {this}
     */
    cyan() {
        return this.addFormat('\x1b[36m');
    }
    /**
     * Add white.
     * @returns {this}
     */
    white() {
        return this.addFormat('\x1b[37m');
    }
    /**
     * Add blackBackground.
     * @returns {this}
     */
    blackBackground() {
        return this.addFormat('\x1b[40m');
    }
    /**
     * Add redBackground.
     * @returns {this}
     */
    redBackground() {
        return this.addFormat('\x1b[41m');
    }
    /**
     * Add greenBackground.
     * @returns {this}
     */
    greenBackground() {
        return this.addFormat('\x1b[42m');
    }
    /**
     * Add yellowBackground.
     * @returns {this}
     */
    yellowBackground() {
        return this.addFormat('\x1b[43m');
    }
    /**
     * Add blueBackground.
     * @returns {this}
     */
    blueBackground() {
        return this.addFormat('\x1b[44m');
    }
    /**
     * Add magentaBackground.
     * @returns {this}
     */
    magentaBackground() {
        return this.addFormat('\x1b[45m');
    }
    /**
     * Add cyanBackground.
     * @returns {this}
     */
    cyanBackground() {
        return this.addFormat('\x1b[46m');
    }
    /**
     * Add whiteBackground.
     * @returns {this}
     */
    whiteBackground() {
        return this.addFormat('\x1b[47m');
    }
    /**
     * Prints to console and exits process.
     * @param {object} obj
     */
    dd(obj) {
        console.log(obj); // tslint:disable-line:no-console
        process.exit(0);
    }
    /**
     * Activates request tracking, allowing getRequestContext() to be used.
     */
    activateRequestTracking() {
        if (!this.cls && !this.config.disableAsyncHooks) {
            this.cls = new asyncctx_1.ContinuationLocalStorage();
        }
    }
}
exports.Logger = Logger;
exports.Log = new Logger().addConsoleAppender(); // tslint:disable-line
//# sourceMappingURL=Log.js.map