'use strict';

const BaseApp = require('./app');
const _ = require('lodash');

/**
 * Class Routing
 */
class Routing {

    /**
     * Constructor
     * @param {Jovo} jovo
     */
    constructor(jovo) {
        this.jovo = jovo;
    }

    /**
     * Resolves route from state and intentname
     * @return {Promise<any>}
     */
    route() {
        return new Promise((resolve) => {
            if (this.isCanFulfillIntentRequest()) {
                return resolve(this.routeCanFulfillIntentRequest());
            }
            if (this.isLaunchRequest()) {
                return resolve(this.routeLaunchRequest());
            }
            if (this.isElementSelectedRequest()) {
                return resolve(this.routeElementSelectedRequest());
            }
            if (this.isSignInRequest()) {
                return resolve({
                    path: BaseApp.HANDLER_ON_SIGN_IN,
                    type: BaseApp.REQUEST_TYPE_ENUM.ON_SIGN_IN,
                });
            }
            if (this.isPermissionRequest()) {
                return resolve({
                    path: BaseApp.HANDLER_ON_PERMISSION,
                    type: BaseApp.REQUEST_TYPE_ENUM.ON_PERMISSION,
                });
            }
            if (this.isEventRequest()) {
                return resolve(this.routeEventRequest());
            }
            if (this.isAudioPlayerRequest()) {
                return resolve(this.routeAudioPlayerRequest());
            }
            if (this.isPlaybackControllerRequest()) {
                return resolve(this.routePlaybackControllerRequest());
            }
            if (this.isInSkillPurchaseRequest()) {
                return resolve(this.routeInSkillPurchaseRequest());
            }
            if (this.isGameEngineInputHandlerEventRequest()) {
                return resolve(this.routeGameEngineInputHandlerEventRequest());
            }
            if (this.isUndefinedRequest()) {
                return resolve(this.routeUndefinedIntent());
            }
            if (this.isEndRequest() || this.jovo.getIntentName() === BaseApp.HANDLER_END) {
                return resolve(this.routeEndRequest());
            }
            if (this.isIntentRequest()) {
                return resolve(
                    this.routeIntentRequest(this.jovo.getState(), this.jovo.getIntentName()));
            }

            // resolve();
        });
    }

    /**
     * Type of request is can fulfill intent request
     * @private
     * @return {boolean} isCanFulfillIntentRequest
     */
    isCanFulfillIntentRequest() {
        const requestType = this.jovo.getPlatform().getRequestType();
        return requestType === BaseApp.REQUEST_TYPE_ENUM.CAN_FULFILL_INTENT;
    }
    /**
     * Type of request is launch request
     * @private
     * @return {boolean} isLaunchRequest
     */
    isLaunchRequest() {
        return this.jovo.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.LAUNCH;
    }
    /**
     * Type of request is end request
     * @private
     * @return {boolean} isEndRequest
     */
    isEndRequest() {
        return this.jovo.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.END;
    }

