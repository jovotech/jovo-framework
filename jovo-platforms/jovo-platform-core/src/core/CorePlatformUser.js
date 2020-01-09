"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var jovo_core_1 = require("jovo-core");
var CorePlatformUser = /** @class */ (function (_super) {
    __extends(CorePlatformUser, _super);
    function CorePlatformUser(assistantSkill) {
        var _this = _super.call(this, assistantSkill) || this;
        _this.assistantSkill = assistantSkill;
        return _this;
    }
    CorePlatformUser.prototype.getAccessToken = function () {
        return this.assistantSkill.$request.getAccessToken();
    };
    CorePlatformUser.prototype.getId = function () {
        return this.assistantSkill.$request.getUserId();
    };
    return CorePlatformUser;
}(jovo_core_1.User));
exports.CorePlatformUser = CorePlatformUser;
