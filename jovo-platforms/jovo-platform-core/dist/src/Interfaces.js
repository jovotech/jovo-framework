"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// region request-types
var RequestType;
(function (RequestType) {
    RequestType["Launch"] = "LAUNCH";
    RequestType["Intent"] = "INTENT";
    RequestType["TranscribedText"] = "TRANSCRIBED_TEXT";
    RequestType["Text"] = "TEXT";
    RequestType["Event"] = "EVENT";
    RequestType["Audio"] = "AUDIO";
    RequestType["End"] = "END";
    RequestType["Error"] = "ERROR";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
var DeviceType;
(function (DeviceType) {
    DeviceType["Unspecified"] = "UNSPECIFIED";
    DeviceType["Audio"] = "AUDIO";
    DeviceType["Browser"] = "BROWSER";
})(DeviceType = exports.DeviceType || (exports.DeviceType = {}));
var Capability;
(function (Capability) {
    Capability["Audio"] = "AUDIO";
    Capability["Html"] = "HTML";
    Capability["Text"] = "TEXT";
})(Capability = exports.Capability || (exports.Capability = {}));
// endregion
// region response-types
var ActionType;
(function (ActionType) {
    ActionType["Text"] = "TEXT";
    ActionType["Speech"] = "SPEECH";
    ActionType["Audio"] = "AUDIO";
    ActionType["Visual"] = "VISUAL";
    ActionType["Processing"] = "PROCESSING";
    ActionType["Custom"] = "CUSTOM";
    ActionType["SequenceContainer"] = "SEQ_CONTAINER";
    ActionType["ParallelContainer"] = "PAR_CONTAINER";
    ActionType["QuickReply"] = "QUICK_REPLY";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
// endregion
//# sourceMappingURL=Interfaces.js.map