    /**
     * Type of request is intent request
     * @private
     * @return {boolean} isIntentRequest
     */
    isIntentRequest() {
        return this.jovo.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * Type of request is undefined request
     * @private
     * @return {boolean} isUndefinedRequest
     */
    isUndefinedRequest() {
        return this.jovo.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.UNDEFINED;
    }

    /**
     * Type of request is intent request
     * @private
     * @return {boolean} isInSkillPurchaseRequest
     */
    isInSkillPurchaseRequest() {
        return this.jovo.getPlatform().getRequestType() ===
            BaseApp.REQUEST_TYPE_ENUM.ON_PURCHASE;
    }

    /**
     * Type of request is intent request
     * @private
     * @return {boolean} isGameEngineInputHandlerEventRequest
     */
    isGameEngineInputHandlerEventRequest() {
        return this.jovo.getPlatform().getRequestType() ===
            BaseApp.REQUEST_TYPE_ENUM.ON_GAME_ENGINE_INPUT_HANDLER_EVENT;
    }

    /**
     * Type of request is 'Element Selected" on visual interfaces
     * @private
     * @return {boolean}
     */
    isElementSelectedRequest() {
        return this.jovo.getPlatform().getRequestType() ===
            BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
    }

    /**
     * Type of request is 'Element Selected" on visual interfaces
     * @private
     * @return {boolean}
     */
    isSignInRequest() {
        return this.jovo.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.ON_SIGN_IN;
    }

    /**
     * Retrieves true if request is a permission
     * @private
     * @return {boolean}
     */
    isPermissionRequest() {
        return this.jovo.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.ON_PERMISSION;
    }

    /**
     * Type of request is audio player request
     * @return {boolean} isAudioPlayerRequest
     */
    isAudioPlayerRequest() {
        return this.jovo.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER;
    }

    /**
     * Type of request is playback controller request
     * @return {boolean} isPlaybackControllerRequest
     */
    isPlaybackControllerRequest() {
        return this.jovo.getPlatform().getRequestType() ===
            BaseApp.REQUEST_TYPE_ENUM.PLAYBACKCONTROLLER;
    }

    /**
     * Type of request is eventrequest
     * @return {boolean} isEventRequest
     */
    isEventRequest() {
        return this.jovo.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.ON_EVENT;
    }

    /**
     * Route for can fulfill request
     * @return {{path: string, type: string}}
     */
    routeCanFulfillIntentRequest() {
        return {
            path: BaseApp.HANDLER_CAN_FULFILL_INTENT,
            type: BaseApp.REQUEST_TYPE_ENUM.CAN_FULFILL_INTENT,
        };
    }

    /**
     * Route for launch request
     * @return {{path: string, type: string}}
     */
    routeLaunchRequest() {
        return {
            path: BaseApp.HANDLER_LAUNCH,
            type: BaseApp.REQUEST_TYPE_ENUM.LAUNCH,
        };
    }

    /**
     * Route for end request
     * @return {{path: string, type: string}}
     */
    routeEndRequest() {
        let _state = this.jovo.getState();
        if (_state) {
            while (_state !== '') {
                if (_.get(this.jovo.config.handlers, _state + '.' + BaseApp.HANDLER_END)) {
                    return {
                        path: _state + '.' + BaseApp.HANDLER_END,
                        state: this.jovo.getState(),
                        type: BaseApp.REQUEST_TYPE_ENUM.END,
                    };
                }
                _state = Routing.getLastLevel(_state);
            }
        }


        return {
            path: BaseApp.HANDLER_END,
            state: this.jovo.getState(),
            type: BaseApp.REQUEST_TYPE_ENUM.END,
        };
    }

    /**
     * Route for launch request
     * @param {string} state
     * @param {string} intent
     * @return {{path: string, type: string}}
     */
    routeIntentRequest(state, intent) {
        let _state = state + '';
        let _intent = intent + '';

        let path = state ?
            state + '.' + intent: intent;

        // rewrite path if there is a dot in the intent name
        if (_intent &&
            _intent.indexOf('.') > -1) {
            path = _state ? _state : '';
            path += '["' + _intent + '"]';
        }
        if (_.get(this.jovo.config.handlers, path)) {
            return {
                path: path,
                state: state,
                intent: intent,
                type: BaseApp.REQUEST_TYPE_ENUM.INTENT,
            };
        }

        if (_state) {
            while (_state !== '') {
                // State 'unhandled' is available and intent is not in intentsToSkipUnhandled
                if (_.get(this.jovo.config.handlers, _state + '.' + BaseApp.UNHANDLED) &&
                    this.jovo.config.intentsToSkipUnhandled.indexOf(_intent) === -1) {
                    path = _state + '.' + BaseApp.UNHANDLED;
                    return {
                        path: path,
                        state: state,
                        intent: intent,
                        type: BaseApp.REQUEST_TYPE_ENUM.INTENT,
                    };
                }
                if (_.get(this.jovo.config.handlers, _state + '["' + _intent + '"]')) {
                    path = _state + '["' + _intent + '"]';
                    return {
                        path: path,
                        state: state,
                        intent: intent,
                        type: BaseApp.REQUEST_TYPE_ENUM.INTENT,
                    };
                }
                _state = Routing.getLastLevel(_state);
            }

            // is intent in global?
            if (_.get(this.jovo.config.handlers, _intent)) {
                return {
                    path: _intent,
                    state: state,
                    intent: intent,
                    type: BaseApp.REQUEST_TYPE_ENUM.INTENT,
                };
            }
        }
        let pathToUnhandled = _state ? _state + '.' + BaseApp.UNHANDLED : BaseApp.UNHANDLED;

        if (_.get(this.jovo.config.handlers, pathToUnhandled)) {
            path = pathToUnhandled;
        }

        return {
            path: path,
            state: state,
            intent: intent,
            type: BaseApp.REQUEST_TYPE_ENUM.INTENT,
        };
    }

    /**
     * Returns route of undefined intent
     * @return {{path: string, type: string}}
     */
    routeUndefinedIntent() {
        for (let obj of Object.keys(this.jovo.config.handlers)) {
            if (obj === BaseApp.REQUEST_TYPE_ENUM.LAUNCH ||
                obj === BaseApp.REQUEST_TYPE_ENUM.END ||
                obj === BaseApp.REQUEST_TYPE_ENUM.ON_EVENT ||
                obj === BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER ||
                obj === BaseApp.REQUEST_TYPE_ENUM.ERROR ||
                obj === BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED ||
                obj === BaseApp.REQUEST_TYPE_ENUM.ON_PERMISSION ||
                obj === BaseApp.REQUEST_TYPE_ENUM.ON_SIGN_IN ||
                obj.substr(0, 1) !== '(' || obj.substr(obj.length-1, 1) !== ')') {
                continue;
            }

            let path = obj;
            let value;
            // look for = and extract json path and value to compare
            if (obj.indexOf('=') > -1) {
                path = obj.substr(1, obj.indexOf('=')-1);
                value = obj.substr(obj.indexOf('=') + 1, obj.length - obj.indexOf('=') - 2);
            }
            if (value) {
                if (_.get(this.jovo.getRequestObject(), path) === value ) {
                    return {
                        path: obj,
                        type: BaseApp.REQUEST_TYPE_ENUM.UNDEFINED,
                    };
                }
            } else {
                if (_.get(this.jovo.getRequestObject(), obj) ) {
                    return {
                        path: obj,
                        type: BaseApp.REQUEST_TYPE_ENUM.UNDEFINED,
                    };
                }
            }
        }
    }

    /**
     * Returns route of element selected request
     * @return {{path: string, type: string}}
     */
    routeElementSelectedRequest() {
        if (!this.jovo.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED] ||
            typeof this.jovo.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED] === 'function') {
            return {
                type: BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED,
                path: BaseApp.HANDLER_ON_ELEMENT_SELECTED,
            };
        }

