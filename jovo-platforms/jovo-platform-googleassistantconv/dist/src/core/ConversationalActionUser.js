"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const uuidv4 = require("uuid/v4");
class ConversationalActionUser extends jovo_core_1.User {
    constructor(conversationalAction) {
        super(conversationalAction);
        this.$params = {};
        this.conversationalAction = conversationalAction;
        this.$params = Object.assign({}, conversationalAction.$request.user.params);
        if (!this.$params.userId) {
            this.$params.userId = uuidv4();
        }
    }
    getId() {
        return this.$params.userId;
    }
    async getGoogleProfile() {
        const token = this.conversationalAction.$host.headers['Authorization'] ||
            this.conversationalAction.$host.headers['authorization'];
        if (!token) {
            throw new jovo_core_1.JovoError('No valid authorization token found. Make sure account linking worked!');
        }
        const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
        try {
            const response = await jovo_core_1.HttpService.get(url);
            if (response.status === 200 && response.data) {
                return response.data;
            }
            throw new jovo_core_1.JovoError(`Couldn't load user profile: ${JSON.stringify(response.data)}`);
        }
        catch (e) {
            throw e;
        }
    }
    isAccountLinked() {
        var _a;
        const request = this.conversationalAction.$request;
        return ((_a = request.user) === null || _a === void 0 ? void 0 : _a.accountLinkingStatus) === 'LINKED';
    }
    isVerified() {
        var _a;
        const request = this.conversationalAction.$request;
        return ((_a = request.user) === null || _a === void 0 ? void 0 : _a.verificationStatus) === 'VERIFIED';
    }
    getEntitlements() {
        var _a;
        const request = this.conversationalAction.$request;
        return (_a = request.user) === null || _a === void 0 ? void 0 : _a.packageEntitlements;
    }
}
exports.ConversationalActionUser = ConversationalActionUser;
//# sourceMappingURL=ConversationalActionUser.js.map