'use strict';

const RequestBuilderAlexaSkill = require('../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;
const RequestBuilderGoogleActionDialogFlow = require('../lib/platforms/googleaction/request/util/requestBuilder').RequestBuilder;
// eslint-disable-next-line
const RequestBuilderGoogleActionDialogFlowV2 = require('../lib/platforms/googleaction/request/util/requestBuilderV2').RequestBuilder;

const BaseApp = require('./app');

const CanFulfillIntentRequest = require('./platforms/alexaSkill/request/canFulfillIntentRequest').CanFulfillIntentRequest;
const GameEngineInputHandlerEventRequest = require('./platforms/alexaSkill/request/gameEngineInputHandlerEventRequest').GameEngineInputHandlerEventRequest;
const LaunchRequest = require('./platforms/alexaSkill/request/launchRequest').LaunchRequest;
const IntentRequest = require('./platforms/alexaSkill/request/intentRequest').IntentRequest;
const SessionEndedRequest = require('./platforms/alexaSkill/request/sessionEndedRequest').SessionEndedRequest;
const ErrorRequest = require('./platforms/alexaSkill/request/errorRequest').ErrorRequest;
const AudioPlayerRequest = require('./platforms/alexaSkill/request/audioPlayerRequest').AudioPlayerRequest;
const DisplayRequest = require('./platforms/alexaSkill/request/displayRequest').DisplayRequest;
const EventRequest = require('./platforms/alexaSkill/request/eventRequest').EventRequest;
const ConnectionsResponseRequest = require('./platforms/alexaSkill/request/connectionsResponseRequest').ConnectionsResponseRequest;

const AlexaRequest = require('./platforms/alexaSkill/request/alexaRequest').AlexaRequest;
const AlexaRequestContext = require('./platforms/alexaSkill/request/alexaRequestContext').AlexaRequestContext;
const AlexaRequestContextAndSession = require('./platforms/alexaSkill/request/alexaRequestContextAndSession').AlexaRequestContextAndSession;


const DialogFlowRequest = require('./platforms/googleaction/request/dialogFlowRequest').DialogFlowRequest;
const DialogFlowV2Request = require('./platforms/googleaction/request/dialogFlowV2Request').DialogFlowV2Request;

const GoogleActionRequest = require('./platforms/googleaction/request/googleActionRequest').GoogleActionRequest;
const GoogleActionDialogFlowRequest = require('./platforms/googleaction/request/googleActionDialogFlowRequest').GoogleActionDialogFlowRequest;
const GoogleActionDialogFlowV2Request = require('./platforms/googleaction/request/googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request;
const _ = require('lodash');
const path = require('path');
const fs = require('fs');


module.exports.getPlatformRequestBuilder = function() {
    let requestBuilderArr = [];
    requestBuilderArr['GoogleActionDialogFlow'] = (new RequestBuilderGoogleActionDialogFlow).constructor;
    // eslint-disable-next-line
    requestBuilderArr['GoogleActionDialogFlowV2'] = (new RequestBuilderGoogleActionDialogFlowV2).constructor;
    requestBuilderArr['AlexaSkill'] = (new RequestBuilderAlexaSkill).constructor;

    // eslint-disable-next-line
    if (arguments && arguments.length > 0) {
        for (let key of Object.keys(requestBuilderArr)) {
            if (Object.keys(arguments).map((k) => arguments[k]).indexOf(key) === -1) {  //eslint-disable-line
                delete requestBuilderArr[key];
            }
        }
    }
    return Object.keys(requestBuilderArr).map((k) => requestBuilderArr[k]);
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
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
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


/**
 * Create directory recursively.
 * @param {string} p path
 */
module.exports.makeDirRecursive = function(p) {
    let pathArr = p.split(path.sep);
    let pathTemp = '.' + path.sep;
    for (let i = 1; i < pathArr.length; i++) {
        pathTemp += pathArr[i] + path.sep;
        if (fs.existsSync(pathTemp)) {
            continue;
        }
        fs.mkdirSync(pathTemp);
    }
};

/**
 * Returns platform type from a request object
 * @param {Object} requestObj
 * @return {string}
 */
module.exports.getPlatformType = function(requestObj) {
    if (requestObj.result ||
        (requestObj.user &&
            requestObj.conversation) ||
        requestObj.queryResult) {
        return BaseApp.PLATFORM_ENUM.GOOGLE_ACTION;
    } else {
        return BaseApp.PLATFORM_ENUM.ALEXA_SKILL;
    }
};

module.exports.getRequestType = function(requestObj) {
    let platform = module.exports.getPlatformType(requestObj);
    if (platform === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
        return platform;
    } else if (platform === BaseApp.PLATFORM_ENUM.GOOGLE_ACTION) {
        let instance = module.exports.makeRequestInstance(requestObj);
        return instance.constructor.name;
    }
};

module.exports.makeRequestInstance = function(requestObj) {
    if (typeof requestObj === 'string') {
        requestObj = JSON.parse(requestObj);
    }
    if (module.exports.getPlatformType(requestObj) === BaseApp.PLATFORM_ENUM.GOOGLE_ACTION) {
        if (_.get(requestObj, 'originalRequest') &&
            _.get(requestObj, 'originalRequest.source') === 'google') {
            return new GoogleActionDialogFlowRequest(requestObj);
        } else if (_.get(requestObj, 'result') &&
            !_.get(requestObj, 'originalRequest')) {
            return new DialogFlowRequest(requestObj);
        } else if (_.get(requestObj, 'queryResult') &&
            _.get(requestObj, 'originalDetectIntentRequest.source') === 'google') {
            return new GoogleActionDialogFlowV2Request(requestObj);
        } else if (_.get(requestObj, 'queryResult')) {
            return new DialogFlowV2Request(requestObj);
        } else {
            return new GoogleActionRequest(requestObj);
        }
    } else if (module.exports.getPlatformType(requestObj) === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
        const type = _.get(requestObj, 'request.type');

        if (!type) {
            return null;
        }

        if (type === 'CanFulfillIntentRequest') {
            return new CanFulfillIntentRequest(requestObj);
        } else if (type === 'GameEngine.InputHandlerEvent') {
            return new GameEngineInputHandlerEventRequest(requestObj);
        } else if (type === 'LaunchRequest') {
            return new LaunchRequest(requestObj);
        } else if (type === 'IntentRequest') {
            return new IntentRequest(requestObj);
        } else if (type === 'SessionEndedRequest') {
            return new SessionEndedRequest(requestObj);
        } else if (type === 'System.ExceptionEncountered') {
            return new ErrorRequest(requestObj);
        } else if (type.substring(0, 11) === 'AudioPlayer') {
            return new AudioPlayerRequest(requestObj);
        } else if (type.substring(0, 7) === 'Display') {
            return new DisplayRequest(requestObj);
        } else if (type.substring(0, 15) === 'AlexaSkillEvent') {
            return new EventRequest(requestObj);
        } else if (type.substring(0, 23) === 'AlexaHouseholdListEvent') {
            return new EventRequest(requestObj);
        } else if (type === 'Connections.Response') {
            return new ConnectionsResponseRequest(requestObj);
        } else {
            if (_.get(requestObj, 'session') && _.get(requestObj, 'context')) {
                return new AlexaRequestContextAndSession(requestObj);
            } else if (!_.get(requestObj, 'session') && _.get(requestObj, 'context')) {
                return new AlexaRequestContext(requestObj);
            } else {
                return new AlexaRequest(requestObj);
            }
        }
    }
};