        let elementId;
        if (_.get(
            this.jovo.config.handlers,
            BaseApp.HANDLER_ON_ELEMENT_SELECTED + '.' + this.jovo.getSelectedElementId())) {
            elementId = this.jovo.getSelectedElementId();
        }

        if (!elementId) {
            if (_.get(
                this.jovo.config.handlers,
                BaseApp.HANDLER_ON_ELEMENT_SELECTED + '.' + BaseApp.UNHANDLED)) {
                return {
                    path: BaseApp.HANDLER_ON_ELEMENT_SELECTED + '.' + BaseApp.UNHANDLED,
                    type: BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED,
                };
            } else {
                return {
                    path: BaseApp.HANDLER_ON_ELEMENT_SELECTED + '.' + this.jovo.getSelectedElementId(),
                    type: BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED,
                };
            }
        }

        return {
            path: BaseApp.HANDLER_ON_ELEMENT_SELECTED + '.' + elementId,
            type: BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED,
        };
    }

    /**
     * Returns route of event request
     * @return {{path: string, type: string}}
     */
    routeEventRequest() {
        const requestType = this.jovo.getPlatform().request.getType();
        return {
            path: BaseApp.HANDLER_ON_EVENT + '["' + requestType + '"]',
            type: BaseApp.REQUEST_TYPE_ENUM.ON_EVENT,
        };
    }

    /**
     * Returns route of event request
     * @return {{path: string, type: string}}
     */
    routeInSkillPurchaseRequest() {
        return {
            path: BaseApp.HANDLER_ON_PURCHASE,
            type: BaseApp.REQUEST_TYPE_ENUM.ON_PURCHASE,
        };
    }

    /**
     * Returns route of event request
     * @return {{path: string, type: string}}
     */
    routeGameEngineInputHandlerEventRequest() {
        return {
            path: BaseApp.HANDLER_ON_GAME_ENGINE_INPUT_HANDLER_EVENT,
            type: BaseApp.REQUEST_TYPE_ENUM.ON_GAME_ENGINE_INPUT_HANDLER_EVENT,
        };
    }

    /**
     * Returns rout of playback controller request
     * @return {{path: string, type: string}}
     */
    routePlaybackControllerRequest() {
        if (_.get(
                this.jovo.config.handlers,
                `PLAYBACKCONTROLLER`)) {
            return {
                path: `PLAYBACKCONTROLLER["${this.jovo.getPlatform().audioPlayer().getType()}"]`,
                type: BaseApp.REQUEST_TYPE_ENUM.PLAYBACKCONTROLLER,
            };
        }
    }

    /**
     * Returns rout of audio player request
     * @return {{path: string, type: string}}
     */
    routeAudioPlayerRequest() {
        if (!_.get(
            this.jovo.config.handlers,
            `AUDIOPLAYER`) && !_.get(
            this.jovo.config.handlers,
            `MEDIARESPONSE`)) {
            return {
                path: `AUDIOPLAYER["${this.jovo.getPlatform().audioPlayer().getType()}"]`,
                type: BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER,
            };
        }

        if (_.get(
            this.jovo.config.handlers,
            `AUDIOPLAYER`)) {
            return {
                path: `AUDIOPLAYER["${this.jovo.getPlatform().audioPlayer().getType()}"]`,
                type: BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER,
            };
        }
        if (_.get(
            this.jovo.config.handlers,
            `MEDIARESPONSE`)) {
            return {
                path: `MEDIARESPONSE["${this.jovo.getPlatform().audioPlayer().getType()}"]`,
                type: BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER,
            };
        }
    }

    /**
     * Returns rout of playback controller request
     * @return {{path: string, type: string}}
     */
    routePlaybackControllerRequest() {
        if (_.get(this.jovo.config.handlers, `PLAYBACKCONTROLLER`)) {
            return {
                path: `PLAYBACKCONTROLLER["${this.jovo.getPlatform().audioPlayer().getType()}"]`,
                type: BaseApp.REQUEST_TYPE_ENUM.PLAYBACKCONTROLLER,
            };
        }
    }

    /**
     * Returns last level of path
     * @param {string} route
     * @return {string}
     */
    static getLastLevel(route) {
        let level = '';
        if (route.indexOf('.')) {
            level = route.substr(0, route.lastIndexOf('.'));
        }
        return level;
    }

}

module.exports.Routing = Routing;
