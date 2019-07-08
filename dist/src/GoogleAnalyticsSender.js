"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const ua = require("universal-analytics");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const murmurhash = require("murmurhash");
const DeveloperTrackingMethods_1 = require("./DeveloperTrackingMethods");
//export class GoogleAnalyticsSender implements Plugin {
/**
 * @public
 */
class GoogleAnalyticsSender {
    constructor(config) {
        this.config = {
            trackingId: ""
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }
    track(handleRequest) {
        this.sendDataToGA.bind(this);
    }
    install(app) {
        if (!this.config.trackingId) {
            throw new jovo_core_1.JovoError("Google Analytics tracking id was not found.", jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', "trackingId needs to be added to config.js. See https://www.jovo.tech/docs/analytics/dashbot for details.", "You can find your tracking id in GoogleAnalytics by clicking: Admin -> Property Settings -> Tracking Id");
        }
        else {
            console.log("tracking id is: " + this.config.trackingId);
            app.middleware('platform.nlu').use(this.setJovoObjectAccess.bind(this));
            app.middleware('after.response').use(this.sendDataToGA.bind(this)); //use(this.track);
            app.middleware('fail').use(this.sendErrorToGA.bind(this));
            console.log("added GA events");
        }
    }
    uninstall(parent) {
    }
    /**
     * Sets the analytics variable to the instance of this object for making it accessable in skill code
     * @param handleRequest
     */
    setJovoObjectAccess(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            return this.throwJovoNotSetError();
        }
        jovo.$googleAnalytics = new DeveloperTrackingMethods_1.DeveloperTrackingMethods(this, jovo);
    }
    /**
     * Pageviews should allways send intent data -> method returns standard
     */
    getCurrentPageParameters(jovo) {
        if (!jovo) {
            this.throwJovoNotSetError();
        }
        const intentName = jovo.getMappedIntentName() ? jovo.getMappedIntentName() : jovo.$type.type;
        const standardPageviewParameters = {
            dp: this.getPageName(jovo),
            dh: jovo.$type.type,
            dt: intentName
        };
        return standardPageviewParameters;
    }
    /**
     * SendEvent with parameters are custom
     * @param visitor
     * @param eventParameters
     */
    sendIntentEvent(visitor, eventParameters) {
        visitor
            .event(eventParameters)
            .send();
    }
    sendEvent(jovo, eventParameters) {
        const visitor = this.initVisitor(jovo);
        visitor
            .event(eventParameters)
            .send();
    }
    sendTransaction(jovo, transactionParams) {
        const visitor = this.initVisitor(jovo);
        visitor
            .transaction(transactionParams)
            .send();
    }
    sendItem(jovo, itemParams) {
        const visitor = this.initVisitor(jovo);
        visitor
            .transaction(itemParams)
            .send();
    }
    /**
     * throws an error if jovo was not set
     */
    throwJovoNotSetError() {
        throw new jovo_core_1.JovoError("Could not make GooleAnalytics available to skill.", jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', "Jovo Instance was not available", "Contact admin.");
    }
    /**
     * Generates Hash for User Id
     * @param jovo
     */
    getUserId(jovo) {
        if (!jovo) {
            this.throwJovoNotSetError();
        }
        //let idHash = murmurhash.v3(jovo.$user.getId()!) + murmurhash.v3(jovo.getDeviceId()!); //for local testing via different devices 
        const idHash = murmurhash.v3(jovo.$user.getId());
        const uuid = idHash.toString();
        return uuid;
    }
    /**
     * Generates pageName from State and Intent Name
     * @param jovo
     */
    getPageName(jovo) {
        if (!jovo) {
            this.throwJovoNotSetError();
        }
        const intentName = jovo.getMappedIntentName() ? jovo.getMappedIntentName() : jovo.$type.type;
        const state = jovo.getState() ? jovo.getState() : "/";
        return `${state}.${intentName}`;
    }
    /**
     * Visitor initiation which sets needed fixed parameters
     * @param jovo
     */
    initVisitor(jovo) {
        if (!jovo) {
            this.throwJovoNotSetError();
        }
        const uuid = this.getUserId(jovo);
        const visitor = ua(this.config.trackingId, uuid, {
            strictCidFormat: false,
        });
        //const visitor = ua(this.config.trackingId, {uid: uuid});
        visitor.set('uid', uuid);
        visitor.set("dataSource", jovo.getPlatformType()); //save segment information to seperate alexa and assistant data
        visitor.set("userLanguage", jovo.getLocale());
        visitor.set("cd1", uuid); //custom dimension for userId at hit scope (in GA)
        //setting medium/source for referral 
        const launchType = _get(jovo.$request, 'request.launchRequestType'); //only referrer has a launchType property
        if (launchType) {
            visitor.set("campaignMedium", "referral");
            visitor.set("campaignSource", _get(jovo.$request, 'request.metadata.referrer'));
        }
        return visitor;
    }
    sendCustomMetric(jovo, indexInGA, value) {
        const metricKey = "cm" + indexInGA;
        jovo.$data[metricKey] = value;
    }
    sendUserTransaction(jovo, transactionId) {
        if (!jovo) {
            this.throwJovoNotSetError();
        }
        this.initVisitor(jovo)
            .transaction({ ti: transactionId, "tr": "1" });
    }
    /**
     * User Events ties users to event category and action
     * @param eventName maps to category -> eventGroup
     * @param eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(jovo, eventCategory, eventElement = "defaultItem") {
        if (!jovo) {
            this.throwJovoNotSetError();
        }
        const visitor = this.initVisitor(jovo);
        if (visitor) {
            const eventParams = {
                eventCategory: eventCategory,
                eventAction: eventElement,
                eventLabel: this.getUserId(jovo),
                documentPath: this.getPageName(jovo)
            };
            this.sendIntentEvent(visitor, eventParams);
        }
        else {
            console.error("Missing Google Analytics visitor. Is: " + visitor);
        }
    }
    sendFlowErrors(jovo) {
        //Detect and Send Flow Errors 
        if (jovo.$request.getIntentName() === "AMAZON.FallbackIntent" || jovo.$request.getIntentName() === 'Default Fallback Intent') {
            this.sendUserEvent(jovo, "FlowError", "nluUnhandled");
        }
        else if (jovo.getRoute().path.endsWith("Unhandled")) {
            this.sendUserEvent(jovo, "FlowError", "skillUnhandled");
        }
    }
    /**
     * Checks if session started or ended
     * returns end, start, undefined
     */
    getSessionTag(jovo) {
        let sessionTag = undefined;
        //Launch Request
        if (jovo.isNewSession()) {
            sessionTag = 'start'; //Set session start
        }
        //jovo.$type
        if (jovo.getMappedIntentName() === 'END') {
            sessionTag = 'end';
        }
        //end session if session Ended Request
        if (jovo.$type === "END") {
            sessionTag = 'end';
        }
        return sessionTag;
    }
    /**
     * Auto send intent data after each response. Also setting sessions and flowErrors
     * @param handleRequest
     */
    sendDataToGA(handleRequest) {
        console.log("start sending data to GA...");
        const jovo = handleRequest.jovo;
        const visitor = this.initVisitor(jovo);
        if (!visitor) {
            console.error("Missing Google Analytics visitor. Is: " + visitor);
        }
        const sessionTag = this.getSessionTag(jovo);
        if (sessionTag) {
            visitor.set("sessionControl", sessionTag);
        }
        //Search for custom metrics set by user
        if (jovo.$data) {
            Object.entries(jovo.$data).forEach(entry => {
                const dataKey = entry[0];
                const dataValue = entry[1];
                if (dataKey.startsWith("cm") && dataValue) { //check if custom dimension data and only add if value
                    visitor.set(dataKey, dataValue);
                }
            });
        }
        const intentName = jovo.getMappedIntentName() ? jovo.getMappedIntentName() : jovo.$type.type;
        //send Intent Name + standard Info
        visitor
            .pageview(this.getCurrentPageParameters(jovo), (error) => {
            error ? console.log("Error during sending pageview data: " + error.message) : console.log("no Error sending Intent Data");
        })
            .send();
        console.log("*****SENT DATA TO GOOGLE Analytics");
        //Detect and Send Flow Errors 
        this.sendFlowErrors(jovo);
        //send Slot data as events if there
        if (jovo.$inputs) { //add all slot values
            Object.entries(jovo.$inputs).forEach(entry => {
                const slotName = entry[0];
                const slotValue = entry[1];
                if (slotValue.key) { //only add if input has value
                    const eventParameters = {
                        eventCategory: "SlotInput",
                        eventAction: slotValue.key,
                        eventLabel: slotName,
                        documentPath: this.getPageName(jovo)
                    };
                    this.sendIntentEvent(visitor, eventParameters);
                    console.log(`${slotName} has value ${slotValue.key} -> added`);
                }
            });
        }
    }
    /**
     * Auto send Exception to Google Analytics if Error
     * @param handleRequest
     */
    sendErrorToGA(handleRequest) {
        const jovo = handleRequest.jovo;
        const visitor = this.initVisitor(jovo);
        if (!visitor) {
            console.error("Missing Google Analytics visitor. Is: " + visitor);
        }
        visitor.set("sessionControl", "end");
        visitor.
            pageview(this.getCurrentPageParameters(jovo), (error) => {
            error ? console.log(error.message) : console.log("no Error sending Intent Data");
        })
            .exception(handleRequest.error.name)
            .send();
    }
}
exports.GoogleAnalyticsSender = GoogleAnalyticsSender;
//# sourceMappingURL=GoogleAnalyticsSender.js.map