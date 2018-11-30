import {Plugin} from "jovo-core";
import {Alexa} from "../Alexa";
import * as _ from "lodash";
import {EnumRequestType, HandleRequest} from "jovo-core";
import {AlexaRequest} from "../core/AlexaRequest";
import {AlexaSkill} from "../core/AlexaSkill";
import {AlexaSpeechBuilder} from "../core/AlexaSpeechBuilder";
import {AlexaUser} from "../core/AlexaUser";
import {AlexaResponse} from "..";


export class AlexaCore implements Plugin {

    install(alexa: Alexa) {
        alexa.middleware('$init')!.use(this.init.bind(this));
        alexa.middleware('$request')!.use(this.request.bind(this));
        alexa.middleware('$type')!.use(this.type.bind(this));
        alexa.middleware('$session')!.use(this.session.bind(this));
        alexa.middleware('$output')!.use(this.output.bind(this));
    }

    uninstall(alexa: Alexa) {

    }

    async init(handleRequest: HandleRequest) {
        const requestObject = handleRequest.host.getRequestObject();
        if (requestObject.version &&
            requestObject.request) {
            handleRequest.jovo = new AlexaSkill(handleRequest.app, handleRequest.host);
        }
    }

    async request(alexaSkill: AlexaSkill) {
        if (!alexaSkill.$host) {
            throw new Error(`Couldn't access host object`);
        }

        alexaSkill.$request = AlexaRequest.fromJSON(alexaSkill.$host.getRequestObject()) as AlexaRequest;
        alexaSkill.$user = new AlexaUser(alexaSkill);

    }

    async type(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        if (_.get(alexaRequest, 'request.type') === 'LaunchRequest') {
            alexaSkill.$type = {
                type: EnumRequestType.LAUNCH
            };
        }

        if (_.get(alexaRequest, 'request.type') === 'IntentRequest') {
            alexaSkill.$type = {
                type: EnumRequestType.INTENT
            };
        }

        if (_.get(alexaRequest, 'request.type') === 'SessionEndedRequest') {
            alexaSkill.$type = {
                type: EnumRequestType.END
            };

            if (_.get(alexaRequest, 'request.reason')) {
                alexaSkill.$type.subType = _.get(alexaRequest, 'request.reason');
            }

        }

        if (_.get(alexaRequest, 'request.type') === 'System.ExceptionEncountered') {
            alexaSkill.$type = {
                type: EnumRequestType.ON_ERROR
            };
        }

    }

    async session(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        alexaSkill.$requestSessionAttributes = JSON.parse(JSON.stringify(alexaRequest.getSessionAttributes() || {}));
        if (!alexaSkill.$session) {
            alexaSkill.$session = { $data: {}};
        }
        alexaSkill.$session.$data = JSON.parse(JSON.stringify(alexaRequest.getSessionAttributes() || {}));
    }

    output(alexaSkill: AlexaSkill) {
        const output = alexaSkill.$output;

        if (!alexaSkill.$response) {
            alexaSkill.$response = new AlexaResponse();
        }


        if (Object.keys(output).length === 0) {
            return;
        }
        const tell = _.get(output, 'Alexa.tell') || _.get(output, 'tell');
        if (tell) {
            _.set(alexaSkill.$response, 'response.shouldEndSession', true);
            _.set(alexaSkill.$response, 'response.outputSpeech', {
                type: 'SSML',
                ssml: AlexaSpeechBuilder.toSSML(tell.speech),
            });
        }
        const ask = _.get(output, 'Alexa.ask') || _.get(output, 'ask');

        if (ask) {
            _.set(alexaSkill.$response, 'response.shouldEndSession', false);
            _.set(alexaSkill.$response, 'response.outputSpeech', {
                type: 'SSML',
                ssml: AlexaSpeechBuilder.toSSML(ask.speech),
            });
            _.set(alexaSkill.$response, 'response.reprompt.outputSpeech', {
                type: 'SSML',
                ssml: AlexaSpeechBuilder.toSSML(ask.reprompt),
            });
        }


        if (_.get(alexaSkill.$response, 'response.shouldEndSession') === false) {
            // set sessionAttributes
            if (alexaSkill.$session && alexaSkill.$session.$data) {
                _.set(alexaSkill.$response, 'sessionAttributes', alexaSkill.$session.$data);
            }

        }
    }

}
