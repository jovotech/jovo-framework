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
var CorePlatformResponse_1 = require("./CorePlatformResponse");
var CorePlatformSpeechBuilder_1 = require("./CorePlatformSpeechBuilder");
var CorePlatformApp = /** @class */ (function (_super) {
    __extends(CorePlatformApp, _super);
    function CorePlatformApp(app, host, handleRequest) {
        var _this = _super.call(this, app, host, handleRequest) || this;
        _this.$webAssistantSkill = _this;
        _this.$response = new CorePlatformResponse_1.CorePlatformResponse();
        _this.$speech = new CorePlatformSpeechBuilder_1.CorePlatformSpeechBuilder(_this);
        _this.$reprompt = new CorePlatformSpeechBuilder_1.CorePlatformSpeechBuilder(_this);
        return _this;
    }
    CorePlatformApp.prototype.getDeviceId = function () {
        return undefined;
    };
    CorePlatformApp.prototype.getLocale = function () {
        return this.$request ? this.$request.getLocale() : undefined;
    };
    CorePlatformApp.prototype.getPlatformType = function () {
        return 'WebAssistant';
    };
    CorePlatformApp.prototype.getRawText = function () {
        return this.$request ? this.$request.text : undefined;
    };
    CorePlatformApp.prototype.getSelectedElementId = function () {
        return undefined;
    };
    CorePlatformApp.prototype.getTimestamp = function () {
        return this.$request ? this.$request.getTimestamp() : undefined;
    };
    CorePlatformApp.prototype.getType = function () {
        return 'CorePlatformApp';
    };
    CorePlatformApp.prototype.hasAudioInterface = function () {
        return this.$request.hasAudioInterface();
    };
    CorePlatformApp.prototype.hasScreenInterface = function () {
        return this.$request.hasScreenInterface();
    };
    CorePlatformApp.prototype.hasVideoInterface = function () {
        return this.$request.hasVideoInterface();
    };
    CorePlatformApp.prototype.hasTextInput = function () {
        return this.$request.hasTextInput();
    };
    CorePlatformApp.prototype.isNewSession = function () {
        return this.$request ? this.$request.isNewSession() : false;
    };
    CorePlatformApp.prototype.speechBuilder = function () {
        return this.getSpeechBuilder();
    };
    CorePlatformApp.prototype.getSpeechBuilder = function () {
        return new CorePlatformSpeechBuilder_1.CorePlatformSpeechBuilder(this);
    };
    return CorePlatformApp;
}(jovo_core_1.Jovo));
exports.CorePlatformApp = CorePlatformApp;
