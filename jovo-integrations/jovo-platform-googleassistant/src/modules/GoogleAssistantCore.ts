import {Plugin, HandleRequest, EnumRequestType} from "jovo-core";
import _set = require('lodash.set');
import _get = require('lodash.get');

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionResponse} from "../core/GoogleActionResponse";
import {GoogleActionSpeechBuilder} from "../core/GoogleActionSpeechBuilder";

import uuidv4 = require('uuid/v4');



export class GoogleAssistantCore implements Plugin {

    install(googleAssistant: GoogleAssistant) {
        googleAssistant.middleware('$init')!.use(this.init.bind(this));
        googleAssistant.middleware('$type')!.use(this.type.bind(this));

        googleAssistant.middleware('after.$type')!.use(this.userStorageGet.bind(this));

        googleAssistant.middleware('$output')!.use(this.output.bind(this));
        googleAssistant.middleware('after.$output')!.use(this.userStorageStore.bind(this));

        GoogleAction.prototype.displayText = function(displayText: string, speech: string | undefined) {
            let currentDisplayText=_get(this.$output, 'GoogleAssistant.displayText')
            if(currentDisplayText==undefined){
                currentDisplayText=[]
            }
            _set(this.$output, 'GoogleAssistant.displayText',currentDisplayText.concat([{text:displayText,ssml:speech}]));
            return this;
        };

    }

    async init(handleRequest: HandleRequest) {
        const requestObject = handleRequest.host.$request;

        if (requestObject.user &&
            requestObject.conversation &&
            requestObject.surface &&
            requestObject.availableSurfaces) {
            handleRequest.jovo = new GoogleAction(handleRequest.app, handleRequest.host);
        }
    }

    type(googleAction: GoogleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.CANCEL') {
            _set(googleAction.$type, 'type', EnumRequestType.END);
        }
    }

    async output(googleAction: GoogleAction) {
        const output = googleAction.$output;
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }
        const tell = _get(output, 'GoogleAssistant.tell') || _get(output, 'tell');
        if (tell) {
            _set(googleAction.$response, 'expectUserResponse', false);
            _set(googleAction.$response, 'richResponse.items', [{
                simpleResponse: {
                    ssml: GoogleActionSpeechBuilder.toSSML(tell.speech),
                }
            }]);
        }
        const ask = _get(output, 'GoogleAssistant.ask') || _get(output, 'ask');

        if (ask) {
            _set(googleAction.$response, 'expectUserResponse', true);

            // speech
            _set(googleAction.$response, 'richResponse.items', [{
                simpleResponse: {
                    ssml: GoogleActionSpeechBuilder.toSSML(ask.speech),
                }
            }]);

            // reprompts
            const noInputPrompts: any[] = []; // tslint:disable-line

            if (output.ask && output.ask.reprompt && typeof output.ask.reprompt === 'string') {
                noInputPrompts.push({
                    ssml: GoogleActionSpeechBuilder.toSSML(ask.reprompt)
                });
            } else if (Array.isArray(ask.reprompt)) {
                ask.reprompt.forEach((reprompt: string) => {
                    noInputPrompts.push({
                        ssml: GoogleActionSpeechBuilder.toSSML(reprompt)
                    });
                });
            }
            _set(googleAction.$response, 'noInputPrompts', noInputPrompts);
        }

        if (_get(output, 'GoogleAssistant.displayText') && googleAction.hasScreenInterface()) {
            const displayText=_get(output, 'GoogleAssistant.displayText')
            displayText.forEach(function(simpleResponse,key){
                _set(googleAction.$response, 'richResponse.items['+key+'].simpleResponse.displayText', simpleResponse.text);
                if((key==0 && simpleResponse.ssml!=undefined) || key >0){
                    _set(googleAction.$response, 'richResponse.items['+key+'].simpleResponse.ssml', simpleResponse.ssml);
                }
            })
        }
    }
    async userStorageGet(googleAction: GoogleAction) {
        try {
            googleAction.$user.$storage = JSON.parse(_get(
                googleAction.$originalRequest || googleAction.$request, 'user.userStorage'));
        } catch (e) {
        }

        const userId = googleAction.$user.$storage.userId ||
            googleAction.$request!.getUserId() ||
            uuidv4();

        googleAction.$user.$storage.userId = userId;

    }
    async userStorageStore(googleAction: GoogleAction) {
        const output = googleAction.$output;
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }
        _set(googleAction.$response, 'userStorage', JSON.stringify(googleAction.$user.$storage));
    }
    uninstall(googleAssistant: GoogleAssistant) {

    }

}
