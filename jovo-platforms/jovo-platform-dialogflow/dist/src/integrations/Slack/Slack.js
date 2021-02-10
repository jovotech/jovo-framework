"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _set = require("lodash.set");
const _get = require("lodash.get");
const DialogflowAgent_1 = require("../../DialogflowAgent");
const SlackUser_1 = require("./SlackUser");
const __1 = require("../..");
class Slack {
    constructor(config) {
        this.config = {
            enabled: true,
            source: 'slack',
        };
    }
    install(dialogFlow) {
        dialogFlow.middleware('$output').use(this.output.bind(this));
        dialogFlow.middleware('$type').use(this.type.bind(this));
        const source = this.config.source;
        DialogflowAgent_1.DialogflowAgent.prototype.isSlackBot = function () {
            return this.getSource() === source;
        };
    }
    uninstall(app) { }
    type(dialogflowAgent) {
        dialogflowAgent.$user = new SlackUser_1.SlackUser(dialogflowAgent);
    }
    output(dialogflowAgent) {
        const output = dialogflowAgent.$output;
        const isSlackRequest = dialogflowAgent.getSource() === this.config.source;
        if (!isSlackRequest) {
            return;
        }
        if (!dialogflowAgent.$response) {
            dialogflowAgent.$response = new __1.DialogflowResponse();
        }
        if (_get(output, 'Dialogflow.Payload.slack')) {
            _set(dialogflowAgent.$response, 'payload.slack', _get(output, 'Dialogflow.Payload.slack'));
        }
        if (output.tell) {
            _set(dialogflowAgent.$response, 'payload.slack.text', `${output.tell.speech}`);
        }
        //
        if (output.ask) {
            _set(dialogflowAgent.$response, 'payload.slack.text', `${output.ask.speech}`);
        }
    }
}
exports.Slack = Slack;
//# sourceMappingURL=Slack.js.map