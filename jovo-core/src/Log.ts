import * as path from "path";

export enum LogLevel {
    ERROR = 0, // red().bold()
    WARN= 1, // yellow().bold()
    INFO = 2, //
    VERBOSE = 3, // yellow()
    DEBUG = 4, // yellow()
}

export class Log {

    static OFFSET = '    ';
    static APPENDER_LENGTH = 70;
    static APPENDER_SYMBOL = '-';

    static timeMap: {[key: string]: number} = {};


    static header(header?: string, module?: string) {
        if (!header) {
            header = '';
        }

        if (!module) {
            module = '';
        } else {
            module = ' ('+module+')';
        }

        let str = Log.OFFSET  + '\x1b[1m' + header + module + ' ';

        for (let i = 0; i < Log.APPENDER_LENGTH - (header.length+module.length); i++) {
            str += Log.APPENDER_SYMBOL;
        }
        return '\n\b\b' + str + '\n';
    }

    static subheader(subheader?: string, module?: string) {
        if (!subheader) {
            subheader = '';
        }

        if (!module) {
            module = '';
        } else {
            module = ' ('+module+')';
        }

        const str = Log.OFFSET  + '\x1b[1m' + subheader + module + ': ';
        return '\b\b\b' + str + '\n';
    }

    static end() {
        process.stdout.write('\b\b');
        return Log;
    }

    static underscore() {
        process.stdout.write('\x1b[4m');
        return Log;
    }

    static bold() {
        process.stdout.write('\x1b[1m');
        return Log;
    }

    static dim() {
        process.stdout.write('\x1b[2m');
        return Log;
    }

    static blink() {
        process.stdout.write('\x1b[5m');
        return Log;
    }

    static reverse() {
        process.stdout.write('\x1b[7m');
        return Log;
    }

    static hidden() {
        process.stdout.write('\x1b[8m');
        return Log;
    }


    static black() {
        process.stdout.write('\x1b[30m');
        return Log;
    }

    static red() {
        process.stdout.write('\x1b[31m');
        return Log;
    }

    static green() {
        process.stdout.write('\x1b[32m');
        return Log;
    }

    static yellow() {
        process.stdout.write('\x1b[33m');
        return Log;
    }

    static blue() {
        process.stdout.write('\x1b[34m');
        return Log;
    }

    static magenta() {
        process.stdout.write('\x1b[35m');
        return Log;
    }

    static cyan() {
        process.stdout.write('\x1b[36m');
        return Log;
    }

    static white() {
        process.stdout.write('\x1b[37m');
        return Log;
    }


    static blackBackground() {
        process.stdout.write('\x1b[40m');
        return Log;
    }

    static redBackground() {
        process.stdout.write('\x1b[41m');
        return Log;
    }

    static greenBackground() {
        process.stdout.write('\x1b[42m');
        return Log;
    }

    static yellowBackground() {
        process.stdout.write('\x1b[43m');
        return Log;
    }

    static blueBackground() {
        process.stdout.write('\x1b[44m');
        return Log;
    }

    static magentaBackground() {
        process.stdout.write('\x1b[45m');
        return Log;
    }

    static cyanBackground() {
        process.stdout.write('\x1b[46m');
        return Log;
    }

    static whiteBackground() {
        process.stdout.write('\x1b[47m');
        return Log;
    }

    static isLogLevel(logLevel: LogLevel) {
        if (!process.env.JOVO_LOG_LEVEL) {
            return false;
        }

        try {
            const jovoLog = Number(process.env.JOVO_LOG_LEVEL);
            return logLevel <= jovoLog;
        } catch (e) {
            return logLevel <= (Log.getLogLevelFromString(process.env.JOVO_LOG_LEVEL || 'error') || LogLevel.ERROR);
        }


    }

    static setTime(obj: any) { // tslint:disable-line
        const key = obj.toString();
        Log.timeMap[key] = new Date().getTime();
    }

    static getTime(obj: any): number { // tslint:disable-line
        const key = obj.toString();
        const now = new Date().getTime();

        if (!Log.timeMap[key]) {
            console.log('No start for ' + key);
            return -1;
        }

        return now - Log.timeMap[key];
    }


    static log(logLevel: LogLevel, msg: any) { // tslint:disable-line
        if (!Log.isLogLevel(logLevel)) {
            process.stdout.write('\x1b[0m');
            return;
        }
        process.stdout.write(Log.OFFSET);
        process.stdout.write(msg + '\n');
        process.stdout.write('\x1b[0m');
        process.stdout.write('');

        return Log;

    }

    static errorStart(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.ERROR)) {
            return;
        }
        Log.setTime(obj);
    }

    static errorEnd(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.ERROR)) {
            return;
        }
        const msg = `${obj.toString()} (${Log.getTime(obj)} ms)`;
        return Log.error(msg);
    }

    static error(obj?: any) { // tslint:disable-line
        if (!obj) {
            obj = '';
        }
        return Log.log(LogLevel.ERROR, obj);
    }


    static warnStart(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.WARN)) {
            return;
        }
        Log.setTime(obj);
    }

    static warnEnd(obj: any) { // tslint:disable-line
        if (Log.isLogLevel(LogLevel.WARN)) {
            return;
        }
        const msg = `${obj.toString()} (${Log.getTime(obj)} ms)`;
        return Log.warn(msg);
    }
    static warn(obj?: any) { // tslint:disable-line
        if (!obj) {
            obj = '';
        }
        return Log.log(LogLevel.WARN, obj);
    }


    static infoStart(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.INFO)) {
            return;
        }
        return Log.setTime(obj);
    }

    static infoEnd(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.INFO)) {
            return;
        }
        const msg = `${obj.toString()} (${Log.getTime(obj)} ms)`;
        return Log.info(msg);
    }

    static info(obj?: any) { // tslint:disable-line
        if (!obj) {
            obj = '\n';
        }
        Log.log(LogLevel.INFO, obj);
    }

    static verboseStart(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.VERBOSE)) {
            return;
        }
        Log.setTime(obj);
    }

    static verboseEnd(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.VERBOSE)) {
            return;
        }
        const msg = `${obj.toString()} (${Log.getTime(obj)} ms)`;
        return Log.verbose(msg);
    }

    static verbose(obj?: any) { // tslint:disable-line
        if (!obj) {
            obj = '';
        }
        return Log.log(LogLevel.VERBOSE, obj);
    }


    static debugStart(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.DEBUG)) {
            return;
        }
        Log.setTime(obj);
    }

    static debugEnd(obj: any) { // tslint:disable-line
        if (!Log.isLogLevel(LogLevel.DEBUG)) {
            return;
        }
        const msg = `${obj.toString()} (${Log.getTime(obj)} ms)`;
        Log.debug(msg);
    }
    static debug(obj?: any) { // tslint:disable-line
        if (!obj) {
            obj = '';
        }
        return Log.log(LogLevel.DEBUG, obj);
    }

    static getLogLevelFromString(logLevelStr: string): LogLevel | undefined {
        logLevelStr = logLevelStr.toUpperCase();

        switch (logLevelStr) {
            case 'ERROR': return LogLevel.ERROR;
            case 'WARN': return LogLevel.WARN;
            case 'INFO': return LogLevel.INFO;
            case 'VERBOSE': return LogLevel.VERBOSE;
            case 'DEBUG': return LogLevel.DEBUG;
            default: return;
        }
    }

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

}
