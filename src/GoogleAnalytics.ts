import * as ua from 'universal-analytics';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import * as murmurhash from 'murmurhash';
import { Analytics, BaseApp, ErrorCode, HandleRequest, Jovo, JovoError } from 'jovo-core';
import { Config, Event, Item, Transaction } from './interfaces';

// import { DeveloperTrackingMethods } from './DeveloperTrackingMethods';

export class GoogleAnalytics implements Analytics {
    config: Config = {
        trackingId: ''
    };
    visitor: ua.Visitor | undefined;
    platform: string | undefined;

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(app: BaseApp) {
        if (!this.config.trackingId) {
            throw new JovoError(
                'trackingId must be set',
                ErrorCode.ERR_PLUGIN,
                'jovo-analytics-googleanalytics',
                'trackingId needs to be added to config.js. See https://www.jovo.tech/docs/analytics/dashbot for details.',
                'You can find your tracking id in GoogleAnalytics by clicking: Admin -> Property Settings -> Tracking Id'
            );
        }

        app.middleware('after.platform.init')!.use(this.setGoogleAnalyticsObject.bind(this));
        app.middleware('after.response')!.use(this.track.bind(this));
        app.middleware('fail')!.use(this.sendError.bind(this));
    }

    /**
     * Auto send intent data after each response. Also setting sessions and flowErrors 
     * @param handleRequest 
     */
    track(handleRequest: HandleRequest) {
        const jovo: Jovo = handleRequest.jovo!;
        if (!jovo) {
            throw new JovoError(
                'Jovo object is not set',
                ErrorCode.ERR_PLUGIN,
                'jovo-analytics-googleanalytics',
                'Jovo Instance was not available',
                'Contact admin.'
            );
        }

        // Initialise visitor object.
        this.initVisitor(jovo);

        // Eiter start or stop the session. If sessionTag is undefined, it will be ignored.
        const sessionTag = this.getSessionTag(jovo);
        this.visitor!.set('sessionControl', sessionTag);

        // Track custom set data as custom metrics.
        // TODO: test!
        const customData = jovo.$googleAnalytics.$data;
        for (const [key, value] of Object.entries(customData)) {
            if (key.startsWith('cm')) {
                this.visitor!.set(key, value);
            }
        }

        // Track intent data.
        // TODO: test mapped intents
        this.visitor!
            .pageview(this.getPageParameters(jovo), (err: any) => {
                if (err) {
                    throw new JovoError(
                        'Error while trying to track data.',
                        ErrorCode.ERR_PLUGIN,
                        'jovo-analytics-googleanalytics',
                        '',
                        ''
                    );
                }
            })
            .send();

        // Detect and send Flow Errors
        this.sendFlowErrors(jovo);

        if (jovo.$inputs) {
            for (const [key, value] of Object.entries(jovo.$inputs)) {
                if (!value.key) {
                    continue;
                }

                const params: Event = {
                    eventCategory: "SlotInput",
                    eventAction: value.key, //slot value
                    eventLabel: key,   //slot name
                    documentPath: jovo.getRoute().path
                };
                this.visitor!.event(params).send();
            }
        }
    }

    /**
     * Initiates GoogleAnalytics visitor object with fixed parameters.
     * @param {object} jovo: Jovo object for data like language or platform
     */
    initVisitor(jovo: Jovo) {
        const uuid = this.getUserId(jovo);

        // Initialize visitor with account id and custom client id
        const visitor = ua(this.config.trackingId, uuid, { strictCidFormat: false });
        visitor.set('userId', uuid);
        visitor.set('dataSource', jovo.getType());
        visitor.set('userLanguage', jovo.getLocale());
        // Set user id as a custom dimension to track hits on the same scope
        visitor.set('cd1', uuid);

        const referrer = _get(jovo.$request, 'request.metadata.referrer');
        if (referrer) {
            visitor.set("campaignMedium", "referral");
            visitor.set("campaignSource", referrer);
        }

        this.visitor = visitor;
    }

    /**
     * Auto send Exception to Google Analytics if Error
     * @param handleRequest 
     */
    sendError(handleRequest: HandleRequest) {
        const jovo: Jovo = handleRequest.jovo!;
        if (!jovo) {
            throw new JovoError(
                'Jovo object is not set',
                ErrorCode.ERR_PLUGIN,
                'jovo-analytics-googleanalytics',
                'Jovo Instance was not available',
                'Contact admin.'
            );
        }

        this.visitor!.set('sessionControl', 'end');
        this.visitor!
            .pageview(this.getPageParameters(jovo), (err: any) => {
                if (err) {
                    console.log('Error occured!');
                }
            })
            .exception(handleRequest.error!.name)
            .send();
    }

    sendFlowErrors(jovo: Jovo) {
        //Detect and Send Flow Errors 
        if (jovo.$request!.getIntentName() === "AMAZON.FallbackIntent" || jovo.$request!.getIntentName() === 'Default Fallback Intent') {
            this.sendUserEvent(jovo, "FlowError", "nluUnhandled");
        }
        else if (jovo!.getRoute().path.endsWith("Unhandled")) {
            this.sendUserEvent(jovo, "FlowError", "skillUnhandled");
        }
    }

    /**
     * Construct pageview parameters, a.k.a intent tracking data.
     * @returns {object} pageParameters: Intent data to track
     */
    getPageParameters(jovo: Jovo) {
        const { intent, path, type } = jovo.getRoute();
        return {
            documentPath: path,
            documentHostName: type,
            documentTitle: intent
        };
    }

    /**
     * Generates hash for userId.
     * @returns {string} uuid: Hashed user id
     */
    getUserId(jovo: Jovo): string {
        const idHash = murmurhash.v3(jovo.$user.getId()!);
        const uuid = idHash.toString();
        return uuid;
    }

    /**
     * Checks if the current session started or ended.
     * @returns {string | void} sessionTag: Corresponding session tag
     */
    getSessionTag(jovo: Jovo): string | void {
        if (
            jovo.getMappedIntentName() === 'END' ||
            jovo.$type.type === 'END' ||
            (jovo.$response && jovo.$response.isTell())
        ) {
            return 'end';
        }

        if (jovo.isNewSession()) {
            return 'start';
        }
    }

    /**
     * User Events ties users to event category and action
     * @param eventName maps to category -> eventGroup
     * @param eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(jovo: Jovo, eventCategory: string, eventElement = 'defaultItem') {
        const params: Event = {
            eventCategory,
            eventAction: eventElement,
            eventLabel: this.getUserId(jovo),
            documentPath: jovo.getRoute().path
        };

        this.visitor!.event(params).send();
    }

    /**
     * Sets the analytics variable to the instance of this object for making it accessable in skill code
     * @param handleRequest 
     */
    setGoogleAnalyticsObject(handleRequest: HandleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new JovoError(
                'Jovo object is not set',
                ErrorCode.ERR_PLUGIN,
                'jovo-analytics-googleanalytics',
                'Jovo Instance was not available',
                'Contact admin.'
            );
        }

        jovo.$googleAnalytics = {
            $data: {},
            sendEvent: (params: Event) => {
                this.visitor!.event(params).send();
            },
            sendTransaction: (params: Transaction) => {
                this.visitor!.transaction(params).send();
            },
            sendItem: (params: Item) => {
                this.visitor!.transaction(params).send();
            },
            sendUserEvent: this.sendUserEvent.bind(this),
            sendUserTransaction: (transactionId: string) => {
                this.visitor!.transaction({ ti: transactionId, tr: 1 });
            },
            setCustomMetric(index: number, value: string) {
                this.$data[`cm${index}`] = value;
            }
        };
    }
}