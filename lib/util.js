'use strict';

const RequestBuilderAlexaSkill = require('../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;
const RequestBuilderGoogleActionDialogFlow = require('../lib/platforms/googleaction/request/util/requestBuilder').RequestBuilder;


module.exports.getPlatformRequestBuilder = function() {
    return [
        new RequestBuilderGoogleActionDialogFlow(),
        new RequestBuilderAlexaSkill,
    ];
};

/**
 * Returns parameter names of a method
 * https://stackoverflow.com/a/9924463
 * @param {function} func
 * @return {Array|{index: number, input: string}}
 */
module.exports.getParamNames = function(func) {
    let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    let ARGUMENT_NAMES = /([^\s,]+)/g;
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
        result = [];
    }
    return result;
};

/**
 * Helper function
 * camelizes a string
 * @param {string} str
 * @return {string}
 */
module.exports.camelize = function(str) {
    str = str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
    str = str.replace(/[^a-zA-Z]/g, '');
    return str;
};

/**
 * Checks handlers for valid structure/values/types.
 *
 * @private
 * @throws Error
 * @param {object} handlers  Handler object with app logic
 */
module.exports.validateHandlers = function(handlers) {
    let firstLevelKeys = Object.keys(handlers);

    if (firstLevelKeys.length === 0) {
        throw new Error('There should be at least one intent in the handler.');
    }
    // TODO: validate multilevel handlers
};

