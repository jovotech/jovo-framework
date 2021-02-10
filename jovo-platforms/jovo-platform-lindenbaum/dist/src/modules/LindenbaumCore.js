"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const LindenbaumBot_1 = require("../core/LindenbaumBot");
const LindenbaumRequest_1 = require("../core/LindenbaumRequest");
const LindenbaumUser_1 = require("../core/LindenbaumUser");
const LindenbaumSpeechBuilder_1 = require("../core/LindenbaumSpeechBuilder");
class LindenbaumCore {
    install(lindenbaum) {
        lindenbaum.middleware('$init').use(this.init.bind(this));
        lindenbaum.middleware('$request').use(this.request.bind(this));
        lindenbaum.middleware('$type').use(this.type.bind(this));
        lindenbaum.middleware('$output').use(this.output.bind(this));
    }
    uninstall(lindenbaum) { }
    async init(handleRequest) {
        const requestObject = handleRequest.host.getRequestObject();
        if (requestObject.dialogId && requestObject.timestamp) {
            handleRequest.jovo = new LindenbaumBot_1.LindenbaumBot(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    async request(lindenbaumBot) {
        if (!lindenbaumBot.$host) {
            throw new jovo_core_1.JovoError("Couldn't access $host object", jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-platform-lindenbaum', 'The $host object is necessary to initialize both $request and $user');
        }
        lindenbaumBot.$request = LindenbaumRequest_1.LindenbaumRequest.fromJSON(lindenbaumBot.$host.getRequestObject());
        lindenbaumBot.$user = new LindenbaumUser_1.LindenbaumUser(lindenbaumBot);
    }
    async type(lindenbaumBot) {
        const request = lindenbaumBot.$request;
        /**
         * Instead of working with the request paths to determine what kind of request it is,
         * e.g. /session -> LAUNCH,
         * we can use the different request schemes of each path to determine the request type,
         * e.g. only LAUNCH has `remote` property
         *
         * Differences between ExpressJs & cloud providers make this solution easier
         */
        if (request.remote) {
            lindenbaumBot.$type = {
                type: jovo_core_1.EnumRequestType.LAUNCH,
            };
        }
        else if (request.text) {
            if (request.type === 'DTMF') {
                lindenbaumBot.$type = {
                    type: jovo_core_1.EnumRequestType.ON_DTMF,
                };
            }
            else if (request.type === 'SPEECH') {
                lindenbaumBot.$type = {
                    type: jovo_core_1.EnumRequestType.INTENT,
                };
            }
        }
        else if (request.duration) {
            lindenbaumBot.$type = {
                type: jovo_core_1.EnumRequestType.ON_INACTIVITY,
            };
        }
        else {
            lindenbaumBot.$type = {
                type: jovo_core_1.EnumRequestType.END,
            };
        }
    }
    async output(lindenbaumBot) {
        const output = lindenbaumBot.$output;
        const response = lindenbaumBot.$response;
        // the responses array was defined using `setResponses()`. That array is final.
        if (response.responses.length > 0) {
            return;
        }
        if (Object.keys(output).length === 0) {
            return;
        }
        const dialogId = lindenbaumBot.$request.getUserId(); // used in every response
        const language = lindenbaumBot.$request.getLocale();
        /**
         * tell and ask have to be at the beginning of the `response.responses` array
         * because API calls will be made in the same order as the array
         */
        const tell = output.tell;
        if (tell) {
            // DropResponse HAS to be after SayResponse
            const tellResponse = this.getTellResponse(tell, dialogId, language);
            response.responses.unshift(...tellResponse);
        }
        const ask = output.ask;
        if (ask) {
            const askResponse = this.getAskResponse(ask, dialogId, language);
            response.responses.unshift(askResponse);
        }
        // the objects inside the Lindenbaum array are already in the correct format
        response.responses.push(...output.Lindenbaum);
        // /call/data has to be first else throws error
        const dataIndex = response.responses.findIndex((value) => value['/call/data']);
        if (dataIndex > -1) {
            const dataObject = response.responses.splice(dataIndex, 1)[0];
            response.responses.unshift(dataObject);
        }
    }
    /**
     * creates and returns the final response structure for `tell` property from the `$output` object.
     * @param {TellOutput} tell
     * @param {string} dialogId
     */
    getTellResponse(tell, dialogId, language) {
        const sayResponse = {
            '/call/say': {
                dialogId,
                language,
                text: LindenbaumSpeechBuilder_1.LindenbaumSpeechBuilder.toSSML(tell.speech),
                bargeIn: false,
            },
        };
        // `drop` specifies that the session should end after the speech output.
        const dropResponse = {
            '/call/drop': {
                dialogId,
            },
        };
        return [sayResponse, dropResponse];
    }
    /**
     * parses the `ask` property from the `$output` object to the final response.
     * @param {AskOutput} ask
     * @param {string} dialogId
     */
    getAskResponse(ask, dialogId, language) {
        const sayResponse = {
            '/call/say': {
                dialogId,
                language,
                text: LindenbaumSpeechBuilder_1.LindenbaumSpeechBuilder.toSSML(ask.speech),
                bargeIn: false,
            },
        };
        return sayResponse;
    }
}
exports.LindenbaumCore = LindenbaumCore;
//# sourceMappingURL=LindenbaumCore.js.map