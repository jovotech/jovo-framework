"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const Lindenbaum_1 = require("../Lindenbaum");
const LindenbaumResponse_1 = require("./LindenbaumResponse");
const LindenbaumUser_1 = require("./LindenbaumUser");
const LindenbaumSpeechBuilder_1 = require("./LindenbaumSpeechBuilder");
const DialogAPI_1 = require("../services/DialogAPI");
class LindenbaumBot extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$lindenbaumBot = this;
        this.$response = new LindenbaumResponse_1.LindenbaumResponse();
        this.$speech = new LindenbaumSpeechBuilder_1.LindenbaumSpeechBuilder(this);
        // $reprompt object has to be added even if the platform doesn't use it.
        // Is used by users as platform independent feature
        this.$reprompt = new LindenbaumSpeechBuilder_1.LindenbaumSpeechBuilder(this);
        this.$user = new LindenbaumUser_1.LindenbaumUser(this);
        this.$output.Lindenbaum = [];
    }
    setResponses(responses) {
        const response = this.$response;
        response.responses = responses;
        return this;
    }
    /**
     * Calls the `/call/drop` endpoint to terminate the call
     */
    addDrop() {
        this.$output.Lindenbaum.push({
            '/call/drop': {
                dialogId: this.$request.getSessionId(),
            },
        });
        return this;
    }
    /**
     * Calls the `/call/bridge` endpoint to bridge the call to `headNumber`
     * @param {number} extensionLength
     * @param {string} headNumber
     */
    addBridge(extensionLength, headNumber) {
        this.$output.Lindenbaum.push({
            '/call/bridge': {
                dialogId: this.$request.getSessionId(),
                extensionLength,
                headNumber,
            },
        });
        return this;
    }
    /**
     * Calls the `/call/forward` endpoint to forward the call to `destinationNumber`
     * @param {string} destinationNumber
     */
    addForward(destinationNumber) {
        this.$output.Lindenbaum.push({
            '/call/forward': {
                dialogId: this.$request.getSessionId(),
                destinationNumber,
            },
        });
        return this;
    }
    /**
     * Calls the `/call/data` endpoint to save additional data on the conversations
     * @param {string} key
     * @param {string} value
     */
    addData(key, value) {
        this.$output.Lindenbaum.push({
            '/call/data': {
                dialogId: this.$request.getSessionId(),
                key,
                value,
            },
        });
        return this;
    }
    isNewSession() {
        if (this.$user.$session) {
            return this.$user.$session.id !== this.$request.getSessionId();
        }
        else {
            return false;
        }
    }
    hasAudioInterface() {
        return this.$request.hasAudioInterface();
    }
    hasScreenInterface() {
        return this.$request.hasScreenInterface();
    }
    hasVideoInterface() {
        return this.$request.hasVideoInterface();
    }
    getSpeechBuilder() {
        return new LindenbaumSpeechBuilder_1.LindenbaumSpeechBuilder(this);
    }
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    getDeviceId() {
        return undefined;
    }
    getRawText() {
        const request = this.$request;
        return request.getRawText();
    }
    getTimestamp() {
        return this.$request.getTimestamp();
    }
    getLocale() {
        return this.$request.getLocale();
    }
    getType() {
        return Lindenbaum_1.Lindenbaum.appType;
    }
    getPlatformType() {
        return Lindenbaum_1.Lindenbaum.type;
    }
    getSelectedElementId() {
        return undefined;
    }
    getAudioData() {
        return undefined;
    }
    /**
     * Returns the dialog data for the parsed `dialogId`.
     * If `dialogId` is not parsed, it uses the current request's `dialogId` property
     * @param {string} resellerToken
     * @param {string | undefined} dialogId
     * @returns {Promise<AxiosResponse<DialogAPIData>>}
     */
    async getDialogData(resellerToken, dialogId) {
        const request = this.$request;
        const options = {
            resellerToken,
            dialogId: dialogId || request.dialogId,
        };
        return DialogAPI_1.DialogAPI.getDialogData(options);
    }
    /**
     * Delete the dialog data for the parsed `dialogId`.
     * If `dialogId` is not parsed, it uses the current request's `dialogId` property
     * @param {string} resellerToken
     * @param {string | undefined} dialogId
     * @returns {Promise<AxiosResponse>}
     */
    async deleteDialogData(resellerToken, dialogId) {
        const request = this.$request;
        const options = {
            resellerToken,
            dialogId: dialogId || request.dialogId,
        };
        return DialogAPI_1.DialogAPI.deleteDialogData(options);
    }
}
exports.LindenbaumBot = LindenbaumBot;
//# sourceMappingURL=LindenbaumBot.js.map