"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const DialogflowUser_1 = require("../../DialogflowUser");
class GenesysUser extends DialogflowUser_1.DialogflowUser {
    constructor(jovo) {
        super(jovo);
    }
    getAccessToken() {
        return undefined;
    }
    getId() {
        // the original Payload does not come with a id like Caller-ID.
        // TODO: A call to the Genesys API can get us caller ID
        // purecloud-platform-client-v2.ConversationsApi.getAnalyticsConversationDetails(conversationId);
        // ani: response.participants[0].sessions[0].ani
        return 'GenericGenesysUser';
    }
    getNoInputLimit() {
        return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.Genesys-No-Input-Limit');
    }
    getConversationId() {
        return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.Genesys-Conversation-Id');
    }
    getNoInputCount() {
        return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.Genesys-No-Input-Count');
    }
}
exports.GenesysUser = GenesysUser;
//# sourceMappingURL=GenesysUser.js.map