import {Plugin, SessionConstants} from "jovo-core";
import {SAPCAI} from "./SAPCAI";
import _get = require('lodash.get');
import _set = require('lodash.set');
import {EnumRequestType, HandleRequest} from "jovo-core";
import {SAPCAIRequest} from "./SAPCAIRequest";
import {SAPCAISkill} from "./SAPCAISkill";
import {SAPCAISpeechBuilder} from "./SAPCAISpeechBuilder";
import {SAPCAIUser} from "./SAPCAIUser";
import {SAPCAIResponse} from "./SAPCAIResponse";


export class SAPCAICore implements Plugin {

    install(sapcai: SAPCAI) {
        sapcai.middleware('$init')!.use(this.init.bind(this));
        sapcai.middleware('$request')!.use(this.request.bind(this));
        sapcai.middleware('$type')!.use(this.type.bind(this));
        sapcai.middleware('$session')!.use(this.session.bind(this));
        sapcai.middleware('$output')!.use(this.output.bind(this));
    }

    uninstall(sapcai: SAPCAI) {

    }

    async init(handleRequest: HandleRequest) {

        const requestObject = handleRequest.host.getRequestObject();

        //TODO CHECK

        if (requestObject.nlp) {
            handleRequest.jovo = new SAPCAISkill(handleRequest.app, handleRequest.host, handleRequest);
        }
    }

    async request(sapcaiSkill: SAPCAISkill) {
        if (!sapcaiSkill.$host) {
            throw new Error(`Couldn't access host object`);
        }

        sapcaiSkill.$request = SAPCAIRequest.fromJSON(sapcaiSkill.$host.getRequestObject()) as SAPCAIRequest;
        sapcaiSkill.$user = new SAPCAIUser(sapcaiSkill);

    }

    async type(sapcaiSkill: SAPCAISkill) {
        const sapcaiRequest = sapcaiSkill.$request as SAPCAIRequest;
        sapcaiSkill.$type = {
            type: EnumRequestType.INTENT
        };

    }

    async session(sapcaiSkill: SAPCAISkill) {
        const sapcaiRequest = sapcaiSkill.$request as SAPCAIRequest;
        sapcaiSkill.$requestSessionAttributes = JSON.parse(JSON.stringify(sapcaiRequest.getSessionAttributes() || {}));
        if (!sapcaiSkill.$session) {
            sapcaiSkill.$session = { $data: {}};
        }
        sapcaiSkill.$session.$data = JSON.parse(JSON.stringify(sapcaiRequest.getSessionAttributes() || {}));
    }

    output(sapcaiSkill: SAPCAISkill) {
        const output = sapcaiSkill.$output;

        if (!sapcaiSkill.$response) {
            sapcaiSkill.$response = new SAPCAIResponse();
        }

        if (Object.keys(output).length === 0) {
            return;
        }

        const tell = _get(output, 'SAPCAI.tell') || _get(output, 'tell');
        if (tell) {
            _set(sapcaiSkill.$response, 'replies', [{
                type: 'text',
                content: tell.speech
            }]);
        }

        const ask = _get(output, 'SAPCAI.ask') || _get(output, 'ask');
        if (ask) {
            _set(sapcaiSkill.$response, 'replies', [{
                type: 'text',
                content: ask.speech
            }]);
        }

        // add sessionData to response object explicitly
        /*if (_get(sapcaiSkill.$app.config, 'keepSessionDataOnSessionEnded')) {
            // set sessionAttributes
            if (sapcaiSkill.$session && sapcaiSkill.$session.$data) {
                _set(sapcaiSkill.$response, 'conversation.memory', sapcaiSkill.$session.$data);
            }
        }

        if (sapcaiSkill.$session && sapcaiSkill.$session.$data[SessionConstants.STATE]) {
            _set(sapcaiSkill.$response, `conversation.memory[${SessionConstants.STATE}]`, sapcaiSkill.$session.$data[SessionConstants.STATE]);
        }*/

        if (sapcaiSkill.$session && sapcaiSkill.$session.$data) {
            _set(sapcaiSkill.$response, 'conversation.memory', sapcaiSkill.$session.$data);
        }
    }

}
