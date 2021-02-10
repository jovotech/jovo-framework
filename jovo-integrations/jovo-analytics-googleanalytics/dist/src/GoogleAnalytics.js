"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ua = require("universal-analytics");
const _merge = require("lodash.merge");
const crypto = require("crypto");
const jovo_core_1 = require("jovo-core");
const helper_1 = require("./helper");
class GoogleAnalytics {
    constructor(config) {
        this.config = {
            trackingId: '',
            enableAutomaticEvents: true,
            trackEndReasons: false,
            sessionTimeoutInMinutes: 5,
            skipUnverifiedUser: true,
            systemMetrics: [
                ['Stop', 1],
                ['ERROR', 2],
                ['EXCEEDED_MAX_REPROMPTS', 3],
                ['PlayTimeLimitReached', 4],
                ['USER_INITIATED', 5],
                ['undefined', 6],
            ],
            systemDimensions: [
                ['uuid', 1]
            ]
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.systemMetricsIndices = new Map(this.config.systemMetrics);
        this.systemDimensionsIndices = new Map(this.config.systemDimensions);
    }
    /**
     * Need to save start state -\> will change during handling
     * Need to save lastUsed for calculation timeouts (sessionEnded bug display devices)
     *
     * @param handleRequest - jovo HandleRequest objekt
     */
    static saveStartStateAndLastUsed(handleRequest) {
        const { jovo } = handleRequest;
        if (jovo) {
            const stateString = jovo.getState() ? jovo.getState() : '/';
            jovo.$data.startState = stateString;
            jovo.$data.lastUsedAt = jovo === null || jovo === void 0 ? void 0 : jovo.$user.$metaData.lastUsedAt;
        }
    }
    /**
     * Get end reason from session variables
     *
     * @param jovo - unser liebes Jovo objekt.
     * @returns - the endreason saved in the session data.
     */
    static getEndReason(jovo) {
        const endReason = jovo.$session.$data.endReason;
        return endReason;
    }
    install(app) {
        if (!this.config.trackingId) {
            throw new jovo_core_1.JovoError('trackingId has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', '', 'You can find your tracking id in Google Analytics by clicking: Admin -> Property Settings -> Tracking Id', 'https://www.jovo.tech/docs/analytics/googleanalytics');
        }
        app.middleware('before.handler').use(GoogleAnalytics.saveStartStateAndLastUsed.bind(this));
        app.middleware('after.platform.init').use(this.setGoogleAnalyticsObject.bind(this));
        app.middleware('after.response').use(this.track.bind(this));
        app.middleware('fail').use(this.sendError.bind(this));
    }
    /**
     * Set custom metric for next pageview
     * Throws error if metricName is not mapped to an index in your config
     * @param name - metricName
     * @param targetValue - target value in googleAnalytics
     */
    setSystemMetric(name, targetValue) {
        var _a;
        // Set user id as a custom dimension to track hits on the same scope
        const metricNumber = this.systemMetricsIndices.get(name); //uuid);
        if (!metricNumber) {
            throw new jovo_core_1.JovoError(`Trying to set custom system metric ${name} which is not set.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', 'Google Analytics sets some custom dimensions and metrics per default', `Set systemMetrics in your config (which is an tuple Array mapping systemMetrics to GoogleAnalytics indices) and add ${name}`, 'See readme for more information');
        }
        (_a = this.visitor) === null || _a === void 0 ? void 0 : _a.set(`cm${metricNumber}`, targetValue);
    }
    /**
    * Set custom dimension for next pageview
    * Throws error if dimensionName is not mapped to an index in your config
    * @param name - dimensionName
    * @param targetValue - target value in googleAnalytics
    */
    setSystemDimension(name, targetValue) {
        var _a;
        // Set user id as a custom dimension to track hits on the same scope
        const dimnensionNumber = this.systemDimensionsIndices.get(name); //uuid);
        if (!dimnensionNumber) {
            throw new jovo_core_1.JovoError(`Trying to set custom system dimension ${name} which is not set.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', 'Google Analytics sets some custom dimensions and metrics per default', `Set systemDimensions in your config (which is an tuple Array mapping systemDimensions to GoogleAnalytics indices) and add ${name}`, 'See readme for more information');
        }
        (_a = this.visitor) === null || _a === void 0 ? void 0 : _a.set(`cd${dimnensionNumber}`, targetValue);
    }
    /**
     * Sets end reason to session variables + updates google analytics metric
     *
     * @param jovo - unser liebes Jovo objekt
     * @param endReason - grund für session ende
     */
    setEndReason(jovo, endReason) {
        jovo.$session.$data.endReason = endReason;
        const gaMetricNumber = this.systemMetricsIndices.get(endReason);
        if (gaMetricNumber) {
            jovo.$googleAnalytics.setCustomMetric(gaMetricNumber, '1');
        }
        else {
            const undefinedMetricNumber = this.systemMetricsIndices.get('undefined');
            if (undefinedMetricNumber) {
                jovo.$googleAnalytics.setCustomMetric(undefinedMetricNumber, '1');
            }
        }
    }
    /**
     * Auto send intent data after each response. Also setting sessions and flowErrors
     * @param handleRequest
     */
    track(handleRequest) {
        var _a;
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
        }
        if (helper_1.Helper.getDiffToLastVisitInMinutes(jovo) > this.config.sessionTimeoutInMinutes &&
            !jovo.isNewSession()) {
            return;
        }
        // Validate current request type
        const { type: requestType } = jovo.getRoute();
        const invalidRequestTypes = ['AUDIOPLAYER'];
        if (!this.config.trackDirectives && invalidRequestTypes.includes(requestType)) {
            return;
        }
        // Either start or stop the session. If sessionTag is undefined, it will be ignored.
        const sessionTag = this.getSessionTag(jovo);
        this.visitor.set('sessionControl', sessionTag);
        // Track custom set data as custom metrics or dimensions.
        const customData = jovo.$googleAnalytics.$data;
        for (const [key, value] of Object.entries(customData)) {
            if (key.startsWith('cm') || key.startsWith('cd')) {
                this.visitor.set(key, value);
            }
        }
        // Track intent data.
        const pageview = this.visitor.pageview(this.getPageParameters(jovo));
        if (this.config.enableAutomaticEvents) {
            // Detect and send FlowErrors
            this.sendUnhandledEvents(jovo);
            this.sendIntentInputEvents(jovo);
        }
        (_a = this.visitor) === null || _a === void 0 ? void 0 : _a.send((err) => {
            if (err) {
                throw new jovo_core_1.JovoError(err.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
            }
        });
    }
    /**
     * Initiates GoogleAnalytics visitor object with fixed parameters.
     * @param {object} jovo: Jovo object for data like language or platform
     */
    initVisitor(jovo) {
        const uuid = this.getUserId(jovo);
        // Initialize visitor with account id and custom client id
        const visitor = ua(this.config.trackingId, uuid, { strictCidFormat: false });
        visitor.set('userId', uuid);
        visitor.set('dataSource', jovo.getType());
        visitor.set('userLanguage', jovo.getLocale());
        this.setSystemDimension('uuid', uuid);
        this.visitor = visitor;
    }
    /**
     * Tracks uncaught user exceptions.
     * @param {object} handleRequest: HandleRequest to act upon
     */
    sendError(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            // don't send anything
            return;
        }
        // Stop the current tracking session.
        this.visitor.set('sessionControl', 'end');
        this.visitor.pageview(this.getPageParameters(jovo), (err) => {
            if (err) {
                throw new jovo_core_1.JovoError(err.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
            }
        })
            .exception(handleRequest.error.name)
            .send();
    }
    /**
     * Detects and sends flow errors, ranging from nlu errors to bugs in the skill handler.
     * @param {object} jovo: Jovo object
     */
    sendUnhandledEvents(jovo) {
        const intent = jovo.$request.getIntentName();
        const { path } = jovo.getRoute();
        // Check if an error in the nlu model occurred.
        if (intent === 'AMAZON.FallbackIntent' || intent === 'Default Fallback Intent') {
            return this.sendUserEvent(jovo, 'UnhandledEvents', 'NLU_Unhandled');
        }
        // If the current path is unhandled, an error in the skill handler occurred.
        if (path.endsWith('Unhandled')) {
            return this.sendUserEvent(jovo, 'UnhandledEvents', 'Skill_Unhandled');
        }
    }
    /**
     * Extract input from intent + send to googleAnalytics via events
     * @param jovo Jovo object
     */
    sendIntentInputEvents(jovo) {
        if (jovo.$inputs) {
            for (const [key, value] of Object.entries(jovo.$inputs)) {
                if (!value.key) {
                    continue;
                }
                const params = {
                    eventCategory: 'Inputs',
                    eventAction: value.key,
                    eventLabel: key,
                };
                this.visitor.event(params);
            }
        }
    }
    /**
     * Construct pageview parameters, a.k.a intent tracking data.
     * @param {object} jovo: Jovo object
     * @returns {object} pageParameters: Intent data to track
     */
    getPageParameters(jovo) {
        var _a, _b;
        const intentType = (_a = jovo.$type.type) !== null && _a !== void 0 ? _a : 'fallBackType';
        const intentName = (_b = jovo.$request) === null || _b === void 0 ? void 0 : _b.getIntentName();
        const customParameters = jovo.$googleAnalytics.$parameters;
        return Object.assign(Object.assign({}, customParameters), { documentPath: this.getPageName(jovo), documentHostName: jovo.$data.startState ? jovo.$data.startState : '/', documentTitle: intentName || intentType });
    }
    /**
     * Change state to startState + root intent (not mappedIntent)
     *
     * @param jovo - unser liebes Jovo objekt
     * @override
     */
    getPageName(jovo) {
        var _a, _b;
        const endReason = this.getSessionTag(jovo) === 'end' && GoogleAnalytics.getEndReason(jovo)
            ? GoogleAnalytics.getEndReason(jovo)
            : jovo.$type.type;
        const intentName = ((_a = jovo.$request) === null || _a === void 0 ? void 0 : _a.getIntentName()) ? (_b = jovo.$request) === null || _b === void 0 ? void 0 : _b.getIntentName() : endReason;
        const state = jovo.$data.startState ? jovo.$data.startState : '/';
        return `${state}.${intentName}`;
    }
    /**
     * Generates hash for userId.
     * @param {object} jovo: Jovo object
     * @returns {string} uuid: Hashed user id
     */
    getUserId(jovo) {
        const idHash = crypto.createHash('sha256').update(jovo.$user.getId()).digest('base64');
        return idHash;
    }
    /**
     * Checks if the current session started or ended.
     * @param {object} jovo: Jovo object
     * @returns {string | void} sessionTag: Corresponding session tag (start|end|undefined)
     */
    getSessionTag(jovo) {
        if (jovo.getMappedIntentName() === 'END' ||
            jovo.$type.type === 'END' ||
            (jovo.$response && jovo.$response.isTell())) {
            return 'end';
        }
        if (jovo.isNewSession()) {
            return 'start';
        }
    }
    /**
     * User Events ties users to event category and action
     * @param {object} jovo: Jovo object
     * @param {string} eventName maps to category -> eventGroup
     * @param {string} eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(jovo, eventCategory, eventAction) {
        const params = {
            eventCategory,
            eventAction,
            eventLabel: this.getUserId(jovo),
            documentPath: jovo.getRoute().path,
        };
        this.visitor.event(params);
    }
    /**
     * Sets the analytics variable to the instance of this object for making it accessable in skill code
     * @param handleRequest
     */
    setGoogleAnalyticsObject(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
        }
        // Initialise visitor object.
        this.initVisitor(jovo);
        // Initialise googleAnalytics object.
        jovo.$googleAnalytics = {
            $data: {},
            $parameters: {},
            sendEvent: (params) => {
                this.visitor.event(params, (err) => {
                    if (err) {
                        throw new jovo_core_1.JovoError(err.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
                    }
                }).send();
            },
            sendTransaction: (params) => {
                this.visitor.transaction(params, (err) => {
                    if (err) {
                        throw new jovo_core_1.JovoError(err.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
                    }
                }).send();
            },
            sendItem: (params) => {
                this.visitor.transaction(params, (err) => {
                    if (err) {
                        throw new jovo_core_1.JovoError(err.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
                    }
                }).send();
            },
            sendUserEvent: (eventCategory, eventAction) => {
                this.sendUserEvent(jovo, eventCategory, eventAction);
            },
            setCustomMetric(index, value) {
                this.$data[`cm${index}`] = value;
            },
            setCustomDimension(index, value) {
                this.$data[`cd${index}`] = value;
            },
            setParameter(parameter, value) {
                this.$parameters[parameter] = value;
            },
            setOptimizeExperiment(experimentId, variation) {
                this.$parameters[`exp`] = `${experimentId}.${variation}`;
            },
        };
    }
}
exports.GoogleAnalytics = GoogleAnalytics;
//# sourceMappingURL=GoogleAnalytics.js.map