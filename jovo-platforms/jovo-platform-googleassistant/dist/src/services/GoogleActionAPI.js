"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const GoogleActionAPIResponse_1 = require("./GoogleActionAPIResponse");
class GoogleActionAPI {
    static async apiCall(options) {
        const url = options.endpoint + options.path;
        const config = {
            data: options.json,
            url,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.permissionToken}`,
            },
        };
        const response = await jovo_core_1.HttpService.request(config);
        if (response.status !== 204 && response.data) {
            return new GoogleActionAPIResponse_1.GoogleActionAPIResponse(response.status, response.data);
        }
        return new GoogleActionAPIResponse_1.GoogleActionAPIResponse(response.status, {});
    }
}
exports.GoogleActionAPI = GoogleActionAPI;
//# sourceMappingURL=GoogleActionAPI.js.map