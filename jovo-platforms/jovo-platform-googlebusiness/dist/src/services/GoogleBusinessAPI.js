"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const jovo_core_1 = require("jovo-core");
class GoogleBusinessAPI {
    static async sendResponse({ data, sessionId, serviceAccount, }) {
        var _a, _b;
        const options = {
            data,
            endpoint: 'https://businessmessages.googleapis.com/v1',
            path: `/conversations/${sessionId}/messages`,
            serviceAccount,
        };
        try {
            return this.apiCall(options);
        }
        catch (e) {
            throw new jovo_core_1.JovoError('Could not send response!', jovo_core_1.ErrorCode.ERR_PLUGIN, this.constructor.name, ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message || e, `Status: ${(_b = e.response) === null || _b === void 0 ? void 0 : _b.status}`);
        }
    }
    static async apiCall(options) {
        const token = await this.getApiAccessToken(options.serviceAccount);
        const url = options.endpoint + options.path;
        const config = {
            data: options.data,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            method: options.method || 'POST',
            url,
        };
        return jovo_core_1.HttpService.request(config);
    }
    static async getApiAccessToken(serviceAccount) {
        try {
            const jwtClient = new google_auth_library_1.JWT(serviceAccount.client_email, undefined, serviceAccount.private_key, ['https://www.googleapis.com/auth/businessmessages'], undefined);
            const token = await jwtClient.authorize();
            return token.access_token;
        }
        catch (e) {
            return Promise.reject(new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-platform-googlebusiness'));
        }
    }
}
exports.GoogleBusinessAPI = GoogleBusinessAPI;
//# sourceMappingURL=GoogleBusinessAPI.js.map