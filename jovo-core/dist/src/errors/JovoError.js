"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../util/Log");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["ERR"] = "ERR";
    ErrorCode["ERR_PLUGIN"] = "ERR_PLUGIN";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
class JovoError extends Error {
    constructor(message, code = ErrorCode.ERR, module, details, hint, seeMore) {
        super(message);
        this.code = ErrorCode.ERR;
        this.module = module;
        this.details = details;
        this.hint = hint;
        this.code = code;
        this.seeMore = seeMore;
    }
    /**
     * Prints JovoError instance in an uniformed style.
     * @param {JovoError} e
     */
    static printError(e) {
        Log_1.Log.red().error(Log_1.Log.header('Error'));
        if (e.code) {
            Log_1.Log.error('Code:');
            Log_1.Log.error(e.code);
            Log_1.Log.error();
        }
        Log_1.Log.error('Message:');
        Log_1.Log.error(e.message);
        if (e.stack) {
            Log_1.Log.error();
            Log_1.Log.error('Stack:');
            Log_1.Log.error(e.stack);
        }
        if (e.message.indexOf('is not a function') > -1) {
            e.hint =
                'This might be an issue with upgrading the Jovo packages. Try to run `jovo update` instead of `npm install`';
            e.seeMore = 'https://www.jovo.tech/docs/installation/upgrading';
        }
        if (e.module) {
            Log_1.Log.error();
            Log_1.Log.error('Module:');
            Log_1.Log.error(e.module);
        }
        if (e.details) {
            Log_1.Log.error();
            Log_1.Log.error('Details:');
            Log_1.Log.error(e.details);
        }
        if (e.hint) {
            Log_1.Log.error();
            Log_1.Log.error('Hint:');
            Log_1.Log.error(e.hint);
        }
        if (e.seeMore) {
            Log_1.Log.error();
            Log_1.Log.error('Learn more:');
            Log_1.Log.error(e.seeMore);
        }
        Log_1.Log.red().error(Log_1.Log.header());
    }
}
exports.JovoError = JovoError;
//# sourceMappingURL=JovoError.js.map