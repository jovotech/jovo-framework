"use strict";
exports.__esModule = true;
var ua = require("universal-analytics");
var _merge = require("lodash.merge");
;
var GoogleAnalyticsSender = /** @class */ (function () {
    //      "allowSyntheticDefaultImports": true
    function GoogleAnalyticsSender(config) {
        this.config = {
            'accountId': "137484785",
            'adobeHostURL': "https://Jovo.sc.omtrdc.net"
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        //this.SendDataToAnalytics()
    }
    GoogleAnalyticsSender.prototype.install = function (app) {
        app.middleware('response').use(this.SendDataToAnalytics.bind(this));
    };
    GoogleAnalyticsSender.prototype.uninstall = function (parent) {
        throw new Error("Method not implemented.");
    };
    GoogleAnalyticsSender.prototype.SendDataToAnalytics = function (handleRequest) {
        var visitor = ua(this.config.accountId);
        visitor.pageview(handleRequest.jovo.$request.getIntentName());
    };
    return GoogleAnalyticsSender;
}());
exports.GoogleAnalyticsSender = GoogleAnalyticsSender;
