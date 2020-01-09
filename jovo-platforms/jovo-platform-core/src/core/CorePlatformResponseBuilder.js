"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CorePlatformResponse_1 = require("./CorePlatformResponse");
var CorePlatformResponseBuilder = /** @class */ (function () {
    function CorePlatformResponseBuilder() {
    }
    CorePlatformResponseBuilder.prototype.create = function (json) {
        // tslint:disable-line
        return CorePlatformResponse_1.CorePlatformResponse.fromJSON(json);
    };
    return CorePlatformResponseBuilder;
}());
exports.CorePlatformResponseBuilder = CorePlatformResponseBuilder;
