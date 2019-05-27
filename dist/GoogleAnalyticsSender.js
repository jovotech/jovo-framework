"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const ua = require("universal-analytics");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const murmurhash = require("murmurhash");
class GoogleAnalyticsSender {
    //      "allowSyntheticDefaultImports": true
    constructor(config) {
        //visitor?: ua.Visitor | undefined;
        this.config = {
            //'accountId': "UA-137590211-1",
            accountId: "notSet"
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        //this.visitor = ua(this.config.accountId);  //make random user
        //this.visitor = ua(this.config.accountId, "amzn1.ask.account.AGC3UQ3VLWTFZCEM3ARE2XESLM47N5ZTSCMRUAOUWOZ7D7OXC75VJPIUOILTHDURUEMDXEO42ME4MPLWYWBFDAXVV7JZVXJCOFVK62NIYBKLH4WEABHVGRD57XHFSRUY2H2VNWV77TDWB7VF52W6UGITB2LUL7UNL4FERENCG2SL3JRCXYADZ6DZJZEPMWUOZZLXC7QKJB7RPBA", {strictCidFormat: false});
        //this.visitor = ua(this.config.accountId, jovoId, {strictCidFormat: false});
        //this.visitor = ua(this.config.accountId, {strictCidFormat: false});
    }
    static getAlexaDevice(alexaRequest) {
        // console.log(alexaRequest);
        let device = 'Echo (voice only)';
        const viewPort = _get(alexaRequest, 'context.Viewport');
        if (viewPort) {
            device = _get(viewPort, 'pixelWidth') + 'x' + _get(viewPort, 'pixelHeight');
            if (_get(viewPort, 'pixelWidth') === 1280 &&
                _get(viewPort, 'pixelHeight') === 720) {
                device = 'HD Ready TV';
            }
            if (_get(viewPort, 'pixelWidth') === 1920 &&
                _get(viewPort, 'pixelHeight') === 1080) {
                device = 'Full HD TV';
            }
            if (_get(viewPort, 'pixelWidth') === 480 &&
                _get(viewPort, 'pixelHeight') === 480) {
                device = 'Echo Spot';
            }
            if (_get(viewPort, 'pixelWidth') === 1024 &&
                _get(viewPort, 'pixelHeight') === 600) {
                device = 'Echo Show 1st gen';
            }
            if (_get(viewPort, 'pixelWidth') === 1280 &&
                _get(viewPort, 'pixelHeight') === 800) {
                device = 'Echo Show 2nd gen';
            }
        }
        return device;
    }
    static getScreenResolution(alexaRequest) {
        // console.log(alexaRequest);
        let device = '';
        const viewPort = _get(alexaRequest, 'context.Viewport');
        if (viewPort) {
            device = _get(viewPort, 'pixelWidth') + 'x' + _get(viewPort, 'pixelHeight');
        }
        return device;
    }
    install(app) {
        //app.middleware('platform.init')!.use(this.InitVisitor.bind(this));
        //app.middleware('response')!.use(this.InitVisitor.bind(this));
        app.middleware('after.response').use(this.sendDataToAnalytics.bind(this));
        app.middleware('fail').use(this.sendErrorToGoogle.bind(this));
    }
    uninstall(parent) {
    }
    /**
     * Pageviews should allways send intent data -> method returns standard
     * @param jovo
     */
    getCurrentPageParameters(jovo) {
        const intentName = jovo.getMappedIntentName() ? jovo.getMappedIntentName() : jovo.$type.type;
        const standardPageviewParameters = {
            dp: this.getPageName(jovo),
            dt: intentName,
            dh: intentName
        };
        return standardPageviewParameters;
    }
    /**
     * SendEvent with parameters are custom
     * @param visitor
     * @param jovo
     * @param eventParameters
     */
    sendIntentEvent(visitor, jovo, eventParameters) {
        visitor
            .event(eventParameters)
            .send();
    }
    /**
     * Generates Hash for User Id
     * @param jovo
     */
    getUserId(jovo) {
        //let idHash = murmurhash.v3(jovo.$user.getId()!) + murmurhash.v3(jovo.getDeviceId()!); //for local testing via different devices 
        const idHash = murmurhash.v3(jovo.$user.getId());
        //let uuid = idHash + "_uniqueUser"; //for local testing
        const uuid = idHash.toString();
        return uuid;
    }
    /**
     * Generates pageName from State and Intent Name
     * @param jovo
     */
    getPageName(jovo) {
        const intentName = jovo.getMappedIntentName() ? jovo.getMappedIntentName() : jovo.$type.type;
        const state = jovo.getState() ? jovo.getState() : "/";
        return `${state}.${intentName}`;
    }
    /**
     * Visitor initiation which sets needed fixed parameters
     * @param jovo
     */
    initVisitor(jovo) {
        const uuid = this.getUserId(jovo);
        const visitor = ua(this.config.accountId, uuid, {
            strictCidFormat: false,
        });
        visitor.set("ds", jovo.getPlatformType()); // data source
        visitor.set("ul", jovo.getLocale());
        visitor.set("cd1", uuid);
        let deviceInfo = "notSet";
        if (jovo.isAlexaSkill()) {
            //deviceInfo = GoogleAnalyticsSender.getAlexaDevice(jovo.$request);
            const alexaRequest = jovo.$request;
            deviceInfo = alexaRequest.getAlexaDevice();
            visitor.set("sr", GoogleAnalyticsSender.getScreenResolution(jovo.$request));
        }
        else if (jovo.isGoogleAction()) {
            //let  gAssistantRequest = jovo.$googleAction!.$request as GoogleActionRequest;
            console.log(util.inspect(jovo.$request));
            if (jovo.$request.hasScreenInterface()) {
                deviceInfo = "Assistant device - with Screen";
            }
            else {
                deviceInfo = "Assistant device - voice Only";
            }
        }
        console.log("*****************Device:        " + deviceInfo);
        //visitor.set('ua', process.platform + ' ' + require('os').release());
        //        visitor.set("ua", "Mozilla/5.0 (PlattformTest; Android 6.0.1; SM-G900F Build/MMB29M) Gecko/20100101 newBrowser/66.0");
        //visitor.set("ua", "Mozilla/5.0 (Linux; Android 6.0.1; SM-G900F Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36");
        visitor.set("ua", `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`);
        /*  visitor.set("vp", "test2");
         visitor.set("sd", "test3");
         visitor.set("an", "test4");
         visitor.set("cs", "skill");
         visitor.set("cm", "testmedium"); */
        /*  let visitor = ua(this.config.accountId,
             {
                 strictCidFormat: false,
                 cid: idHash.toString(),
                 uid: idHash + "_user"
             }
         ); */
        return visitor;
    }
    /**
     * User Events ties users to event category and action
     * @param jovo
     * @param eventName maps to category -> eventGroup
     * @param eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(jovo, eventName, eventElement = "defaultItem") {
        const visitor = this.initVisitor(jovo);
        const eventParams = {
            ec: eventName,
            ea: eventElement,
            el: this.getUserId(jovo),
            dp: this.getPageName(jovo)
        };
        //console.log('visitor in subclass: '+ util.inspect(this.visitor));
        this.sendIntentEvent(visitor, jovo, eventParams);
    }
    /**
     * Auto send intent data after each response. Also setting sessions and flowErrors
     * @param handleRequest
     */
    sendDataToAnalytics(handleRequest) {
        const jovo = handleRequest.jovo;
        /*   if (handleRequest.jovo!.isAlexaSkill()) {
              console.log('bla');
          } */
        //let visitor = ua(this.config.accoviuntId, { uid:  });
        //this.visitor.set("uid", jovo.$user.getId()!);
        const visitor = this.initVisitor(jovo);
        if (jovo.isNewSession()) {
            visitor.set("sc", 'start');
        }
        //jovo.$type
        if (jovo.getMappedIntentName() === 'END') {
            console.log("is end Intent -> setting endSession tag");
            visitor.set("sc", 'end');
        }
        //end session if session Ended Request
        if (jovo.$type === "END") {
            console.log("is session Ended Request -> setting endSession tag");
            visitor.set("sc", 'end');
            /* if(jovo.getType()==="AlexaSkill")   {
                jovo.isA
                if(jovo.$)
            }
            if(jovo.isAlexaSkill()) */
        }
        //Search for custom metrics set by user
        if (jovo.$data) {
            console.log("*******CHECKING FOR CUSTOM METRICS: ");
            console.log("data: " + util.inspect(jovo.$data));
            Object.entries(jovo.$data).forEach(entry => {
                console.log("key: " + entry[0]);
                if (entry[0].startsWith("cm") && entry[1]) { //check if custom dimension data and only add if value
                    visitor.set(entry[0], entry[1]);
                    console.log(`${entry[0]} : ${entry[1]} -> custom metric added to visitor`);
                }
            });
        }
        if (visitor) {
            //test Event for special Intent Types:
            /* let eventParams: EventParameters = {
                ec: "LocationIntent",
                ea: "actionTest",
                el : jovo.$user.getId()!
            }
 */
            /*             this.visitor!
                            .event(
                                eventParams
                            )
                            .send(); */
            //this.visitor.set("uid", "123456789");
            //this.visitor.set("cid", "d05aad4f-5fad-4e18-b620-780863ad03b1");
            console.log("permanent uid visitor: " + util.inspect(visitor));
            //let intentName = jovo.getMappedIntentName() ? jovo.getMappedIntentName()! : "LAUNCH";
            const intentName = jovo.getMappedIntentName() ? jovo.getMappedIntentName() : jovo.$type.type;
            console.log(`set ìntentName to: ${intentName}`);
            const uuid = this.getUserId(jovo);
            console.log("argument: " + _get(jovo.$request, 'originalDetectIntentRequest.payload.inputs[0].arguments[0].name'));
            const isHealtCheck = (_get(jovo.$request, 'originalDetectIntentRequest.payload.inputs[0].arguments[0].name') === 'is_health_check') || uuid === '464556658';
            if (!isHealtCheck) {
                console.log("is no healtcheck -> send page");
                //send Intent Name + standard Info
                visitor
                    .pageview(this.getCurrentPageParameters(jovo), (error) => {
                    error ? console.log(error.message) : console.log("no Error sending Intent Data");
                })
                    .send();
                console.log("*****SEND DATA TO GOOGLE Analytics");
            }
            else {
                console.log("is healtcheck -> skip");
            }
            console.log("reason is in request? " + util.inspect(jovo.$request));
            //Detect and Send Flow Errors 
            if (jovo.$request.getIntentName() === "AMAZON.FallbackIntent" || jovo.$request.getIntentName() === 'Default Fallback Intent') {
                this.sendUserEvent(jovo, "FlowError", "nluUnhandled");
                console.log("...nlu undhandled");
            }
            else if (handleRequest.jovo.getRoute().path.endsWith("Unhandled")) {
                this.sendUserEvent(jovo, "FlowError", "skillUnhandled");
                console.log("...skill unhandled");
            }
            else if (jovo.getRoute().type === "END") { //check for sessionEndedRequests with failure reason
                if (jovo.isAlexaSkill()) { //only avaiable momently for Alexa Skills
                    const alexaRequest = jovo.$request;
                    console.log(`..is session Ended Request.. checking reason..`);
                    if (alexaRequest.request.reason === 'EXCEEDED_MAX_REPROMPTS') {
                        this.sendUserEvent(jovo, "FlowError", "exceeded reprompts");
                        console.log("'..send exceeded reprompts event to GA.");
                    }
                    else {
                        console.log(`session Ended Request with no flow Errors. Route: ${util.inspect(jovo.getRoute())}`);
                    }
                }
            }
            else {
                console.log(`no flow Errors. Route: ${util.inspect(jovo.getRoute())}`);
            }
            //send Slot data as events if there
            if (jovo.$inputs) { //add all slot values
                Object.entries(jovo.$inputs).forEach(entry => {
                    if (entry[1].key) { //only add if input has value
                        let eventParameters = {
                            ec: "SlotInput",
                            ea: entry[1].key,
                            el: entry[0],
                            dp: this.getPageName(jovo)
                        };
                        this.sendIntentEvent(visitor, jovo, eventParameters);
                        console.log(`${entry[0]} has value ${entry[1].key} -> added`);
                    }
                });
            }
        }
        else {
            console.log("visitor was not set");
        }
    }
    /**
     * Auto send Exception to Google Analytics if Error
     * @param handleRequest
     */
    sendErrorToGoogle(handleRequest) {
        const jovo = handleRequest.jovo;
        const visitor = this.initVisitor(jovo);
        visitor.set("sc", "end");
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