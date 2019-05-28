
import { Plugin, PluginConfig, BaseApp, HandleRequest, Jovo, Util, User, JovoData, Analytics, JovoError, ErrorCode } from 'jovo-core';
import { JovoUser, App } from 'jovo-framework';
import { AlexaRequest } from 'jovo-platform-alexa';
import * as util from 'util';

//import { AlexaRequest } from '/home/anjovo/github/ownRepos/jovo-framework/jovo-integrations/jovo-platform-alexa';
import { GoogleAssistant, GoogleActionRequest } from 'jovo-platform-googleassistant';


import * as ua from 'universal-analytics';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import { eventNames } from 'cluster';
import * as murmurhash from 'murmurhash';
//import * as UserAgent from 'user-agents';


export interface Config extends PluginConfig {
    trackingId: string;
}

export interface EventParameters {
    ec: string;
    ea: string;
    el?: string;
    ev?: number;
    dp?: string;
}





//export class GoogleAnalyticsSender implements Plugin {
/**
 * @public
 */
export class GoogleAnalyticsSender implements Analytics {


    name?: string | undefined;
    jovo?: Jovo | undefined;
    //visitor?: ua.Visitor | undefined;

    config: Config = {
        //'accountId': "UA-137590211-1",
        trackingId: ""
    };

    //      "allowSyntheticDefaultImports": true

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.track = this.track.bind(this);

