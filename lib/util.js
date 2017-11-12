'use strict';

/**
 * Returns parameter names of a method
 * https://stackoverflow.com/a/9924463
 * @param {function} func
 * @return {Array|{index: number, input: string}}
 */
const getParamNames = function(func) {
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
const camelize = function(str) {
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
const validateHandlers = function(handlers) {
    let firstLevelKeys = Object.keys(handlers);

    if (firstLevelKeys.length === 0) {
        throw new Error('There should be at least one intent in the handler.');
    }

    // iterate through first level objects/functions
    for (let i = 0; i < firstLevelKeys.length; i++) {
        let firstLevelObj = handlers[firstLevelKeys[i]];

        // object + function allowed, otherwise throw error
        if (typeof firstLevelObj !== 'object' && typeof firstLevelObj !== 'function') {
            throw new Error('Wrong handler types. Should be object for a state or a function for an intent.');
        }

        // state object
        if (typeof firstLevelObj === 'object') {
            let secondLevelKeys = Object.keys(firstLevelObj);

            if (secondLevelKeys.length === 0) {
                throw new Error('There should be at least one intent in the state.');
            }

            // iterate through second level and check for function
            for (let j = 0; j < secondLevelKeys.length; j++) {
                let secondLevelObj = firstLevelObj[secondLevelKeys[j]];

                if (typeof secondLevelObj !== 'function') {
                    throw new Error('IntentHandler inside of a state should be a function');
                }
            }
        }
    }
};

module.exports.getParamNames = getParamNames;
module.exports.camelize = camelize;
module.exports.validateHandlers = validateHandlers;

