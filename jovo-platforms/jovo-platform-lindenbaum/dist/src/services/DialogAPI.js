"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class DialogAPI {
    static async getDialogData(options) {
        const url = `${this.baseUrl}/dialog/${options.resellerToken}/${options.dialogId}`;
        const response = await jovo_core_1.HttpService.get(url);
        return response;
    }
    static async deleteDialogData(options) {
        const url = `${this.baseUrl}/dialog/${options.resellerToken}/${options.dialogId}`;
        const response = await jovo_core_1.HttpService.delete(url);
        return response;
    }
}
exports.DialogAPI = DialogAPI;
DialogAPI.baseUrl = 'https://cognitivevoice.io/dialog';
//# sourceMappingURL=DialogAPI.js.map