        //this.visitor = ua(this.config.accountId);  //make random user
        //this.visitor = ua(this.config.accountId, "amzn1.ask.account.AGC3UQ3VLWTFZCEM3ARE2XESLM47N5ZTSCMRUAOUWOZ7D7OXC75VJPIUOILTHDURUEMDXEO42ME4MPLWYWBFDAXVV7JZVXJCOFVK62NIYBKLH4WEABHVGRD57XHFSRUY2H2VNWV77TDWB7VF52W6UGITB2LUL7UNL4FERENCG2SL3JRCXYADZ6DZJZEPMWUOZZLXC7QKJB7RPBA", {strictCidFormat: false});
        //this.visitor = ua(this.config.accountId, jovoId, {strictCidFormat: false});
        //this.visitor = ua(this.config.accountId, {strictCidFormat: false});
    }

    track(handleRequest: HandleRequest): void {
        this.sendDataToGA.bind(this);
    }



    install(app: BaseApp): void {
        //app.middleware('platform.init')!.use(this.InitVisitor.bind(this));
        //app.middleware('response')!.use(this.InitVisitor.bind(this));
        if (!this.config.trackingId) {
            throw new JovoError("Google Analytics tracking id was not found.",
                ErrorCode.ERR_PLUGIN,
                'jovo-analytics-googleanalytics',
                "trackingId needs to be added to config.js. See https://www.jovo.tech/docs/analytics/dashbot for details.",
                "You can find your tracking id in GoogleAnalytics by clicking: Admin -> Property Settings -> Tracking Id"
            )
        }
        else {
            console.log("tracking id is: " + this.config.trackingId);
            app.middleware('platform.nlu')!.use(this.setJovoObjectAccess.bind(this));
            app.middleware('after.response')!.use(this.sendDataToGA.bind(this));//use(this.track);
            app.middleware('fail')!.use(this.sendErrorToGA.bind(this));
            console.log("added GA events");
        }
    }
    uninstall(parent?: any): void {

    }

    /**
     * Sets the analytics variable to the instance of this object for making it accessable in skill code
     * @param handleRequest 
     */
    setJovoObjectAccess(handleRequest: HandleRequest) {
        if (handleRequest.jovo) {
            handleRequest.jovo!.$analytics = this;
            this.jovo = handleRequest.jovo;
            console.log("analytics avaiable");
        }
        else {
            this.throwJovoNotSetError();
        }
    }

    /**
     * Pageviews should allways send intent data -> method returns standard
     */
    getCurrentPageParameters(): ua.PageviewParams | undefined {
        if (this.jovo) {
            const intentName = this.jovo.getMappedIntentName() ? this.jovo.getMappedIntentName()! : this.jovo.$type.type!;

            const standardPageviewParameters: ua.PageviewParams = {
                dp: this.getPageName(),
                dt: intentName,
                dh: intentName
            };

            return standardPageviewParameters;
        }
        else {
            this.throwJovoNotSetError();
            return undefined;
        }
    }

    /**
     * SendEvent with parameters are custom
     * @param visitor 
     * @param jovo 
     * @param eventParameters 
     */
    sendIntentEvent(visitor: ua.Visitor, eventParameters: EventParameters) {
        visitor
            .event(
                eventParameters,
            )
            .send();
    }

    throwJovoNotSetError() {
        throw new JovoError("Could not make GooleAnalytics avaiable to skill.",
            ErrorCode.ERR_PLUGIN,
            'jovo-analytics-googleanalytics',
            "Jovo Instance was not available",
            "Contact admin. "
        )
    }

    /**
     * Generates Hash for User Id
     * @param jovo 
     */
    getUserId(): string {
        //let idHash = murmurhash.v3(jovo.$user.getId()!) + murmurhash.v3(jovo.getDeviceId()!); //for local testing via different devices 
        if (this.jovo) {
            const idHash = murmurhash.v3(this.jovo.$user.getId()!);

            //let uuid = idHash + "_uniqueUser"; //for local testing
            const uuid = idHash.toString();
            return uuid;
        }
        else {
            this.throwJovoNotSetError();
            return "jovoNotSet";
        }
    }

    /**
     * Generates pageName from State and Intent Name
     * @param jovo 
     */
    getPageName() {
        if (this.jovo) {
            const intentName = this.jovo.getMappedIntentName() ? this.jovo.getMappedIntentName()! : this.jovo.$type.type!;
            const state = this.jovo.getState() ? this.jovo.getState() : "/";
            return `${state}.${intentName}`;
        }

        else {
            this.throwJovoNotSetError();
            return "jovoNotSet";
        }

    }


    static getScreenResolution(alexaRequest: any): string {
        // console.log(alexaRequest);
        let device = '';

        const viewPort = _get(alexaRequest, 'context.Viewport');
        if (viewPort) {

            device = _get(viewPort, 'pixelWidth') + 'x' + _get(viewPort, 'pixelHeight');
        }

        return device;
    }

    /**
     * Visitor initiation which sets needed fixed parameters
     * @param jovo
     */
    initVisitor(): ua.Visitor | undefined {

        if (this.jovo) {
            const uuid = this.getUserId();

            const visitor = ua(this.config.trackingId, uuid,
                {
                    strictCidFormat: false,
                    //cid: idHash.toString(),
                    //uid: idHash+ "_user"

                });
            visitor.set("ds", this.jovo.getPlatformType()); // data source
            visitor.set("ul", this.jovo.getLocale());
            visitor.set("cd1", uuid);

            let deviceInfo = "notSet";

            if (this.jovo.isAlexaSkill()) {
                //deviceInfo = GoogleAnalyticsSender.getAlexaDevice(jovo.$request);
                const alexaRequest = this.jovo.$request as AlexaRequest;
                deviceInfo = alexaRequest.getAlexaDevice();
                visitor.set("sr", GoogleAnalyticsSender.getScreenResolution(this.jovo.$request));
            }

            else if (this.jovo.isGoogleAction()) {
                //let  gAssistantRequest = jovo.$googleAction!.$request as GoogleActionRequest;
                console.log(util.inspect(this.jovo.$request!));
                if (this.jovo.$request!.hasScreenInterface()) {
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
        else {
            this.throwJovoNotSetError();
            return undefined;
        }
    }

    /**
     * User Events ties users to event category and action
     * @param eventName maps to category -> eventGroup
     * @param eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(eventCategory: string, eventElement = "defaultItem") {

        if (this.jovo) {
            console.log("this in sendEvent: " + util.inspect(this));

            const visitor = this.initVisitor();
            if (visitor) {

                const eventParams: EventParameters = {
                    ec: eventCategory,
                    ea: eventElement,
                    el: this.getUserId(),
                    dp: this.getPageName()
                };
                //console.log('visitor in subclass: '+ util.inspect(this.visitor));
                this.sendIntentEvent(visitor, eventParams);
            }
            else {
                console.error("Missing Google Analytics visitor. Is: " + visitor);
            }
        }
        else {
            this.throwJovoNotSetError();
        }
    }


    /**
     * Auto send intent data after each response. Also setting sessions and flowErrors 
     * @param handleRequest 
     */
    sendDataToGA(handleRequest: HandleRequest) {
        console.log("start sending data to GA...");
        const jovo: Jovo = handleRequest.jovo!;

        const visitor = this.initVisitor();

        if (visitor) {
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
                    if (entry[0].startsWith("cm") && entry[1]) {   //check if custom dimension data and only add if value
                        visitor.set(entry[0], entry[1]);
                        console.log(`${entry[0]} : ${entry[1]} -> custom metric added to visitor`);

                    }
                });
            }
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
            const intentName = jovo.getMappedIntentName() ? jovo.getMappedIntentName()! : jovo.$type.type!;

            console.log(`set ìntentName to: ${intentName}`);

            const uuid = this.getUserId();
            console.log("argument: " + _get(jovo.$request!, 'originalDetectIntentRequest.payload.inputs[0].arguments[0].name'));
            const isHealtCheck = (_get(jovo.$request!, 'originalDetectIntentRequest.payload.inputs[0].arguments[0].name') === 'is_health_check') || uuid === '464556658';

            if (!isHealtCheck) {
                console.log("is no healtcheck -> send page");
                //send Intent Name + standard Info
                visitor!
                    .pageview(this.getCurrentPageParameters()!, (error) => {
                        error ? console.log("Error during sending pageview data: " + error!.message) : console.log("no Error sending Intent Data");
                    })
                    .send();
                console.log("*****SENT DATA TO GOOGLE Analytics");
            }

            else {
                console.log("is healtcheck -> skip");
            }

            console.log("reason is in request? " + util.inspect(jovo.$request!));

            //Detect and Send Flow Errors 
            if (jovo.$request!.getIntentName() === "AMAZON.FallbackIntent" || jovo.$request!.getIntentName() === 'Default Fallback Intent') {
                this.sendUserEvent("FlowError", "nluUnhandled");
                console.log("...nlu undhandled");
            }
            else if (handleRequest.jovo!.getRoute().path.endsWith("Unhandled")) {
                this.sendUserEvent("FlowError", "skillUnhandled");
                console.log("...skill unhandled");
            }
            else if (jovo.getRoute().type === "END") {  //check for sessionEndedRequests with failure reason
                if (jovo.isAlexaSkill()) { //only avaiable momently for Alexa Skills
                    const alexaRequest = jovo.$request as AlexaRequest;
                    console.log(`..is session Ended Request.. checking reason..`);
                    if (alexaRequest.request!.reason === 'EXCEEDED_MAX_REPROMPTS') {
                        this.sendUserEvent("FlowError", "exceeded reprompts");
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
            if (jovo.$inputs) {  //add all slot values
                Object.entries(jovo.$inputs).forEach(entry => {
                    if (entry[1].key) {   //only add if input has value
                        let eventParameters: EventParameters = {
                            ec: "SlotInput",
                            ea: entry[1].key, //slot value
                            el: entry[0],   //slot name
                            dp: this.getPageName()
                        };
                        this.sendIntentEvent(visitor, eventParameters);
                        console.log(`${entry[0]} has value ${entry[1].key} -> added`);

                    }
                });
            }

        }
        else {
            console.error("Missing Google Analytics visitor. Is: " + visitor);
        }
    }

    /**
     * Auto send Exception to Google Analytics if Error
     * @param handleRequest 
     */
    sendErrorToGA(handleRequest: HandleRequest) {
        const jovo = handleRequest.jovo!;
        const visitor = this.initVisitor();
        if (visitor) {
            visitor.set("sc", "end");
            visitor.
                pageview(this.getCurrentPageParameters()!, (error) => {
                    error ? console.log(error!.message) : console.log("no Error sending Intent Data");
                })
                .exception(handleRequest.error!.name)
                .send();
        }
        else {
            console.error("Missing Google Analytics visitor. Is: " + visitor);
        }
    }

}