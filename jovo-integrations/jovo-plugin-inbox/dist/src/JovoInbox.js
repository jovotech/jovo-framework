"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("./interfaces");
const _merge = require("lodash.merge");
const SqlInbox_1 = require("./SqlInbox");
const InboxLog_1 = require("./entity/InboxLog");
const uuid_1 = require("uuid");
const _get = require("lodash.get");
const _set = require("lodash.set");
const _unset = require("lodash.unset");
class JovoInbox {
    constructor(config) {
        this.config = config;
        this.inboxDb = new SqlInbox_1.SqlInbox(config.db);
    }
    async add(inboxLog) {
        await this.inboxDb.add(inboxLog);
    }
    async close() {
        await this.inboxDb.close();
    }
}
exports.JovoInbox = JovoInbox;
class JovoInboxPlugin {
    constructor(config) {
        this.config = {
            enabled: true,
            defaultLocale: 'en',
            skipPlatforms: [],
            skipLocales: [],
            skipUserIds: [],
            skipRequestObjects: [],
            skipResponseObjects: [],
            maskRequestObjects: [
                'context.System.apiAccessToken',
                'context.System.user.permissions.consentToken',
            ],
            maskResponseObjects: [],
            maskValue: '-',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app) {
        app.middleware('platform.init').use(async (handleRequest) => {
            var _a, _b, _c, _d;
            if (!handleRequest.jovo) {
                return;
            }
            if (!handleRequest.$data) {
                handleRequest.$data = {};
            }
            const userId = (_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.$user.getId();
            const platform = handleRequest.jovo.getPlatformType();
            const locale = handleRequest.jovo.$request.getLocale() || this.config.defaultLocale;
            const skipUserIds = (_b = this.config.skipUserIds) === null || _b === void 0 ? void 0 : _b.includes(userId);
            const skipPlatform = (_c = this.config.skipPlatforms) === null || _c === void 0 ? void 0 : _c.includes(platform);
            const skipLocale = (_d = this.config.skipLocales) === null || _d === void 0 ? void 0 : _d.includes(locale);
            handleRequest.$data = {
                requestId: uuid_1.v4(),
                skip: skipUserIds || skipPlatform || skipLocale,
            };
            if (handleRequest.$data.skip) {
                return;
            }
            handleRequest.jovo.$inbox = new JovoInbox(this.config);
            const inboxLog = this.buildLog(handleRequest);
            inboxLog.type = interfaces_1.InboxLogType.REQUEST;
            inboxLog.payload = this.modifyObject(handleRequest.jovo.$request, this.config.maskRequestObjects, this.config.skipRequestObjects);
            await handleRequest.jovo.$inbox.add(inboxLog);
        });
        app.middleware('response').use(async (handleRequest) => {
            if (!handleRequest.jovo.$inbox || handleRequest.$data.skip) {
                return;
            }
            const inboxLog = this.buildLog(handleRequest);
            inboxLog.type = interfaces_1.InboxLogType.RESPONSE;
            inboxLog.payload = this.modifyObject(handleRequest.jovo.$response, this.config.maskResponseObjects, this.config.skipResponseObjects);
            await handleRequest.jovo.$inbox.add(inboxLog);
        });
        app.middleware('fail').use(async (handleRequest) => {
            if (!handleRequest.jovo.$inbox || !handleRequest.error) {
                return;
            }
            if (handleRequest.$data.skip) {
                return;
            }
            const payload = {
                message: handleRequest.error.message,
                stackTrace: handleRequest.error.stack,
            };
            const inboxLog = this.buildLog(handleRequest);
            inboxLog.type = interfaces_1.InboxLogType.ERROR;
            inboxLog.payload = payload;
            await handleRequest.jovo.$inbox.add(inboxLog);
        });
        app.middleware('after.response').use(async (handleRequest) => {
            // TODO: performance should be tested. close connection after every request?
            // await handleRequest.jovo!.$inbox!.close();
        });
    }
    /**
     * Builds initial InboxLog object with data that is used by every log type.
     * @param handleRequest
     */
    buildLog(handleRequest) {
        var _a;
        const inboxLog = new InboxLog_1.InboxLogEntity();
        inboxLog.appId = this.config.appId;
        inboxLog.createdAt = new Date();
        inboxLog.locale = handleRequest.jovo.$request.getLocale() || this.config.defaultLocale;
        inboxLog.platform = handleRequest.jovo.getPlatformType();
        // not all platforms have a getRequestId() method
        try {
            // tslint:disable-next-line:no-any
            inboxLog.requestId = handleRequest.jovo.$request.getRequestId();
        }
        catch (e) {
            inboxLog.requestId = handleRequest.$data.requestId;
        }
        inboxLog.sessionId = handleRequest.jovo.$request.getSessionId() || 'no-session';
        inboxLog.userId = (_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.$user.getId();
        return inboxLog;
    }
    /**
     * Skips objects provided in skipArray, masks objects provided in maskArray
     * @param obj
     * @param maskArray
     * @param skipArray
     */
    // tslint:disable-next-line:no-any
    modifyObject(obj, maskArray, skipArray) {
        const copy = Object.assign({}, obj);
        if (maskArray && maskArray.length > 0) {
            maskArray.forEach((maskPath) => {
                const value = _get(copy, maskPath);
                if (value && this.config.maskValue) {
                    let newValue = this.config.maskValue;
                    if (typeof newValue === 'function') {
                        newValue = this.config.maskValue(value);
                    }
                    _set(copy, maskPath, newValue);
                }
            });
        }
        if (skipArray && skipArray.length > 0) {
            skipArray.forEach((path) => {
                if (_get(copy, path)) {
                    _unset(copy, path);
                }
            });
        }
        return copy;
    }
}
exports.JovoInboxPlugin = JovoInboxPlugin;
//# sourceMappingURL=JovoInbox.js.map