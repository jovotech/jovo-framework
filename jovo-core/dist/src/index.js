"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("./util/Log");
const Project_1 = require("./util/Project");
exports.Project = Project_1.Project.getInstance();
function config(cfg) {
    return cfg || {};
}
exports.config = config;
try {
    // do not use source map support with jest.
    if (process.env.JEST_WORKER_ID === undefined) {
        require('source-map-support').install(); // tslint:disable-line
    }
}
catch (error) {
    Log_1.Log.error(error);
}
var BaseApp_1 = require("./core/BaseApp");
exports.BaseApp = BaseApp_1.BaseApp;
var ActionSet_1 = require("./core/ActionSet");
exports.ActionSet = ActionSet_1.ActionSet;
var Jovo_1 = require("./core/Jovo");
exports.Jovo = Jovo_1.Jovo;
var enums_1 = require("./enums");
exports.EnumRequestType = enums_1.EnumRequestType;
exports.SessionConstants = enums_1.SessionConstants;
var SpeechBuilder_1 = require("./util/SpeechBuilder");
exports.SpeechBuilder = SpeechBuilder_1.SpeechBuilder;
var Middleware_1 = require("./core/Middleware");
exports.Middleware = Middleware_1.Middleware;
var Platform_1 = require("./core/Platform");
exports.Platform = Platform_1.Platform;
var TestSuite_1 = require("./TestSuite");
exports.TestSuite = TestSuite_1.TestSuite;
var Conversation_1 = require("./util/Conversation");
exports.Conversation = Conversation_1.Conversation;
var Extensible_1 = require("./core/Extensible");
exports.Extensible = Extensible_1.Extensible;
var Cms_1 = require("./util/Cms");
exports.Cms = Cms_1.Cms;
var BaseCmsPlugin_1 = require("./plugins/BaseCmsPlugin");
exports.BaseCmsPlugin = BaseCmsPlugin_1.BaseCmsPlugin;
var JovoError_1 = require("./errors/JovoError");
exports.JovoError = JovoError_1.JovoError;
exports.ErrorCode = JovoError_1.ErrorCode;
var HandleRequest_1 = require("./core/HandleRequest");
exports.HandleRequest = HandleRequest_1.HandleRequest;
var AsrData_1 = require("./core/AsrData");
exports.AsrData = AsrData_1.AsrData;
var NluData_1 = require("./core/NluData");
exports.NluData = NluData_1.NluData;
var InvalidValuesValidator_1 = require("./plugins/validators/InvalidValuesValidator");
exports.InvalidValuesValidator = InvalidValuesValidator_1.InvalidValuesValidator;
var IsRequiredValidator_1 = require("./plugins/validators/IsRequiredValidator");
exports.IsRequiredValidator = IsRequiredValidator_1.IsRequiredValidator;
var Validator_1 = require("./plugins/validators/Validator");
exports.Validator = Validator_1.Validator;
var ValidatorError_1 = require("./plugins/validators/ValidatorError");
exports.ValidationError = ValidatorError_1.ValidationError;
var ValidValuesValidator_1 = require("./plugins/validators/ValidValuesValidator");
exports.ValidValuesValidator = ValidValuesValidator_1.ValidValuesValidator;
var Util_1 = require("./util/Util");
exports.Util = Util_1.Util;
var Log_2 = require("./util/Log");
exports.LogLevel = Log_2.LogLevel;
exports.Log = Log_2.Log;
exports.Logger = Log_2.Logger;
var User_1 = require("./core/User");
exports.User = User_1.User;
var ComponentPlugin_1 = require("./plugins/ComponentPlugin");
exports.ComponentPlugin = ComponentPlugin_1.ComponentPlugin;
var Component_1 = require("./plugins/Component");
exports.Component = Component_1.Component;
var Router_1 = require("./plugins/Router");
exports.Router = Router_1.Router;
__export(require("./util/HttpService"));
__export(require("./util/AudioEncoder"));
var I18Next_1 = require("./plugins/I18Next");
exports.I18Next = I18Next_1.I18Next;
//# sourceMappingURL=index.js.map