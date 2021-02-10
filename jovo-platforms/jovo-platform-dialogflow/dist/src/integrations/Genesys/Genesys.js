"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _has = require("lodash.has");
const DialogflowAgent_1 = require("../../DialogflowAgent");
const GenesysUser_1 = require("./GenesysUser");
/*
export interface GenesysConfig extends Config {
  source: string;
}
*/
class Genesys {
    constructor(config) {
        this.config = {
            enabled: true,
        };
    }
    install(dialogFlow) {
        dialogFlow.middleware('$output').use(this.output.bind(this));
        dialogFlow.middleware('$type').use(this.type.bind(this));
        DialogflowAgent_1.DialogflowAgent.prototype.isGenesys = function () {
            return _has(this.$request, 'originalDetectIntentRequest.payload.Genesys-Conversation-Id');
        };
    }
    uninstall(app) { }
    type(dialogflowAgent) {
        if (dialogflowAgent.isGenesys()) {
            dialogflowAgent.$user = new GenesysUser_1.GenesysUser(dialogflowAgent);
        }
    }
    output(dialogflowAgent) {
        if (dialogflowAgent.isGenesys()) {
            // TODO: Wrap in SSML Speak Tag if needed.
        }
    }
}
exports.Genesys = Genesys;
//# sourceMappingURL=Genesys.js.map