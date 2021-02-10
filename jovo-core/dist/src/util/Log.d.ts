import { Host } from '../Interfaces';
export declare enum LogLevel {
    NONE = -1,
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    VERBOSE = 3,
    DEBUG = 4
}
export interface Config {
    appenderLength: number;
    appenderSymbol: string;
    appenderOffset: string;
    ignoreFormatting: boolean;
    appenders: {
        [key: string]: Appender;
    };
    /**
     * Set to true to disable async hooks.
     * They're used to give certain appenders access to the request object,
     * and are only enabled if appenders that use them are added.
     * Activating them incurs a ~10-15% hit to performance, which is why this option
     * to disable them is given.
     */
    disableAsyncHooks: boolean;
}
export interface LogEvent {
    msg: string;
    logLevel: LogLevel;
    isFormat: boolean;
    requestContext?: Host;
}
export interface Appender {
    ignoreFormatting: boolean;
    logLevel: LogLevel;
    trackRequest: boolean;
    [key: string]: any;
    /**
     * Write method for the LogEvent object
     * @param logEvent
     * @param breakline
     */
    write(logEvent: LogEvent, breakline?: boolean): void;
}
export declare class Logger {
    /**
     * Check, if LogLevel matches current LogLevel
     * @param {LogLevel} logLevel
     * @returns {boolean}
     */
    static isLogLevel(logLevel: LogLevel): boolean;
    /**
     * Convert string LogLevel to enum LogLevel
     * @param {string} logLevelStr
     * @returns {LogLevel | undefined}
     */
    static getLogLevelFromString(logLevelStr: string): LogLevel | undefined;
    config: Config;
    private timeMap;
    private cls?;
    /**
     * Used just by BaseApp to add the request to the context, if request tracking has been enabled.
     */
    setRequestContext(request: Host): void;
    /**
     * Adds appender to Log instance
     */
    addAppender(name: string, appender: Appender): this;
    /**
     * Remove specified appender
     * @param {string} name
     */
    removeAppender(name: string): void;
    /**
     * Remove all appenders
     */
    removeAllAppenders(): void;
    /**
     * Adds console appender to Log instance
     * @param options
     * @returns {this}
     */
    addConsoleAppender(options?: any): this;
    /**
     * Adds file appender to Log instance
     * @param {string} path
     * @param options
     * @returns {this}
     */
    addFileAppender(path: string, options?: any): this;
    /**
     * Adds data to output stream of all appenders.
     * @param {string} format
     * @returns {this}
     */
    addFormat(format: string): this;
    /**
     * Writes data to output stream of all appenders.
     * @param msg
     * @param {LogLevel} logLevel
     */
    writeToStreams(msg: string | object, logLevel: LogLevel, breakline?: boolean): void;
    /**
     * Main log() method. Checks if the current LogLevel allows to write.
     * @param {LogLevel} logLevel
     * @param msg
     * @returns {this}
     */
    log(logLevel: LogLevel, msg: string | object): this;
    /**
     * Print message, if the current LogLevel is ERROR
     * @param msg
     * @returns {this}
     */
    error(msg?: string | object): this;
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    errorStart(obj: string | object, printStart?: boolean): void;
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    errorEnd(obj: string | object): this | undefined;
    /**
     * Print message, if the current LogLevel is WARN
     * @param msg
     * @returns {this}
     */
    warn(msg?: string | object): this;
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    warnStart(obj: string | object, printStart?: boolean): void;
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    warnEnd(obj: string | object): this | undefined;
    /**
     * Print message, if the current LogLevel is INFO
     * @param msg
     * @returns {this}
     */
    info(msg?: string | object): this;
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    infoStart(obj: string | object, printStart?: boolean): void;
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    infoEnd(obj: string | object): this | undefined;
    /**
     * Print message, if the current LogLevel is VERBOSE
     * @param msg
     * @returns {this}
     */
    verbose(msg?: string | object): this;
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    verboseStart(obj: string | object, printStart?: boolean): void;
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    verboseEnd(obj: string | object): this | undefined;
    /**
     * Print message, if the current LogLevel is DEBUG
     * @param msg
     * @returns {this}
     */
    debug(msg?: string | object): this;
    /**
     * Start timer for the specified object name.
     * @param obj
     * @param {boolean} printStart
     */
    debugStart(obj: string | object, printStart?: boolean): void;
    /**
     * Stop timer and print the duration.
     * @param obj
     */
    debugEnd(obj: string | object): this | undefined;
    /**
     * Remove time from temporary object.
     * @param obj
     */
    removeTime(obj: string | object): void;
    /**
     * Set time to instance object
     * @param obj
     */
    setTime(obj: string | object): void;
    /**
     * Return time difference between start* and end*
     * @param obj
     * @returns {number}
     */
    getTime(obj: string | object): number;
    /**
     * Header formatting
     * @param {string} header
     * @param {string} module
     * @returns {string}
     */
    header(header?: string, module?: string): string;
    /**
     * Subheader formatting
     * @param {string} subheader
     * @param {string} module
     * @returns {string}
     */
    subheader(subheader?: string, module?: string): string;
    /**
     * Clear formatting.
     * @returns {this}
     */
    clear(): this;
    /**
     * Add underscore.
     * @returns {this}
     */
    underscore(): this;
    /**
     * Add bold.
     * @returns {this}
     */
    bold(): this;
    /**
     * Add dim.
     * @returns {this}
     */
    dim(): this;
    /**
     * Add blink.
     * @returns {this}
     */
    blink(): this;
    /**
     * Add reverse.
     * @returns {this}
     */
    reverse(): this;
    /**
     * Add hidden.
     * @returns {this}
     */
    hidden(): this;
    /**
     * Add black.
     * @returns {this}
     */
    black(): this;
    /**
     * Add red.
     * @returns {this}
     */
    red(): this;
    /**
     * Add green.
     * @returns {this}
     */
    green(): this;
    /**
     * Add yellow.
     * @returns {this}
     */
    yellow(): this;
    /**
     * Add blue.
     * @returns {this}
     */
    blue(): this;
    /**
     * Add magenta.
     * @returns {this}
     */
    magenta(): this;
    /**
     * Add cyan.
     * @returns {this}
     */
    cyan(): this;
    /**
     * Add white.
     * @returns {this}
     */
    white(): this;
    /**
     * Add blackBackground.
     * @returns {this}
     */
    blackBackground(): this;
    /**
     * Add redBackground.
     * @returns {this}
     */
    redBackground(): this;
    /**
     * Add greenBackground.
     * @returns {this}
     */
    greenBackground(): this;
    /**
     * Add yellowBackground.
     * @returns {this}
     */
    yellowBackground(): this;
    /**
     * Add blueBackground.
     * @returns {this}
     */
    blueBackground(): this;
    /**
     * Add magentaBackground.
     * @returns {this}
     */
    magentaBackground(): this;
    /**
     * Add cyanBackground.
     * @returns {this}
     */
    cyanBackground(): this;
    /**
     * Add whiteBackground.
     * @returns {this}
     */
    whiteBackground(): this;
    /**
     * Prints to console and exits process.
     * @param {object} obj
     */
    dd(obj: object): void;
    /**
     * Activates request tracking, allowing getRequestContext() to be used.
     */
    private activateRequestTracking;
}
export declare const Log: Logger;
