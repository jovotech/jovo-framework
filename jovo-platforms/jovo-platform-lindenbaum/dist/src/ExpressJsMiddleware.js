"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
exports.expressJsMiddleware = (app) => {
    return async (req, res, next) => {
        if (req.originalUrl.endsWith('/webhook/session?') ||
            req.originalUrl.endsWith('/webhook/message?') ||
            req.originalUrl.endsWith('/webhook/terminated?') ||
            req.originalUrl.endsWith('/webhook/inactivity?')) {
            await app.handle(new jovo_framework_1.ExpressJS(req, res));
        }
        else {
            next();
        }
    };
};
//# sourceMappingURL=ExpressJsMiddleware.js.map