import { GoogleAnalytics } from "./GoogleAnalytics";
import * as ua from 'universal-analytics';
import _get = require('lodash.get');
import { GoogleActionRequest } from 'jovo-platform-googleassistant';
import { HandleRequest, Jovo, JovoError, ErrorCode } from "jovo-core";

export class GoogleAnalyticsAssistant extends GoogleAnalytics {
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

        if (!jovo.isGoogleAction()) {
            return;
        }

        super.track(handleRequest);
    }

    initVisitor(jovo: Jovo) {
        super.initVisitor(jovo);

        const request = jovo.$request as GoogleActionRequest;
        const deviceInfo = `Google Assistant Device - ${request.hasScreenInterface() ? 'Display Support' : 'Voice Only'}`;

        // fake UserAgent which makes GA mappping device to browser field and platform type to mobile
        this.visitor!.set("userAgentOverride", `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`);
    }

    setGoogleAnalyticsObject(handleRequest: HandleRequest) {
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

        if (!jovo.isGoogleAction()) {
            return;
        }

        super.setGoogleAnalyticsObject(handleRequest);
    }
}