"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class AmazonProfileAPI {
    /**
     * Makes a request to the amazon profile api
     */
    static async requestAmazonProfile(acccessToken) {
        const url = `https://api.amazon.com/user/profile?access_token=${acccessToken}`;
        let error;
        try {
            const response = await jovo_core_1.HttpService.get(url);
            const contentType = response.headers['content-type'] || '';
            if (response.status !== 200) {
                error = new Error('Something went wrong');
            }
            else if (!/^application\/json/.test(contentType)) {
                error = new Error('Wrong content type');
            }
            if (response.data && !error) {
                return response.data;
            }
        }
        catch (e) {
            error = new Error('Something went wrong');
        }
        if (error) {
            throw error;
        }
    }
}
exports.AmazonProfileAPI = AmazonProfileAPI;
//# sourceMappingURL=AmazonProfileAPI.js.map